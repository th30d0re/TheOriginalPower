#!/usr/bin/env python3
"""
Time Machine Backup Searcher

Searches Time Machine backups for files by name, path, or content pattern.
Handles local snapshots, external backup disks, and APFS snapshot mounts.

Usage:
    python3 tm_search.py --name "*.tex"              # find by filename pattern
    python3 tm_search.py --path "Paper/The_Original"  # find by path substring
    python3 tm_search.py --recent 1 --name "*.tex"    # only most recent backup
    python3 tm_search.py --compare FILE               # show all versions of FILE
    python3 tm_search.py --restore FILE --to DEST     # restore a file

macOS Permission Note:
    If you get "Operation not permitted", grant Terminal/IDE Full Disk Access:
    System Settings → Privacy & Security → Full Disk Access → add your terminal app
"""

import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional, Iterator


@dataclass
class BackupRecord:
    """Represents a single backup snapshot or date-stamped backup."""
    date: datetime.datetime
    path: Path
    source: str  # 'local_snapshot', 'external_disk', 'timemachine_mount'
    label: str

    def to_dict(self):
        return {
            "date": self.date.isoformat(),
            "path": str(self.path),
            "source": self.source,
            "label": self.label,
        }


class TimeMachineExplorer:
    """Discovers and searches Time Machine backups."""

    def __init__(self):
        self.backups: List[BackupRecord] = []
        self._discovered = False

    # ------------------------------------------------------------------
    # Discovery
    # ------------------------------------------------------------------
    def discover(self) -> List[BackupRecord]:
        """Find every backup we can reach via tmutil or filesystem."""
        self.backups = []

        # 1. External / network destinations via tmutil
        self._discover_tmutil_destinations()

        # 2. Local APFS snapshots (if accessible)
        self._discover_local_snapshots()

        # 3. Legacy Backups.backupdb paths
        self._discover_backupdb_paths()

        # 4. /Volumes/.timemachine APFS mounts
        self._discover_timemachine_mounts()

        self._discovered = True
        # newest first
        self.backups.sort(key=lambda b: b.date, reverse=True)
        return self.backups

    def _discover_tmutil_destinations(self):
        """Parse `tmutil destinationinfo` for backup disk paths."""
        try:
            out = subprocess.run(
                ["tmutil", "destinationinfo"],
                capture_output=True, text=True, timeout=10
            )
            if out.returncode != 0:
                return
            for line in out.stdout.splitlines():
                if line.strip().startswith("URL"):
                    url = line.split(":", 1)[1].strip()
                    self._scan_destination_url(url)
        except Exception as e:
            print(f"[tmutil destinationinfo] {e}", file=sys.stderr)

    def _scan_destination_url(self, url: str):
        """Given a tmutil URL like file:///Volumes/BackupDisk/, scan it."""
        if url.startswith("file://"):
            path = Path(url[7:])
        else:
            path = Path(url)

        # Look for Backups.backupdb
        backupdb = path / "Backups.backupdb"
        if backupdb.exists():
            for machine_dir in backupdb.iterdir():
                if machine_dir.is_dir():
                    for entry in machine_dir.iterdir():
                        if entry.is_dir() and self._looks_like_date(entry.name):
                            dt = self._parse_date_folder(entry.name)
                            self.backups.append(
                                BackupRecord(
                                    date=dt,
                                    path=entry,
                                    source="external_disk",
                                    label=f"{machine_dir.name}/{entry.name}",
                                )
                            )

    def _discover_local_snapshots(self):
        """List local APFS snapshots via tmutil."""
        try:
            out = subprocess.run(
                ["tmutil", "listlocalsnapshots", "/"],
                capture_output=True, text=True, timeout=10
            )
            if out.returncode != 0:
                return
            for line in out.stdout.splitlines():
                line = line.strip()
                if line.startswith("com.apple.timemachine."):
                    snap_name = line
                    dt = self._parse_snapshot_name(snap_name)
                    # Snapshot data lives under /.MobileBackups or similar,
                    # but the canonical path is the snapshot mount point.
                    snap_path = Path(f"/.MobileBackups/Computer/{snap_name}")
                    if not snap_path.exists():
                        # macOS mounts snapshots at /Volumes/.timemachine/...
                        snap_path = Path("/")  # fallback
                    self.backups.append(
                        BackupRecord(
                            date=dt,
                            path=snap_path,
                            source="local_snapshot",
                            label=snap_name,
                        )
                    )
        except Exception as e:
            print(f"[local snapshots] {e}", file=sys.stderr)

    def _discover_backupdb_paths(self):
        """Scan /Volumes for any Backups.backupdb folders."""
        volumes = Path("/Volumes")
        if not volumes.exists():
            return
        try:
            for vol in volumes.iterdir():
                backupdb = vol / "Backups.backupdb"
                if not backupdb.exists() or not backupdb.is_dir():
                    continue
                try:
                    for machine_dir in backupdb.iterdir():
                        if not machine_dir.is_dir():
                            continue
                        try:
                            for entry in machine_dir.iterdir():
                                if entry.is_dir() and self._looks_like_date(entry.name):
                                    dt = self._parse_date_folder(entry.name)
                                    self.backups.append(
                                        BackupRecord(
                                            date=dt,
                                            path=entry,
                                            source="external_disk",
                                            label=f"{vol.name}/{machine_dir.name}/{entry.name}",
                                        )
                                    )
                        except PermissionError:
                            pass
                except PermissionError:
                    pass
        except PermissionError:
            pass

    def _discover_timemachine_mounts(self):
        """Scan /Volumes/.timemachine for mounted APFS backup stores."""
        tm_root = Path("/Volumes/.timemachine")
        if not tm_root.exists():
            return
        try:
            for store in tm_root.iterdir():
                if not store.is_dir():
                    continue
                # Inside each store are date-stamped snapshot directories
                try:
                    for entry in store.iterdir():
                        if entry.is_dir() and self._looks_like_date(entry.name):
                            dt = self._parse_date_folder(entry.name)
                            self.backups.append(
                                BackupRecord(
                                    date=dt,
                                    path=entry,
                                    source="timemachine_mount",
                                    label=f"{store.name}/{entry.name}",
                                )
                            )
                except PermissionError:
                    pass
        except PermissionError:
            pass

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _looks_like_date(name: str) -> bool:
        """Match folders like '2024-05-28-123456' or '2024-05-28-123456.local'."""
        return bool(re.match(r"\d{4}-\d{2}-\d{2}-\d{6}", name))

    @staticmethod
    def _parse_date_folder(name: str) -> datetime.datetime:
        """Parse '2024-05-28-123456' → datetime."""
        m = re.match(r"(\d{4}-\d{2}-\d{2})-(\d{2})(\d{2})(\d{2})", name)
        if m:
            return datetime.datetime.strptime(
                f"{m.group(1)} {m.group(2)}:{m.group(3)}:{m.group(4)}",
                "%Y-%m-%d %H:%M:%S",
            )
        return datetime.datetime.min

    @staticmethod
    def _parse_snapshot_name(name: str) -> datetime.datetime:
        """Parse com.apple.timemachine.2024-05-28-123456 → datetime."""
        m = re.search(r"(\d{4}-\d{2}-\d{2}-\d{6})", name)
        if m:
            return TimeMachineExplorer._parse_date_folder(m.group(1))
        return datetime.datetime.min

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------
    def search_name(
        self,
        pattern: str,
        max_backups: Optional[int] = None,
        case_sensitive: bool = False,
    ) -> Iterator[dict]:
        """Yield every file whose basename matches shell-style `pattern`."""
        if not self._discovered:
            self.discover()

        flags = 0 if case_sensitive else re.IGNORECASE
        regex = re.compile(fnmatch.translate(pattern), flags)

        backups = self.backups[:max_backups] if max_backups else self.backups
        for backup in backups:
            try:
                for root, _dirs, files in os.walk(backup.path):
                    for fname in files:
                        if regex.match(fname):
                            yield {
                                "backup_date": backup.date.isoformat(),
                                "backup_label": backup.label,
                                "file": os.path.join(root, fname),
                                "basename": fname,
                            }
            except PermissionError:
                print(
                    f"[Permission denied] {backup.path}\n"
                    "  → Grant Full Disk Access to your terminal in:\n"
                    "     System Settings → Privacy & Security → Full Disk Access",
                    file=sys.stderr,
                )
            except Exception as e:
                print(f"[Error scanning {backup.path}] {e}", file=sys.stderr)

    def search_path(
        self,
        substring: str,
        max_backups: Optional[int] = None,
        case_sensitive: bool = False,
    ) -> Iterator[dict]:
        """Yield every file whose full path contains `substring`."""
        if not self._discovered:
            self.discover()

        flags = 0 if case_sensitive else re.IGNORECASE
        substring_lc = substring if case_sensitive else substring.lower()

        backups = self.backups[:max_backups] if max_backups else self.backups
        for backup in backups:
            try:
                for root, _dirs, files in os.walk(backup.path):
                    for fname in files:
                        full = os.path.join(root, fname)
                        check = full if case_sensitive else full.lower()
                        if substring_lc in check:
                            yield {
                                "backup_date": backup.date.isoformat(),
                                "backup_label": backup.label,
                                "file": full,
                                "basename": fname,
                            }
            except PermissionError:
                print(
                    f"[Permission denied] {backup.path}\n"
                    "  → Grant Full Disk Access to your terminal in:\n"
                    "     System Settings → Privacy & Security → Full Disk Access",
                    file=sys.stderr,
                )
            except Exception as e:
                print(f"[Error scanning {backup.path}] {e}", file=sys.stderr)

    def list_backups(self) -> List[BackupRecord]:
        if not self._discovered:
            self.discover()
        return self.backups


