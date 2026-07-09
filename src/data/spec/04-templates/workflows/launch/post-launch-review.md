# Post-Launch Review Template

**Layer:** Templates / Workflows / Launch
**Owner:** Orchestrator Agent + All Stakeholders
**Source Workflow:** `06 - workflows/launch.md`
**Version:** 1.0

## Purpose

Systematically evaluate launch performance against goals, capture learnings, identify what to keep / change / stop, and feed insights back into the next launch or iteration. The Post-Launch Review closes the loop on every launch and turns each one into organizational learning.

## When to Use

- 7 days post-launch (quick review)
- 30 days post-launch (full review)
- 90 days post-launch (strategic review)
- Before planning the next major initiative

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| review_id | text (e.g. PLR-001) | yes |
| product_name | text | yes |
| launch_date | date | yes |
| review_date | date | yes |
| review_type | enum (7-day, 30-day, 90-day, strategic) | yes |
| review_owner | text | yes |

### Quick Summary

| Field | Type | Required |
|-------|------|----------|
| one_line_summary | text | yes |
| launch_grade | enum (A+, A, B, C, D, F) | yes |
| key_win | text | yes |
| key_miss | text | yes |
| biggest_lesson | text | yes |
| would_we_launch_this_way_again | boolean | yes |

### Goals vs Results

#### Original Goals (from Launch Plan)

| Goal | Target | Actual | Status | Notes |
|------|--------|--------|--------|-------|
| Sign-ups | | | | |
| Activations | | | | |
| Paid conversions | | | | |
| Revenue | | | | |
| Press mentions | | | | |
| NPS | | | | |
| Other | | | | |

#### Goal Analysis

| Goal | Hit / Miss / Exceeded | Root Cause | Lesson |
|------|----------------------|------------|--------|
| | | | |

### Performance by Channel

#### Owned Channels

| Channel | Target | Actual | ROI | Lessons |
|---------|--------|--------|-----|---------|
| | | | | |

#### Earned Channels

| Channel | Target | Actual | Sentiment | Lessons |
|---------|--------|--------|-----------|---------|
| | | | | |

#### Paid Channels

| Channel | Spend | Sign-ups | CAC | LTV | ROAS | Lessons |
|---------|-------|----------|-----|-----|------|---------|
| | | | | | | |

### Customer Feedback Synthesis

#### Sentiment Analysis

| Sentiment | Volume | Examples |
|-----------|--------|----------|
| Positive | | |
| Neutral | | |
| Negative | | |
| Feature requests | | |
| Bug reports | | |

#### NPS / CSAT Results

| Metric | Score | Benchmark | Trend |
|--------|-------|-----------|--------|
| NPS | | | |
| CSAT | | | |
| CES (effort) | | | |

#### Top 5 Quotes (Verbatim)

1. "[quote]" — [user type], [channel]
2. "[quote]" — [user type], [channel]
3. "[quote]" — [user type], [channel]
4. "[quote]" — [user type], [channel]
5. "[quote]" — [user type], [channel]

#### Common Themes

| Theme | Frequency | Action |
|-------|-----------|--------|
| | | |

### Funnel Performance

| Stage | Pre-Launch Estimate | Actual | Variance | Insight |
|-------|--------------------|--------|----------|---------|
| Awareness | | | | |
| Interest | | | | |
| Consideration | | | | |
| Sign-up | | | | |
| Activation | | | | |
| Conversion | | | | |
| Retention (D7) | | | | |
| Retention (D30) | | | | |

#### Funnel Bottlenecks

Where are users dropping off? What can be improved?

1. [Stage]: [Drop-off rate] → [Hypothesized cause] → [Proposed fix]
2. [Stage]: [Drop-off rate] → [Hypothesized cause] → [Proposed fix]
3. [Stage]: [Drop-off rate] → [Hypothesized cause] → [Proposed fix]

### Product Performance

| Metric | Target | Actual | Notes |
|--------|--------|--------|-------|
| Uptime | | | |
| Page load (P95) | | | |
| Error rate | | | |
| Crash rate | | | |
| Support ticket volume | | | |
| Time-to-first-value | | | |
| Feature adoption | | | |

#### Critical Incidents

| Incident | Severity | Time to Resolve | Customer Impact | Lessons |
|----------|----------|-----------------|-----------------|---------|
| | | | | |

### Team Performance

| Team | What Went Well | What Went Poorly | Notes |
|------|----------------|------------------|-------|
| Marketing | | | |
| Product | | | |
| Engineering | | | |
| Support | | | |
| Sales | | | |
| Leadership | | | |

### What Worked (Keep Doing)

1. [Specific action] — [Result achieved] — [Why it worked]
2. [Specific action] — [Result achieved] — [Why it worked]
3. [Specific action] — [Result achieved] — [Why it worked]

### What Didn't Work (Stop Doing)

1. [Specific action] — [Result achieved] — [Why it failed]
2. [Specific action] — [Result achieved] — [Why it failed]
3. [Specific action] — [Result achieved] — [Why it failed]

### What to Try Next (Experiments)

| Experiment | Hypothesis | Success Metric | Timeline |
|------------|------------|----------------|----------|
| | | | |

### Budget Performance

| Category | Budgeted | Actual | Variance | ROI |
|----------|----------|--------|----------|-----|
| | | | | |

### Key Learnings

1. [Learning] — [Evidence] — [How it changes future launches]
2. [Learning] — [Evidence] — [How it changes future launches]
3. [Learning] — [Evidence] — [How it changes future launches]
4. [Learning] — [Evidence] — [How it changes future launches]
5. [Learning] — [Evidence] — [How it changes future launches]

### Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| | | | |

### Next Steps

| Decision | Owner | Deadline |
|----------|-------|----------|
| | | |

### Appendix

#### A. Raw Metrics Dashboard

(link or attach)

#### B. Customer Interview Synthesis

(link or attach)

#### C. Competitive Response

How did competitors react to our launch?

#### D. Market Reaction

Industry/analyst response, market signals

## Validation Rules

- Review must be conducted within 14 days of the type-specific date
- All original goals must be evaluated (hit/miss/exceeded)
- All major channels must be analyzed
- At least 5 direct customer quotes must be included
- Action items must have owners and due dates
- Findings must be shared with all stakeholders

## Cross-References

- **Workflow:** `06 - workflows/launch.md`
- **Launch Plan:** `04 - templates/workflows/launch/launch-plan.md`
- **Marketing Plan:** `04 - templates/workflows/launch/marketing-plan.md`
- **Discovery Report:** `04 - templates/workflows/discovery/discovery-report.md` (next discovery cycle)

---

*A launch you don't review is a launch you can't learn from. Every launch makes the next one better — only if you capture what happened.*