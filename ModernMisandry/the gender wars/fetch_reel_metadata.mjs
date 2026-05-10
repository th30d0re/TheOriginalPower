import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';

const requireFromInstagramCli = createRequire(
	'/Users/emmanuel/Dev/Tools/instagram-cli/package.json',
);
const {IgApiClient} = requireFromInstagramCli('instagram-private-api');
const yaml = requireFromInstagramCli('js-yaml');

const ROOT = '/Users/emmanuel/Documents/Theory/Redefining_racism';
const RESEARCH_DIR = path.join(
	ROOT,
	'ModernMisandry',
	'the gender wars',
	'social media research',
);
const SNAPSHOT_PATH = path.join(RESEARCH_DIR, 'instagram_metadata_snapshot.json');
const INSTAGRAM_CLI_CONFIG = path.join(
	process.env.HOME,
	'.instagram-cli',
	'config.ts.yaml',
);
const SHORTCODE_ALPHABET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function shortcodeToMediaPk(shortcode) {
	let id = 0n;
	for (const char of shortcode) {
		const index = SHORTCODE_ALPHABET.indexOf(char);
		if (index === -1) {
			throw new Error(`Invalid Instagram shortcode character: ${char}`);
		}

		id = id * 64n + BigInt(index);
	}

	return String(id);
}