def _cmd_search(args):
    tm = TimeMachineExplorer()
    tm.discover()

    if not tm.backups:
        print("No Time Machine backups discovered.")
        print("  - Is Time Machine enabled?")
        print("  - If backups exist but are inaccessible, grant Full Disk Access.")
        return 1

    print(f"Discovered {len(tm.backups)} backup(s):")
    for b in tm.backups[: args.recent]:
        print(f"  {b.date.strftime('%Y-%m-%d %H:%M')}  [{b.source}]  {b.label}")
    print()

    count = 0
    if args.name:
        print(f"Searching for files matching: {args.name}")
        for hit in tm.search_name(args.name, max_backups=args.recent):
            print(f"  [{hit['backup_date']}] {hit['file']}")
            count += 1
    elif args.path:
        print(f"Searching for paths containing: {args.path}")
        for hit in tm.search_path(args.path, max_backups=args.recent):
            print(f"  [{hit['backup_date']}] {hit['file']}")
            count += 1
    else:
        print("Use --name PATTERN or --path SUBSTRING to search.")
        return 1

    print(f"\nTotal matches: {count}")
    return 0


def _cmd_compare(args):
    tm = TimeMachineExplorer()
    tm.discover()

    pattern = os.path.basename(args.file)
    matches = list(tm.search_name(pattern, max_backups=args.recent))
    # filter to exact basename
    matches = [m for m in matches if os.path.basename(m["file"]) == pattern]

    if not matches:
        print(f"No versions of '{args.file}' found in backups.")
        return 1

    print(f"Found {len(matches)} version(s) of '{pattern}':")
    for m in matches:
        size = "?"
        try:
            size = os.path.getsize(m["file"])
            size = f"{size:,} bytes"
        except OSError:
            pass
        print(f"  {m['backup_date']}  {size:>18}  {m['file']}")
    return 0


