# V13 Findings — Saved-reel ingest

Model: GPT-5 Codex

Date: 2026-08-02

## Conclusion

The installed Instagram client has a reliable route to the authenticated account's aggregate saved feed. It does not provide a reliable complete route for the requested `videolab saved` command. Its saved-feed contract cannot distinguish reels from other video posts, and its public feed factory cannot list or address named saved collections. Videolab also has no supported command-line interface through which it can ask `instagram-cli` for saved media.

Implementing this feature inside videolab would require one of two unsupported credential integrations: importing `instagram-cli`'s development-tree dependency and deserializing its private session file, or recreating private-API requests from that session. Both approaches couple videolab to unpublished storage details and create a second session-consumption path. A maintained `instagram-cli` command or upstream client support is required before the ingest command can be reliable. Per the task instruction, implementation stops at this finding.

No network calls were made during this investigation.

## 1. Authentication, client, headers, and session handling

`instagram-cli` uses `IgApiClientExt`, an extension of `instagram-private-api`'s `IgApiClient`. The client is constructed once as a private member of `InstagramClient` (`source/client.ts:156-160`, `source/client.ts:188-196`). The installed package version is `instagram-private-api` `^1.46.1` (`package.json`, `dependencies`).

Credential login seeds a deterministic Android device identity from the username, subscribes to completed requests so refreshed state is saved, performs the login flows, and calls `ig.account.login` (`source/client.ts:217-244`). Session login follows the same device seeding, restores the serialized state with `ig.state.deserialize`, and then performs post-login setup (`source/client.ts:335-367`). The underlying API client is exposed to code inside the CLI through `getInstagramClient()` (`source/client.ts:433-435`).

The session manager stores JSON at `<advanced.usersDir>/<username>/session.ts.json` (`source/session.ts:114-121`). Files are created with mode `0600` (`source/session.ts:35-45`). A saved state includes the cookie jar and the rest of the API state (`instagram-private-api/dist/core/state.js:174-202`); `instagram-cli` deliberately removes dependency constants before writing so the installed library supplies its current constants (`source/session.ts:35-45`). API state is saved after requests (`source/client.ts:227-231`, `source/client.ts:356-362`) and during post-login setup (`source/client.ts:1323-1337`).

The private client sends an Android Instagram user agent, locale and connection metadata, `X-MID`, `X-IG-WWW-Claim`, `X-IG-App-ID`, device IDs, and `Authorization` to `i.instagram.com` (`instagram-private-api/dist/core/request.js:136-168`). `X-IG-App-ID` comes from `fbAnalyticsApplicationId` (`instagram-private-api/dist/core/request.js:159`), which resolves to the dependency's `FACEBOOK_ANALYTICS_APPLICATION_ID` constant (`instagram-private-api/dist/core/state.js:61-63`). Response headers can refresh the WWW claim and authorization state (`instagram-private-api/dist/core/request.js:58-71`), which explains why preserving and re-saving the complete state matters.

## 2. Aggregate saved-post endpoint and session sufficiency

The dependency implements `GET /api/v1/feed/saved/` with `max_id` pagination and returns each wrapper's `media` object (`instagram-private-api/dist/feeds/saved.feed.js:15-34`). `FeedFactory.saved()` constructs this authenticated feed (`instagram-private-api/dist/core/feed.factory.js:124-126`).

The existing live serialized session is sufficient when restored into the same client stack. `loginBySession()` generates the username-derived device, deserializes cookies and authorization/device state, and completes setup before ordinary private-API methods run (`source/client.ts:335-367`). The saved feed uses the same `client.request.send` transport as the CLI's other authenticated repositories (`instagram-private-api/dist/feeds/saved.feed.js:20-29`).

The sufficiency applies inside `instagram-cli`'s client boundary. Version 1.5.0 exposes no saved command, so videolab cannot reach this feed through the supported executable interface. Directly opening `session.ts.json` from Python or a new Node helper would depend on the CLI's private storage schema and installed development path.

## 3. Reel discrimination and shortcode availability

The saved response provides `media_type` and `code` for every media item (`instagram-private-api/dist/responses/saved.feed.response.d.ts:12-20`). `code` is the shortcode needed by `parse_source`. Video-only fields such as `video_versions`, `video_duration`, and `view_count` are also represented (`instagram-private-api/dist/responses/saved.feed.response.d.ts:49-56`).

The response contract does not expose `product_type`, a clips/reel marker, or a canonical permalink. `media_type` separates images from videos; it does not establish that a video item is a reel rather than another Instagram video product. Constructing `/reel/<code>/` for every `media_type == 2` item would therefore fail the requirement to keep only reels. The local source and installed dependency provide no evidence that this classification is reliable.

The shortcode route is available. Reliable reel filtering is unavailable.

## 4. Named saved collections

The saved media type includes `saved_collection_ids`, so the aggregate response can expose opaque membership identifiers (`instagram-private-api/dist/responses/saved.feed.response.d.ts:43-47`). It does not include collection names.

The installed feed factory exposes only the zero-argument aggregate `saved()` feed (`instagram-private-api/dist/core/feed.factory.d.ts:42`; `instagram-private-api/dist/core/feed.factory.js:124-126`). The installed package contains no collection-list feed and no collection-specific saved feed. The media repository can write saves with optional collection IDs, but that write capability does not resolve a user-supplied collection name (`instagram-private-api/dist/repositories/media.repository.d.ts:60`).

Consequently, `--collection NAME` cannot be implemented from the supported local client surface. Raw private endpoints inferred from other clients would lack source-backed compatibility guarantees and could not be validated in this sandbox.

## Required prerequisite

Add and maintain a machine-readable command in `instagram-cli`, backed by its authenticated `InstagramClient`, that returns paginated saved items with:

- shortcode;
- a definitive reel discriminator;
- collection ID and collection name mapping; and
- stable JSON error behavior.

Once that interface exists, videolab can call it without reading session files, filter and deduplicate results, and send each canonical reel URL through `parse_source` and `_run_post_fetch_pipeline`.
