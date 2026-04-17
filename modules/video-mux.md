# Module: video-mux

## Purpose

Video hosting, encoding, and playback via Mux for gated video content delivery.

## Used By

- Digital Content (recommended — when selling video content)

## Dependencies

- **npm:** `@mux/mux-node` (server), `@mux/mux-player-react` (Next.js) or `@mux/mux-player` (vanilla/SvelteKit)
- **Environment variables:** `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_KEY_PRIVATE` (for signed URLs)
- **External accounts:** Mux account

## Produces

- **Components:** Video player component (wraps Mux Player)
- **Routes:** `/api/mux/webhook` (asset ready notifications), `/api/video/[id]` (signed playback URL generation)
- **Utilities:** `mux.ts` (client, signed URL generation)
- **Database:** `videos` table (mux_asset_id, mux_playback_id, status, duration, title)

## Reference Implementation

- **No direct reference** — Rally HQ and Urvil Performance don't use Mux. This module is new for the Digital Content archetype.
- **Pattern based on:** Mux documentation + Vercel integration patterns

## Integration Pattern

### 1. Upload + Encoding

```typescript
import Mux from '@mux/mux-node'
const mux = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET })

// Create asset from URL
const asset = await mux.video.assets.create({
  input: [{ url: videoSourceUrl }],
  playback_policy: ['signed'], // Require signed URLs for gated content
  encoding_tier: 'baseline',
})
```

### 2. Signed Playback URLs (for gated content)

```typescript
import jwt from 'jsonwebtoken'

function createSignedPlaybackUrl(playbackId: string): string {
  const token = jwt.sign(
    { sub: playbackId, aud: 'v', exp: Math.floor(Date.now() / 1000) + 3600 },
    Buffer.from(MUX_SIGNING_KEY_PRIVATE, 'base64'),
    { algorithm: 'RS256', keyid: MUX_SIGNING_KEY_ID }
  )
  return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`
}
```

### 3. Player Component

```tsx
// Next.js
import MuxPlayer from '@mux/mux-player-react'

<MuxPlayer
  playbackId={video.mux_playback_id}
  tokens={{ playback: signedToken }}
  metadata={{ video_title: video.title }}
  accentColor="#your-brand-color"
/>
```

### 4. Webhook (asset ready)

```typescript
// /api/mux/webhook
// Mux sends webhook when encoding completes
// Update video record with status: 'ready', duration, thumbnail
```

## Gotchas

1. **Use signed playback policies for gated content** — Public playback IDs can be shared. Signed URLs expire and are tied to your account.

2. **Encoding takes time** — After upload, the asset isn't immediately playable. Use Mux webhooks to know when encoding completes. Show a "processing" state in the UI.

3. **Consider external delivery as v1 alternative** — Urvil Performance delivers content via TrainHeroic, not self-hosted video. For v1, evaluate whether Mux is needed or if an existing platform (Vimeo, YouTube unlisted, TrainHeroic) handles delivery.

4. **Mux billing is per-minute-viewed** — Encoding is free, but delivery is metered. For low-volume content sites, this is cheap. For high-traffic video, monitor costs.

5. **Thumbnails come from the asset** — Mux auto-generates thumbnails. Access via `https://image.mux.com/{playbackId}/thumbnail.webp`. No need to upload separate thumbnails.
