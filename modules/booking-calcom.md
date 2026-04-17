# Module: booking-calcom

## Purpose

Appointment scheduling integration with Cal.com — availability display, booking links, and webhook notifications.

## Used By

- Service Business (recommended — if business takes appointments)
- Portfolio/Brand (recommended — for consulting bookings)

## Dependencies

- **npm:** None (Cal.com is accessed via REST API or embed)
- **Environment variables:** `CAL_API_KEY`, `CAL_EVENT_TYPE_ID`
- **External accounts:** Cal.com account with event types configured

## Produces

- **Routes:** `/api/cal/availability` (GET — cached availability status)
- **Components:** Booking CTA button, availability indicator
- **Utilities:** `cal.ts` (API client, availability calculation)

## Reference Implementation

- **Project:** Website-NC
- **Path:** `~/Workspace/dev/apps/website-nc/src/routes/api/cal/`
- **Key files:**
  - `availability/+server.ts` — Fetches schedules, calculates slots for next 7 days
  - `event-types/+server.ts` — Lists available event types
  - `webhooks/+server.ts` — Handles Cal.com webhook events

## Integration Pattern

### Availability Endpoint

```typescript
// GET /api/cal/availability
// Returns: { status, nextSlot, slotsThisWeek, message }

export const GET: RequestHandler = async () => {
  const schedules = await fetchCalSchedules()
  const eventTypes = await fetchCalEventTypes()

  if (!eventTypes.length) {
    return json({ status: 'unavailable', nextSlot: null, slotsThisWeek: 0 })
  }

  const slots = calculateAvailableSlots(schedules, 7) // next 7 days
  return json({
    status: slots > 5 ? 'available' : slots > 0 ? 'limited' : 'unavailable',
    nextSlot: getNextAvailableSlot(schedules),
    slotsThisWeek: slots,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=900', // 15 min CDN cache
      'CDN-Cache-Control': 'public, s-maxage=900',
    }
  })
}
```

### Client Usage

```svelte
<!-- Ambient availability indicator -->
{#if availability.status === 'available'}
  <span class="status-dot bg-green-500"></span> Now Booking
{/if}
```

## Gotchas

1. **Cache availability aggressively** — 15 minute CDN cache is fine. Real-time availability isn't needed for a "Now Booking" indicator.

2. **Graceful degradation** — If Cal.com API is down, return `{ status: 'unavailable' }` instead of an error. The booking indicator should never break the page.

3. **Use Cal.com embed or redirect, not a custom booking form** — Cal.com handles timezone conversion, calendar conflicts, and confirmation emails. Don't rebuild this.
