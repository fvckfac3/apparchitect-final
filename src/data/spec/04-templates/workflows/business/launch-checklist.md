# Launch Checklist Template

**Layer:** Templates / Workflows / Business
**Owner:** Orchestrator Agent + Project Manager
**Source Workflow:** `06 - workflows/business.md`
**Version:** 1.0

## Purpose

Define the complete launch readiness criteria, go/no-go gates, and post-launch monitoring plan. The Launch Checklist is the final quality gate before a product ships to real users — every item must be verified before the product goes live.

## When to Use

- 30 days before planned launch
- 7 days before planned launch (final review)
- 24 hours before launch (go/no-go decision)
- Immediately post-launch (monitoring activation)

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| launch_id | text (e.g. LAUNCH-001) | yes |
| product_name | text | yes |
| launch_type | enum (public beta, GA, soft launch, full launch) | yes |
| target_launch_date | date | yes |
| actual_launch_date | date | conditional |
| launch_owner | text | yes |
| status | enum (planning, pre-launch, ready, launched, post-launch) | yes |

### Pre-Launch: Technical Readiness

#### Infrastructure

- [ ] Production environment provisioned and tested
- [ ] Database migrations tested and reversible
- [ ] Backup and recovery procedures tested
- [ ] CDN configured and tested
- [ ] DNS configured and propagated
- [ ] SSL certificates installed and verified
- [ ] Monitoring and alerting active
- [ ] Error tracking (Sentry/Honeybadger) configured
- [ ] Log aggregation working
- [ ] Performance baseline established

#### Application

- [ ] All critical features deployed to production
- [ ] Smoke tests passing on production
- [ ] Authentication flows tested end-to-end
- [ ] Payment flows tested end-to-end (test mode → live mode)
- [ ] Email delivery verified (transactional + marketing)
- [ ] Push notifications working (if applicable)
- [ ] File uploads/downloads working
- [ ] API rate limits configured
- [ ] Security headers configured (CSP, HSTS, etc.)

#### Performance

- [ ] Load testing completed at 2x expected traffic
- [ ] P95 response times meet NFR targets
- [ ] Database queries optimized
- [ ] Frontend bundle size within budget
- [ ] Images optimized and CDN-served
- [ ] Lazy loading implemented where needed

#### Security

- [ ] Penetration testing completed (if required)
- [ ] Security headers verified
- [ ] Secrets management verified (no hardcoded secrets)
- [ ] Authentication and authorization tested
- [ ] Data encryption at rest and in transit verified
- [ ] GDPR/privacy compliance verified
- [ ] Dependency vulnerabilities scanned
- [ ] Incident response plan documented

### Pre-Launch: Product Readiness

#### Core Functionality

- [ ] All MVP features functional
- [ ] Error states handled gracefully
- [ ] Empty states designed and tested
- [ ] Loading states implemented
- [ ] Onboarding flow tested with 5+ users
- [ ] Account creation flow tested
- [ ] Core user journey tested end-to-end

#### Content

- [ ] All user-facing copy reviewed
- [ ] Error messages written and helpful
- [ ] Email templates finalized
- [ ] Legal pages (ToS, Privacy) published
- [ ] Help documentation published
- [ ] FAQ published
- [ ] Marketing site copy reviewed

#### Accessibility

- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader testing completed
- [ ] Color contrast verified
- [ ] Form labels and ARIA attributes correct

### Pre-Launch: Business Readiness

#### Payments

- [ ] Payment provider configured for live mode
- [ ] Webhooks configured and tested
- [ ] Tax handling verified
- [ ] Invoice templates finalized
- [ ] Refund process tested
- [ ] Subscription management tested

#### Support

- [ ] Support channel established (email, chat, etc.)
- [ ] Support documentation ready
- [ ] Support team trained on product
- [ ] Escalation paths defined
- [ ] Response time SLAs defined

#### Analytics

- [ ] Analytics tracking verified in production
- [ ] Conversion funnels configured
- [ ] Key events tracked
- [ ] Dashboards created and accessible
- [ ] North star metric defined and tracked

