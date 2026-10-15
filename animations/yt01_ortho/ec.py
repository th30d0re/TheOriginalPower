#!/usr/bin/env python3
"""Send one EffectCraft control request and print its complete response."""

import argparse
import json
import socket
import sys


def call(method, params=None, *, port=47821, timeout=30.0, request_id=1):
    request = {"id": request_id, "method": method,
               "params": {} if params is None else params}
    wire = (json.dumps(request, ensure_ascii=False, allow_nan=False) + "\n").encode("utf-8")
    with socket.create_connection(("127.0.0.1", port), timeout) as connection:
        connection.settimeout(timeout)
        connection.sendall(wire)
        with connection.makefile("rb") as reader:
            line = reader.readline()
    if not line:
        raise RuntimeError("EffectCraft closed the connection before replying")
    response = json.loads(line)
    if not isinstance(response, dict) or response.get("id") != request_id:
        raise RuntimeError("Unexpected response envelope or request ID")
    return response


def execute(command, params=None, **options):
    return call("engine.execute", {"command": command,
                                  "params": {} if params is None else params}, **options)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("method", nargs="?", default="ui.inspect")
    parser.add_argument("params", nargs="?", default="{}", help="JSON object")
    parser.add_argument("--port", type=int, default=47821)
    parser.add_argument("--timeout", type=float, default=30.0)
    args = parser.parse_args()
    try:
        params = json.loads(args.params)
        if not isinstance(params, dict):
            parser.error("params must be a JSON object")
        if args.timeout <= 0:
            parser.error("timeout must be positive")
        response = call(args.method, params, port=args.port, timeout=args.timeout)
        print(json.dumps(response, indent=2, ensure_ascii=False))
        result = response.get("result")
        failed = response.get("ok") is not True
        failed |= isinstance(result, dict) and result.get("ok") is False
        return 1 if failed else 0
    except (OSError, ValueError, RuntimeError) as error:
        print(f"ec: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