function extractShortcode(markdown, filename) {
	const urlMatch = markdown.match(/instagram\.com\/reel\/([^/?#\s]+)/);
	if (urlMatch?.[1]) {
		return urlMatch[1];
	}

	const nameMatch = filename.match(/^reel_(.+)\.md$/);
	if (nameMatch?.[1]) {
		return nameMatch[1];
	}

	throw new Error('Could not find reel shortcode');
}

function formatNumber(value) {
	if (typeof value !== 'number') {
		return 'Unavailable';
	}

	return new Intl.NumberFormat('en-US').format(value);
}

function formatTimestamp(seconds) {
	if (typeof seconds !== 'number') {
		return 'Unavailable';
	}

	return new Date(seconds * 1000).toISOString();
}

function singleLine(value, maxLength = 900) {
	if (!value) {
		return 'Unavailable';
	}

	const text = String(value).replaceAll(/\s+/g, ' ').trim();
	return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function buildMetadataBlock({username, fetchedAt, status, shortcode, mediaPk, item, error}) {
	const header = '## Instagram Metadata';
	if (status !== 'ok') {
		return `${header}

- Fetched at: ${fetchedAt}
- Source: Instagram CLI authenticated session (@${username})
- Status: unavailable
- Shortcode: ${shortcode}
- Derived media PK: ${mediaPk ?? 'Unavailable'}
- Error: ${singleLine(error?.message ?? error)}
- Note: Instagram reach is an owner-only insights metric. Public reel play count could not be fetched for this item.
`;
	}

	const playCount = item.play_count ?? item.ig_play_count ?? item.view_count;
	const reachNote =
		'Instagram reach is not exposed for third-party reels; public play count is the closest available proxy.';

	return `${header}

- Fetched at: ${fetchedAt}
- Source: Instagram CLI authenticated session (@${username})
- Shortcode: ${shortcode}
- Instagram media ID: ${item.id ?? 'Unavailable'}
- Instagram media PK: ${item.pk ?? mediaPk}
- Uploader username: ${item.user?.username ? `@${item.user.username}` : 'Unavailable'}
- Uploader display name: ${item.user?.full_name || 'Unavailable'}
- Posted at: ${formatTimestamp(item.taken_at)}
- Product type: ${item.product_type ?? 'Unavailable'}
- Media type: ${item.media_type ?? 'Unavailable'}
- Public play count / views proxy: ${formatNumber(playCount)}
- Likes: ${formatNumber(item.like_count)}
- Comments: ${formatNumber(item.comment_count)}
- Caption: ${singleLine(item.caption?.text)}
- Reach note: ${reachNote}
`;
}

function upsertMetadataBlock(markdown, block) {
	const sectionPattern =
		/\n## Instagram Metadata\n[\s\S]*?(?=\n## Transcript|\n## Research Evaluation|\n## |$)/;
	if (sectionPattern.test(markdown)) {
		return markdown.replace(sectionPattern, `\n${block}`);
	}

	const transcriptIndex = markdown.indexOf('\n## Transcript');
	if (transcriptIndex !== -1) {
		return `${markdown.slice(0, transcriptIndex)}\n${block}${markdown.slice(
			transcriptIndex,
		)}`;
	}

	return `${markdown.trimEnd()}\n\n${block}\n`;
}

async function delay(ms) {
	await new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

async function main() {
	const config = yaml.load(await fs.readFile(INSTAGRAM_CLI_CONFIG, 'utf8'));
	const username = config.login.currentUsername ?? config.login.defaultUsername;
	if (!username) {
		throw new Error('No active instagram-cli username found');
	}

	const sessionPath = path.join(
		config.advanced.usersDir,
		username,
		'session.ts.json',
	);
	const session = JSON.parse(await fs.readFile(sessionPath, 'utf8'));
	const ig = new IgApiClient();
	ig.state.generateDevice(username);
	await ig.state.deserialize(session);

	const files = (await fs.readdir(RESEARCH_DIR))
		.filter(file => /^reel_.+\.md$/.test(file))
		.sort();

	const fetchedAt = new Date().toISOString();
	const snapshot = {
		fetchedAt,
		source: `Instagram CLI authenticated session (@${username})`,
		reachCaveat:
			'Instagram reach is available only through owner insights. This snapshot records public play_count/ig_play_count/view_count when exposed by the media info endpoint.',
		items: [],
	};

	for (const [index, file] of files.entries()) {
		const filePath = path.join(RESEARCH_DIR, file);
		const markdown = await fs.readFile(filePath, 'utf8');
		const shortcode = extractShortcode(markdown, file);
		const mediaPk = shortcodeToMediaPk(shortcode);
		let block;
		let record;

		try {
			const info = await ig.media.info(mediaPk);
			const item = info.items?.[0];
			if (!item) {
				throw new Error('Instagram returned no media item');
			}

			block = buildMetadataBlock({
				username,
				fetchedAt,
				status: 'ok',
				shortcode,
				mediaPk,
				item,
			});
			record = {
				file,
				status: 'ok',
				shortcode,
				mediaPk,
				mediaId: item.id,
				uploaderUsername: item.user?.username,
				uploaderDisplayName: item.user?.full_name,
				takenAt: item.taken_at,
				takenAtIso: formatTimestamp(item.taken_at),
				productType: item.product_type,
				mediaType: item.media_type,
				playCount: item.play_count ?? null,
				igPlayCount: item.ig_play_count ?? null,
				viewCount: item.view_count ?? null,
				likeCount: item.like_count ?? null,
				commentCount: item.comment_count ?? null,
				caption: item.caption?.text ?? null,
			};
		} catch (error) {
			block = buildMetadataBlock({
				username,
				fetchedAt,
				status: 'error',
				shortcode,
				mediaPk,
				error,
			});
			record = {
				file,
				status: 'error',
				shortcode,
				mediaPk,
				error: error instanceof Error ? error.message : String(error),
			};
		}

		await fs.writeFile(filePath, upsertMetadataBlock(markdown, block));
		snapshot.items.push(record);
		console.log(
			`[${index + 1}/${files.length}] ${file}: ${record.status}${
				record.playCount ? ` (${formatNumber(record.playCount)} plays)` : ''
			}`,
		);

		await delay(750);
	}

	await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

	const ok = snapshot.items.filter(item => item.status === 'ok').length;
	const failed = snapshot.items.length - ok;
	console.log(`Done. ${ok} ok, ${failed} unavailable.`);
	console.log(`Snapshot: ${SNAPSHOT_PATH}`);
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
