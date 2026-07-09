# AppArchitect – Landing Page Builder Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Builds the actual waitlist landing page from the Waitlist & Landing Page Spec
**Precedence:** Agent PRDs never override Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
| --- | --- |
| **Agent Name** | Landing Page Builder Agent |
| **Role** | Implements the waitlist landing page end-to-end from the Waitlist & Landing Page Spec |
| **Type** | Code |
| **Operates On** | Codebase, API routes, frontend components, deployment |
| **Triggered By** | Orchestrator Agent after Backend Agent completes the `/api/waitlist` route |
| **Blocking?** | No — but blocks the Launch Marketing Agent from running paid promotion |

---

## 2. Mission Statement

The Landing Page Builder Agent takes the Waitlist & Landing Page Spec (one of AppArchitect's reference docs) and produces a live, deployed, signups-collecting landing page. It bridges the gap between "spec exists" and "waitlist actually works." The user can preview the page, capture email signups, and start the GTM engine — all before the full app is built.

---

## 3. Scope

### 3.1 In Scope

- Implement the landing page UI per the spec (hero, features, social proof, FAQ, CTA, footer)
- Wire the email capture form to the `/api/waitlist` endpoint
- Add analytics tracking per the Promotion Analytics Agent's spec
- Deploy to the user's hosting platform (Vercel/Netlify/etc.)
- Verify the page loads, the form posts, and signups are persisted
- Add SEO meta tags per the spec
- Generate a sitemap and robots.txt for the landing page
- Wire the "thank you" state to the email service (Resend) confirmation

### 3.2 Out of Scope

- Backend / API route implementation (Backend Agent's job — this agent consumes the route, doesn't build it)
- Email sequence design (Launch Marketing Agent's job)
- Social media content (Social Media Agent's job)
- Any feature beyond the waitlist landing page

---

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required |
| --- | --- | --- | --- |
| Waitlist Spec | Waitlist & Landing Page Spec doc (markdown) | Markdown | Yes |
| Brand assets | Brand & Logo Asset PRD (color tokens, SVGs) | JSON / SVG | Yes |
| API endpoint spec | Backend Agent's `/api/waitlist` route contract | TypeScript types | Yes |
| Analytics events | Promotion Analytics Agent's tracking plan | JSON | Yes |
| Environment variables | Environment & Secrets Reference | `.env.example` | Yes |

### 4.2 Input Schemas

**WaitlistSpec** (extracted from the Waitlist Spec doc)

```typescript
type WaitlistSpec = {
  productName: string;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  primaryCTA: string;
  featureBlocks: Array<{ title: string; body: string; icon?: string }>;
  socialProof: { testimonialCount: number; logos: string[]; metrics: Array<{ value: string; label: string }> };
  faq: Array<{ question: string; answer: string }>;
  emailCapture: { placeholder: string; submitButton: string; consentText: string };
  successState: { headline: string; body: string; cta?: { label: string; href: string } };
  seoMeta: { title: string; description: string; ogImage: string; keywords: string[] };
  socialHandles: { x?: string; linkedin?: string; youtube?: string; producthunt?: string };
}
```

### 4.3 Input Validation Rules

- All required fields must be present — if not, abort and request the missing fields
- Hero headline must be ≤ 80 characters
- FAQ must have ≥ 3 entries
- Color tokens must be valid hex
- SVG logo must be present and loadable

---

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced |
| --- | --- | --- | --- |
| Live landing page | Vercel/Netlify deployment | URL | Yes |
| Source code | `/landing-page/` in monorepo | React/Next.js | Yes |
| Deployment report | Orchestrator | JSON | Yes |
| SEO files | `/landing-page/public/` | sitemap.xml, robots.txt | Yes |
| Performance report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas

**DeploymentReport**

```typescript
type DeploymentReport = {
  url: string;                    // Deployed URL
  buildId: string;
  buildDuration: number;          // ms
  lighthouse: {
    performance: number;          // 0-100
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  formTestResult: 'PASS' | 'FAIL';
  analyticsTestResult: 'PASS' | 'FAIL';
  errors: AgentError[];
}
```

### 5.3 Output Quality Rules

- Lighthouse performance score must be ≥ 90
- Accessibility score must be ≥ 95
- Form must successfully post a test signup to the API
- Analytics events must fire on page load and form submit
- All CTA buttons must have working `href` or `onClick` handlers
- No 404s on any internal link

---

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Parse the Waitlist Spec**

- Read the Waitlist & Landing Page Spec doc
- Extract all fields per the WaitlistSpec schema
- Validate all required fields are present
- On failure: abort with `SPEC_INCOMPLETE` error

**Step 2: Scaffold the Landing Page**

- Create `/landing-page/` directory in the monorepo
- Initialize Next.js app (or framework per the Technical Architecture PRD)
- Install dependencies: React, Next.js, Tailwind, analytics SDK, Resend client
- On failure: abort with `SCAFFOLD_FAILED` error

**Step 3: Implement Sections in Order**

- Header (logo, optional nav)
- Hero (headline, subhead, email capture form, primary CTA)
- Social proof bar (logo wall, metric cards)
- Features (3-6 feature blocks, icon + title + body)
- "How it works" (3 steps)
- Testimonials (carousel or grid)
- FAQ (accordion)
- Final CTA (email capture again)
- Footer (copyright, social links, ToS / Privacy)
- On each section: verify it renders, no layout breaks, all copy is from the spec (no paraphrasing)

**Step 4: Wire the Form to the API**

- Use the `/api/waitlist` endpoint from Backend Agent
- POST { email, referrer, utm_source, utm_medium, utm_campaign } on submit
- On success: show the `successState`
- On error: show inline error from the Content & Copy PRD key for that error code
- Loading state: disable button, show spinner, preserve form width

**Step 5: Add Analytics Tracking**

- Per Promotion Analytics Agent's tracking plan
- Page view event with UTM params
- Form start (focus on email input)
- Form submit (success and failure)
- CTA click
- Scroll depth (25%, 50%, 75%, 100%)
- On failure: log warning, don't block deployment

**Step 6: Add SEO**

- Set `<title>`, `<meta name="description">`, OG tags per the spec
- Add JSON-LD structured data (Organization + WebSite)
- Generate sitemap.xml
- Generate robots.txt
- Add favicon (from brand assets)

**Step 7: Performance Optimization**

- Lazy load images below the fold
- Preload critical fonts
- Inline critical CSS
- Verify no render-blocking resources
- Lighthouse performance must be ≥ 90

**Step 8: Deploy**

- Push to deployment branch
- Trigger Vercel/Netlify build
- Wait for build to complete
- Verify deployment is live

**Step 9: Verify**

- Use a headless browser to load the deployed page
- Verify the page renders
- Submit a test email to the form
- Verify the success state shows
- Verify analytics events fired
- Check Lighthouse score on the deployed URL

**Step 10: Report**

- Send DeploymentReport to Orchestrator
- Include URL, build ID, Lighthouse scores, test results
- Note any issues that need follow-up

### 6.2 Decision Logic

**Decision: Framework Choice**

```markdown
IF Technical Architecture PRD specifies Next.js
  THEN use Next.js App Router
ELSE IF Technical Architecture PRD specifies Vite
  THEN use Vite + React
ELSE
  use Next.js (recommended default)
```

**Decision: Deployment Platform**

```markdown
IF project uses Vercel
  THEN deploy to Vercel
ELSE IF project uses Netlify
  THEN deploy to Netlify
ELSE IF project uses Cloudflare Pages
  THEN deploy to Cloudflare
ELSE
  deploy to Vercel (default)
```

### 6.3 Concurrency Rules

- Must run AFTER Backend Agent has completed the `/api/waitlist` route
- Must run BEFORE Launch Marketing Agent starts paid promotion
- May run in parallel with Social Media Agent and Promotion Analytics Agent

---

## 7. Edge Cases & Failure Modes

| Scenario | Expected Behavior |
| --- | --- |
| Waitlist Spec is missing required fields | Abort with `SPEC_INCOMPLETE`, request missing fields from Orchestrator |
| Backend Agent's API route doesn't exist | Abort with `API_NOT_READY`, wait for Backend Agent |
| Lighthouse performance &lt; 90 | Identify bottleneck, optimize, redeploy. If still fails, escalate |
| Form submission fails | Show inline error, do not navigate away |
| Analytics SDK fails to load | Log warning, continue without tracking |
| Deployment fails | Retry once. If still fails, abort with `DEPLOYMENT_FAILED` |
| Test signup email is invalid | Verify API returns 400, form shows validation error |
| Page loads but images are broken | Verify all image URLs are accessible, replace broken ones |
| User wants to edit copy post-deployment | Provide a clear edit-and-redeploy path; do not block this agent |

---

## 8. Dependencies

### 8.1 Base PRD Dependencies

| PRD | Relevant Sections |
| --- | --- |
| Safety, Privacy & Control PRD | All — must respect consent language, privacy, GDPR/CCPA |
| Core Systems PRD | Data contracts for waitlist signup object |
| Experience & Access PRD | Screen contracts for landing page UI |
| Technical Architecture PRD | Stack, framework, hosting platform |
| Brand & Logo Asset PRD | Color tokens, fonts, logo SVGs |
| Content & Copy PRD | All UI strings, error messages |
| Waitlist & Landing Page Spec | Full spec for the page |
| Monetization & Pricing PRD | Pricing tier mentions in the page copy |
| Environment & Secrets Reference | All env vars this agent uses |

### 8.2 Agent Dependencies

| Dependency Type | Agent | Nature |
| --- | --- | --- |
| Must run before this agent | Backend Agent | Produces `/api/waitlist` route this agent consumes |
| Must run before this agent | Documentation Agent | Produces Waitlist Spec this agent reads |
| Must run after this agent | Launch Marketing Agent | Cannot start paid promotion without a live landing page |
| May run concurrently | Social Media Agent | Can schedule posts in parallel with page build |
| May run concurrently | Promotion Analytics Agent | Can configure tracking in parallel |

### 8.3 External Service Dependencies

| Service | Used For | Failure Impact |
| --- | --- | --- |
| Vercel/Netlify | Hosting | Critical — page must be live |
| Resend | Transactional email | High — confirmation email may not send |
| Analytics provider | Page view + event tracking | Medium — degrades marketing visibility |
| DNS provider | Custom domain | High — page accessible but not on user's domain |

---

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery Action |
| --- | --- | --- | --- |
| `SPEC_INCOMPLETE` | Waitlist Spec missing required fields | Critical | Abort, request missing fields |
| `API_NOT_READY` | Backend Agent hasn't finished `/api/waitlist` | High | Wait for Backend Agent |
| `SCAFFOLD_FAILED` | Project initialization failed | High | Retry with corrected command |
| `DEPLOYMENT_FAILED` | Build or deploy failed | High | Retry once, then escalate |
| `PERFORMANCE_BELOW_THRESHOLD` | Lighthouse performance &lt; 90 | Medium | Identify bottleneck, optimize, redeploy |
| `FORM_TEST_FAILED` | Test signup did not succeed | High | Debug form, fix, redeploy |
| `ANALYTICS_LOAD_FAILED` | Analytics SDK did not load | Low | Log warning, continue |

---

## 10. Logging & Observability

### 10.1 What This Agent Must Log

| Event | Log Level | Data to Include |
| --- | --- | --- |
| Agent start | INFO | Spec fields count, framework chosen |
| Step completion | INFO | Step name, duration |
| Build complete | INFO | Build ID, duration, size |
| Deployment live | INFO | URL, build ID |
| Lighthouse score | INFO | All four categories |
| Form test result | INFO | Pass / fail + reason |
| Agent completion | INFO | Final report summary |

### 10.2 What This Agent Must Never Log

- Email addresses from test signups (use a masked version: `t***@example.com`)
- Full HTML / page content
- Resend API keys
- Any PII

---

## 11. Acceptance Criteria

- [ ]  Landing page deployed and accessible at the public URL

- [ ]  Lighthouse performance ≥ 90

- [ ]  Lighthouse accessibility ≥ 95

- [ ]  Form successfully posts a test signup to `/api/waitlist`

- [ ]  Success state displays after form submit

- [ ]  Error states display correctly for invalid email, network error, server error

- [ ]  Analytics events fire on page load, form start, form submit, CTA click

- [ ]  SEO meta tags match the Waitlist Spec

- [ ]  Sitemap and robots.txt generated

- [ ]  All copy comes from the Waitlist Spec (no paraphrasing)

- [ ]  All branding (colors, fonts, logos) comes from the Brand PRD

- [ ]  Page works on mobile, tablet, and desktop breakpoints

- [ ]  Page works in Chrome, Safari, Firefox, Edge

- [ ]  Custom domain (if specified) is connected

- [ ]  Handoff report sent to Orchestrator

---

## 12. Test Cases

### 12.1 Happy Path

| Test | Input | Expected Output |
| --- | --- | --- |
| Build from spec | Valid Waitlist Spec | Live page, all sections render |
| Form submit with valid email | `test@example.com` | Success state, signup persisted |
| Form submit with referral code | `/?ref=ABC123` | Referral captured in DB |
| Page load with UTM params | `/?utm_source=producthunt` | UTMs sent to analytics |

### 12.2 Error Cases

| Test | Input | Expected Error Code |
| --- | --- | --- |
| Missing spec field | Spec without heroHeadline | `SPEC_INCOMPLETE` |
| Invalid email format | `notanemail` | `INPUT_INVALID_EMAIL` (inline error) |
| API down | API returns 500 | Inline error, retry button |
| Network failure | Offline | Inline error, retry button |

### 12.3 Edge Cases

| Test | Scenario | Expected Behavior |
| --- | --- | --- |
| Already on waitlist | Sign up with existing email | Friendly "you're already on the list" message |
| Bot submission | Honeypot filled | Silent success (don't tip off the bot) |
| Referral from self | User refers themselves | Either block or count once |
| First-time visitor with no JS | No JS available | Static HTML fallback (most content visible) |
| Page load with slow network | 3G throttled | Page still loads, all content visible within 5s |

---

**END OF LANDING PAGE BUILDER AGENT PRD**