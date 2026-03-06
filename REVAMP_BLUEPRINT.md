# Face Needling Revamp Blueprint

## Objective
Revamp the current Face Needling website using:
- Existing Face Needling business content as source-of-truth.
- Layout/organization inspiration from `skinspirit.com` and `evolvemedspa.com`.
- Existing project color palette from `assets/css/style.css`.

This document defines structure and execution before visual/code overhaul.

## Current Content Inventory (Source)
Primary content already present and reusable:
- Brand: Face Needling (clinic) + That Serum (products).
- Core services: Precision Microneedling, Acne Scar Revision, Hyperpigmentation, Anti-Ageing, Stretch Marks, Tattoo Removal, Piercings, Consultations.
- Trust signals: 2,600+ clients, established 2016, certified practitioners.
- Conversion paths: Call, WhatsApp, contact form, product links.
- Social channels for image sourcing:
  - Instagram: `https://www.instagram.com/faceneedling`
  - TikTok: `https://www.tiktok.com/@faceneedling`
  - YouTube: `https://www.youtube.com/@faceneedling`

## New Homepage Information Architecture
Adapted from reference site flow (premium medspa structure, not copied design):

1. Utility Bar
- Keep: hours, location, quick social links, primary phone.
- Improve: cleaner spacing and less visual noise on mobile.

2. Header / Navigation
- Keep: Treatments, About, Results, Shop, Contact.
- Add: Sticky CTA pair (`Book Consultation`, `Shop`).
- Mobile: simplify to one primary CTA + hamburger.

3. Hero (Single Focused Hero, not slider)
- Replace rotating slider with a static hero and one strong promise.
- Left: headline, credibility line, 2 CTAs.
- Right: primary clinic image.
- Reason: mirrors high-converting medspa patterns from references.

4. Trust Bar
- Keep concise proof chips: `2,600+ Clients`, `Since 2016`, `Certified Team`, `M-Pesa`.

5. Featured Treatments
- Split from long grid into:
  - 3 featured treatments (high-demand).
  - `View all treatments` CTA to full treatment section/page.
- Keeps homepage scannable while preserving depth.

6. Results Preview (Before/After)
- Show 3 high-quality transformations.
- Add micro-copy on number of sessions and concern type.
- CTA: `See More Results`.

7. How It Works (4 Steps)
- Retain current 4-step journey.
- Redesign into horizontal cards (desktop) and stacked cards (mobile).

8. Product Spotlight (That Serum)
- Show 4 top products only.
- Keep category chips and `View all products` CTA.

9. Testimonials
- Keep 3 testimonials.
- Add optional source labels (Google/Instagram/WhatsApp) where available.

10. About Snapshot
- Short founder/clinic story + `Since 2016` badge.
- CTA: `Read Our Story`.

11. Primary Conversion Band
- Strong consultation CTA + WhatsApp fallback.

12. Contact + Footer
- Keep current contact details, form, hours, legal links.
- Improve footer hierarchy and reduce duplicate links.

## Current-to-New Section Mapping
- `hero-slider` -> `hero-single` (simplify and improve conversion clarity).
- `micro-section` + part of `services-section` -> `featured-treatments`.
- full `services-section` -> `all-treatments` (homepage short + optional dedicated page).
- `ba-section` -> `results-preview`.
- `shop-section` -> `product-spotlight`.
- `about-section` -> `about-snapshot`.
- `t-section` -> `testimonials`.
- `cta-band` -> `conversion-band` (content retained, layout tightened).
- `contact-section` + `footer` -> retained with structural cleanup.

## Image Sourcing Plan (From Brand Socials)
Use only Face Needling brand channels above.

Asset buckets:
- `hero/`: 3-5 clinic action shots.
- `treatments/`: close-up procedure images by concern.
- `results/`: before-after pairs (with permission and safe cropping).
- `products/`: clean product imagery.
- `team/clinic/`: environment and practitioner credibility shots.

Processing standards:
- Export webp where possible.
- Standardized ratios:
  - Hero: 16:10
  - Cards: 4:5
  - Results: 1:1 or 4:5
- Target size: `< 250 KB` per image for homepage.
- Add descriptive alt text for accessibility/SEO.

## Execution Phases
1. Blueprint sign-off (this doc).
2. Phase 1 build: Header + Hero + Trust + Featured Treatments + CTA.
3. Phase 2 build: Results + How It Works + Product Spotlight.
4. Phase 3 build: Testimonials + About + Contact + Footer cleanup.
5. QA: mobile responsiveness, accessibility, performance, final polish.

## Guardrails
- Keep existing color variables in `:root`.
- Preserve brand positioning: Nairobi microneedling specialist.
- Do not clone reference visuals 1:1; adapt structure and UX patterns only.
- Prioritize conversion clarity over decorative complexity.
