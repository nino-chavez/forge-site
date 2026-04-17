# Module: email-resend

## Purpose

Transactional email delivery with Resend — form submissions, payment receipts, dunning notifications, welcome emails.

## Used By

- Service Business (required — form submission notifications)
- Digital Content (required — payment receipts, dunning)
- Event Organizer (recommended — registration confirmations)
- Portfolio/Brand (optional — contact form)

## Dependencies

- **npm:** `resend`
- **Environment variables:** `RESEND_API_KEY`, `CONTACT_EMAIL` (recipient for form submissions)
- **External accounts:** Resend account with verified domain

## Produces

- **Utilities:** `email.ts` (Resend client, send helpers), `email-templates.ts` (template definitions)
- **Used by:** Form API routes, Stripe webhook handlers

## Reference Implementation

- **Projects:** Rally HQ (payment emails), Allen Wellness Center (form emails), Creative Floors (form emails)
- **Key files:**
  - Rally HQ: `~/Workspace/dev/apps/rally-hq/src/lib/email.ts`, `src/lib/email-templates.ts`
  - Allen Wellness: `~/Workspace/dev/client/allen-wellness-center/src/app/api/contact/route.ts`
  - Creative Floors: `~/Workspace/dev/client/creative-floors/src/app/api/contact/route.ts`, `src/app/api/estimate/route.ts`

## Integration Pattern

### Form Submission Email

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Graceful degradation for dev
if (!process.env.RESEND_API_KEY) {
  console.log('Dev mode: would send email to', CONTACT_EMAIL)
  return json({ success: true })
}

await resend.emails.send({
  from: 'Site Name <noreply@domain.com>',
  to: CONTACT_EMAIL,
  replyTo: formData.email,
  subject: `New Contact: ${formData.firstName} ${formData.lastName}`,
  html: formatEmailHtml(formData),
})
```

### Payment Receipt (from Stripe webhook)

```typescript
await resend.emails.send({
  from: 'App Name <billing@domain.com>',
  to: userEmail,
  subject: `Payment Receipt — $${(amountCents / 100).toFixed(2)}`,
  html: receiptTemplate({ amount, description, invoiceUrl }),
})
```

### Dunning Email (payment failed)

```typescript
await resend.emails.send({
  from: 'App Name <billing@domain.com>',
  to: userEmail,
  subject: 'Payment Failed — Action Required',
  html: dunningTemplate({ billingPortalUrl }),
})
```

## Email Types by Archetype

| Email | Trigger | Archetype |
|-------|---------|-----------|
| Contact form notification | Form submission | Service Business, Portfolio |
| Estimate request notification | Form submission | Service Business |
| Welcome email | User signup | Digital Content |
| Payment receipt | `invoice.paid` webhook | Digital Content |
| Payment failed / dunning | `invoice.payment_failed` webhook | Digital Content |
| 3D Secure auth required | `invoice.payment_action_required` webhook | Digital Content |
| Upcoming renewal | `invoice.upcoming` webhook | Digital Content |
| Registration confirmation | Event registration | Event Organizer |

## Gotchas

1. **Graceful degradation is essential** — Always check for `RESEND_API_KEY` before sending. Log to console in dev mode. Without this, local development breaks on every form submission.

2. **Set reply-to to the sender's email** — For contact forms, set `replyTo: formData.email` so the business owner can reply directly from their email client.

3. **Dunning emails MUST include billing portal link** — A "your payment failed" email without an action link is useless. Always include the Stripe billing portal URL.

4. **Verify your domain in Resend** — Sending from an unverified domain lands in spam. Set up DNS records (SPF, DKIM) before launch.

5. **Rate limiting on form endpoints** — Add basic rate limiting to contact/estimate form API routes to prevent abuse. Even a simple in-memory counter helps.
