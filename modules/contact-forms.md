# Module: contact-forms

## Purpose

Form submission → email notification pattern for contact, estimate, and inquiry forms.

## Used By

- Service Business (required)
- Event Organizer (recommended)
- Portfolio/Brand (recommended)

## Dependencies

- **npm:** `zod` (validation), `react-hook-form` + `@hookform/resolvers` (Next.js), or native form handling (SvelteKit)
- **Requires:** `email-resend` module

## Produces

- **Routes:** `/api/contact` (POST), optionally `/api/estimate` (POST)
- **Components:** ContactForm, EstimateForm (if needed)
- **Schemas:** Zod validation schemas per form

## Reference Implementation

- **Projects:** Allen Wellness Center (contact only), Creative Floors (contact + estimate)
- **Key files:**
  - Allen Wellness: `~/Workspace/dev/client/allen-wellness-center/src/app/api/contact/route.ts`
  - Creative Floors: `~/Workspace/dev/client/creative-floors/src/app/api/contact/route.ts`, `src/app/api/estimate/route.ts`

## Integration Pattern

### Contact Form API (Next.js)

```typescript
import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
})

export async function POST(request: Request) {
  const body = await request.json()
  const result = contactSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error }, { status: 400 })

  // Send via Resend (see email-resend module)
  await sendContactEmail(result.data)
  return Response.json({ success: true })
}
```

### Estimate Form (additional fields)

```typescript
const estimateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  serviceType: z.string().min(1),
  description: z.string().min(1),
  squareFootage: z.string().optional(),
  timeline: z.string().optional(),
  address: z.string().optional(),
})
```

### Email Subject Differentiation

```
Contact: "New Contact: {firstName} {lastName}"
Estimate: "New Estimate Request: {firstName} {lastName} — {serviceType}"
```

Different subjects enable email filtering for the business owner.

## Gotchas

1. **Use `.safeParse()` not `.parse()`** — `.parse()` throws exceptions, `.safeParse()` returns a result object. For API routes, `.safeParse()` gives you clean error responses without try/catch.

2. **Estimate forms convert better than generic contact forms** — If the business can scope work from form data (service type, square footage, timeline), add a dedicated estimate form. Creative Floors gets more actionable leads from estimate forms than contact forms.

3. **Set reply-to to sender email** — The business owner should be able to hit "reply" in their email client to respond directly to the inquiry.

4. **Add honeypot field for spam** — A hidden field that bots fill out but humans don't. Check for it server-side and reject if filled.

5. **Rate limit form endpoints** — Even basic rate limiting prevents abuse. Check IP-based submission count before processing.