def _cmd_restore(args):
    tm = TimeMachineExplorer()
    tm.discover()

    pattern = os.path.basename(args.file)
    matches = list(tm.search_name(pattern, max_backups=1))
    matches = [m for m in matches if os.path.basename(m["file"]) == pattern]

    if not matches:
        print(f"'{args.file}' not found in most recent backup.")
        return 1

    src = matches[0]["file"]
    dest = args.to or os.path.basename(src)
    if os.path.exists(dest) and not args.force:
        print(f"Destination exists: {dest}\nUse --force to overwrite.")
        return 1

    shutil.copy2(src, dest)
    print(f"Restored:\n  from: {src}\n  to:   {os.path.abspath(dest)}")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Search and recover files from Time Machine backups",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--recent", type=int, default=None,
        help="Only search the N most recent backups (default: all)"
    )

    sub = parser.add_subparsers(dest="command", required=True)

    p_search = sub.add_parser("search", help="Search backups by name or path")
    p_search.add_argument("--name", help="Filename pattern (shell glob)")
    p_search.add_argument("--path", help="Path substring")
    p_search.set_defaults(func=_cmd_search)

    p_cmp = sub.add_parser("compare", help="Show all versions of a file")
    p_cmp.add_argument("file", help="Filename to compare")
    p_cmp.set_defaults(func=_cmd_compare)

    p_rst = sub.add_parser("restore", help="Restore a file from latest backup")
    p_rst.add_argument("file", help="Filename to restore")
    p_rst.add_argument("--to", help="Destination path (default: current dir)")
    p_rst.add_argument("--force", action="store_true", help="Overwrite existing")
    p_rst.set_defaults(func=_cmd_restore)

    args = parser.parse_args()
    return args.func(args)


# Make fnmatch.translate available for Python <3.13 compatibility
import fnmatch

if __name__ == "__main__":
    sys.exit(main())
