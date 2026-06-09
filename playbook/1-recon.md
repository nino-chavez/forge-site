# Playbook Step 1: Recon

## Purpose

Understand the client's business, current state, and actual needs before prescribing anything. This is the Gordon Ramsay step — observe before you judge.

## Universal Questions (Ask Every Client)

### Business Basics
1. What does your business do? (one sentence)
2. Who is your customer? (age, location, tech comfort)
3. How do customers currently find you? (referrals, search, social, ads)
4. What's your revenue model? (services, subscriptions, one-time sales, events)
5. What's your volume? (customers per month, events per year, content items)

### Current State
6. Do you have a website now? (URL if yes)
7. What's working about your current setup?
8. What's broken or frustrating?
9. Do you have existing content? (photos, videos, articles, copy)
10. Do you have existing accounts? (domain registrar, email, social media, payment processor)

### Goals
11. What should someone do after visiting your site? (book, buy, call, subscribe)
12. What's the one thing this site must get right?
13. What's your timeline? (launching, seasonal pressure, event deadline)
14. Who will maintain the site after launch? (you, your team, a developer)

## Archetype-Specific Questions

### If Service Business signals emerge:
- How many locations do you have?
- Do you take appointments or are you walk-in/project-based?
- **How do clients currently book appointments?** (existing system like ZocDoc, SimplePractice, Calendly, or none?)
- Do customers need to see your team members before choosing?
- What's your service area? (local, regional, national)
- Do you have testimonials or reviews? Where? (Google, Yelp, internal)
- What do customers ask most before hiring you?
- **Do you accept insurance? Which providers?** (critical for medical/legal/professional services)
- **What professional credentials or certifications does your team hold?** (licenses, degrees, certifications)
- **Do you have before/after photos of your work?** (critical for visual services — flooring, remodeling, painting, landscaping)
- **How many projects have you completed? Can you break that down by area?** (project counts per service area are a powerful local SEO signal)
- **Do you have a showroom or physical space customers visit?** (drives a dedicated showroom/about page)
- **Any interactive tools you wish you had?** (visualizer, calculator, quiz — defer to v2 unless high priority)

### If Event Organizer signals emerge:
- How many events per year?
- Is it a series (ongoing) or individual events?
- How do people register? (online form, email, external platform)
- Do you need live results, brackets, or scoring?
- Do you have event photos/media to showcase?
- What event management tools do you currently use?

### If Digital Content signals emerge:
- What type of content? (video, articles, courses, downloads)
- How much content at launch?
- Pricing model? (monthly subscription, one-time, tiered, free tier?)
- How is content delivered now? (YouTube, email, platform like Teachable)
- Do you need a free preview / free tier?
- Who creates the content? (you, team, contributors)

### If Portfolio/Brand signals emerge:
- How many portfolio items / media pieces?
- Does the portfolio need to be searchable or filterable?
- Do you take bookings or inquiries through the site?
- Is this a personal brand or a business brand?
- Do you need a blog or writing section?
- How important is visual design quality? (is the site itself a demonstration of your work?)

## Existing Site Audit (If They Have One)

If the client has a current website, audit it before the conversation:

### Technical Check
- [ ] Run Lighthouse (performance, accessibility, SEO, best practices)
- [ ] Check mobile responsiveness
- [ ] Check page load time (target: <3s)
- [ ] Check for HTTPS
- [ ] Check Google Search Console data (if accessible)

### Content Check
- [ ] Is the value proposition clear within 5 seconds?
- [ ] Can you find the primary CTA? (book, buy, contact)
- [ ] Are services/products clearly described?
- [ ] Is there social proof? (testimonials, reviews, logos)
- [ ] Is the content up to date?

### Conversion Check
- [ ] Is there a contact form? Does it work?
- [ ] Is the phone number clickable on mobile?
- [ ] Are CTAs visible without scrolling?
- [ ] Is there a clear next step on every page?

### Evidence Discipline (non-negotiable for audit findings)

Audit output feeds the remediation prompt (`templates/site-remediation-prompt.md`) — a finding that violates these rules either compiles into a phantom fix or gets cut at compilation. Record each finding as `id · evidence · impact · recommendation`, where:

- **Findings are unresolved problems only.** Things the site does well go in a separate `passed_checks` list, never in findings. A positive observation recorded as a finding inflates the problem count and pollutes the remediation prompt.
- **The evidence field contains only what you observed** — values, quoted text, URLs, screenshot names, Lighthouse numbers. Recommendations live exclusively in the recommendation field. "Hero takes 4.2s LCP on mobile (Lighthouse, 2026-06-09)" is evidence; "hero should be optimized" is not.
- **Gaps are recorded, never extrapolated.** Anything you could not actually check (page behind auth, tool unavailable, page didn't load) goes in a `not_assessed` list with the reason. Never write a finding about a page you didn't see render — a 404 you screenshotted is evidence of a 404, not of the page behind it.
- **Attribute measurements to the page measured.** Homepage Lighthouse numbers describe the homepage; never present them as "the site's" or another page's performance.

## Output

After recon, you should have:
1. A clear understanding of the business and its customers
2. A preliminary archetype match (to be confirmed in Diagnose)
3. Audit findings + passed checks + not-assessed gaps, per the evidence discipline above
4. An inventory of existing assets (content, accounts, domain)
5. The client's definition of success

Document everything in `planning/requirements.md` in the spec folder.