### Pre-Launch: Marketing Readiness

- [ ] Launch announcement drafted
- [ ] Social media posts scheduled
- [ ] Email list primed for launch
- [ ] Press kit ready (if applicable)
- [ ] Product Hunt page prepared (if applicable)
- [ ] SEO meta tags configured
- [ ] Open Graph tags configured
- [ ] Sitemap submitted
- [ ] Analytics goals configured in marketing tools

### Pre-Launch: Operational Readiness

- [ ] On-call rotation scheduled
- [ ] Incident response runbook ready
- [ ] Status page configured
- [ ] Customer communication templates ready
- [ ] Rollback procedure tested and documented
- [ ] Feature flags configured for gradual rollout

### Launch Day: Go/No-Go Criteria

#### Must Have (Blocking)

- [ ] All critical features functional in production
- [ ] Payment processing working
- [ ] User authentication working
- [ ] No critical bugs open
- [ ] Monitoring active and alerting
- [ ] On-call team available for 24h

#### Should Have (Warning)

- [ ] Performance within targets
- [ ] All accessibility checks passing
- [ ] Support channels active
- [ ] Analytics tracking verified

#### Nice to Have (Not Blocking)

- [ ] All marketing channels ready
- [ ] All documentation published
- [ ] All integrations tested

### Launch Sequence

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Final smoke test in production | | |
| 2 | Enable production mode | | |
| 3 | Verify payment processing | | |
| 4 | Send launch emails | | |
| 5 | Post on social media | | |
| 6 | Publish marketing site updates | | |
| 7 | Monitor for first hour | | |
| 8 | Monitor for first 24h | | |

### Post-Launch: First 24 Hours

- [ ] Monitor error rates (target: <1%)
- [ ] Monitor response times (target: meets NFR)
- [ ] Monitor payment success rate (target: >95%)
- [ ] Monitor sign-up conversion rate
- [ ] Monitor active users
- [ ] Check all critical integrations
- [ ] Respond to support requests within SLA
- [ ] Triage and fix critical bugs immediately
- [ ] Daily standup with launch team

### Post-Launch: First Week

- [ ] Daily monitoring review
- [ ] Daily user feedback review
- [ ] Daily support ticket triage
- [ ] Performance trend analysis
- [ ] User behavior analysis
- [ ] Bug fix velocity tracking
- [ ] Feature request triage
- [ ] Stakeholder launch report

### Post-Launch: First Month

- [ ] Weekly metrics review
- [ ] Cohort retention analysis
- [ ] Revenue analysis (if applicable)
- [ ] User feedback synthesis
- [ ] Roadmap prioritization based on launch data
- [ ] Public retrospective

### Rollback Plan

| Field | Type | Required |
|-------|------|----------|
| rollback_triggers | list (criteria that trigger rollback) | yes |
| rollback_owner | text | yes |
| rollback_procedure | textarea | yes |
| rollback_communication_plan | textarea | yes |
| data_preservation_strategy | textarea | yes |
| estimated_rollback_time | text | yes |

### Success Criteria (30-Day Review)

| Metric | Target | Actual |
|--------|--------|--------|
| Active users | | |
| Retention rate | | |
| Conversion rate | | |
| Revenue | | |
| NPS score | | |
| Support ticket volume | | |

## Validation Rules

- All must-have items must be verified before launch
- Go/no-go decision requires explicit sign-off from launch owner
- Rollback plan must be tested before launch
- Post-launch monitoring must continue for at least 30 days

## Cross-References

- **Workflow:** `06 - workflows/business.md`
- **Pricing Model:** `04 - templates/workflows/business/pricing-model.md`
- **Financial Model:** `04 - templates/workflows/business/financial-model.md`
- **Test Plan Spec:** `04 - templates/workflows/implementation/test-plan-spec.md`

---

*A launch without a rollback plan isn't a launch — it's a gamble. Always know how to undo.*