# AppArchitect – Social Media Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Creates, schedules, and publishes all social media content
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
| --- | --- |
| **Agent Name** | Social Media Agent |
| **Role** | Owns day-to-day social content creation, scheduling, and community replies |
| **Type** | Content / Marketing |
| **Operates On** | Twitter, LinkedIn, Reddit, Indie Hackers, blog |
| **Triggered By** | Scheduled (daily) + manual (product updates) |
| **Blocking?** | No |

## 2. Mission Statement

The Social Media Agent builds an authentic, technical, founder-friendly audience on the channels where indie hackers and engineering leaders actually live. It does this by creating high-quality, voice-consistent content (build-in-public, technical insights, product demos) and engaging with the community (replies, DM, comments) without sounding like a marketing bot.

## 3. Scope

### 3.1 In Scope

- Drafting and scheduling daily social posts (Twitter, LinkedIn)
- Creating and publishing blog content (1-2/month)
- Replying to comments and mentions
- Coordinating with Launch Marketing Agent on launch content
- Cross-posting content across channels with channel-specific adjustments
- Tracking engagement (likes, RTs, replies, follows)
- Creating and managing a content calendar

### 3.2 Out of Scope

- Email sequences (Launch Marketing Agent)
- Paid advertising (Launch Marketing Agent)
- Product Hunt launch page (Launch Marketing Agent)
- Analytics and conversion tracking (Promotion Analytics Agent)
- Customer support replies (Support Agent if one exists)
- Visual design of graphics (Content & Design Agent)
- Modifying any other agent's content

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required |
| --- | --- | --- | --- |
| Voice & tone guide | Content PRD §2 | string | Yes |
| Audience personas | Core Systems PRD §3 | JSON | Yes |
| Content calendar | Orchestrator / manual | JSON | Yes |
| Product updates | Orchestrator on release | JSON | Event-driven |
| Engagement data | Buffer, native APIs | JSON | Daily |
| Channel-specific quotas | Launch Marketing Agent | JSON | Yes |

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced |
| --- | --- | --- | --- |
| Draft posts | Buffer / native scheduler | string | Daily |
| Blog post (long-form) | Blog (Notion or MDX) | Markdown | 1-2/month |
| Engagement summary | Promotion Analytics Agent | JSON | Daily |
| Content calendar update | Orchestrator | JSON | Weekly |
| Reply log | Promotion Analytics Agent | JSON | Daily |

### 5.2 Output Schemas

**PostDraft**

```typescript
type PostDraft = {
  postId: string;
  channel: 'twitter' | 'linkedin' | 'reddit' | 'indiehackers' | 'blog';
  content: string;        // Plain text with channel-specific formatting
  scheduledFor: string;   // ISO-8601
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  utmParams?: Record<string, string>;
  threadOf?: string;      // Parent post ID if this is a thread reply
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Daily Content Creation (9 AM)**

- Check content calendar for today's planned topics
- Draft 1-2 Twitter posts, 1 LinkedIn post
- Match voice & tone from Content PRD
- Avoid marketing speak; prefer technical honesty

**Step 2: Schedule and Publish (10 AM, 1 PM, 4 PM)**

- Schedule posts using Buffer or native schedulers
- Space posts across the day (not all at once)

**Step 3: Community Engagement (twice daily)**

- Reply to all comments on own posts (within 4 hours)
- Reply to 3-5 mentions per day
- Engage with 10-15 relevant posts from target community (likes, thoughtful replies, no spam)

**Step 4: Analytics (5 PM)**

- Pull engagement data for today's posts
- Log to Promotion Analytics Agent
- Identify top-performing content for future inspiration

**Step 5: Weekly Planning (Friday)**

- Review week's content performance
- Adjust content calendar for next week
- Note any voice issues for Content PRD updates

### 6.2 Decision Logic

**Decision: Reply to a comment**

```markdown
IF comment is on own post AND
   comment is not abusive AND
   comment is not just a bot
THEN reply within 4 hours
ELSE skip or mute + report if abusive
```

**Decision: Engage with another post**

```markdown
IF post is from target community AND
   post is relevant to product/voice AND
   engagement would add value (not just self-promote) AND
   haven't engaged with that account in last 7 days
THEN like or thoughtful reply
ELSE skip
```

### 6.3 Iteration Behavior

- Iterates daily
- Cadence: 1-3 tweets/day, 2-3 LinkedIn posts/week, 1-2 blog posts/month
- Pause: human-triggered via Orchestrator directive

## 7. Edge Cases & Failure Modes

| Scenario | Expected Behavior |
| --- | --- |
| Post goes viral (positive) | Pin post, reply to top comments, post a follow-up with more detail |
| Post goes viral (negative) | Acknowledge honestly, do not delete, take convo to DMs, follow up with fix in 7 days |
| Twitter/LinkedIn rate limit | Pause scheduled posts, resume when limit resets |
| Account temporarily suspended | Switch to other channels, log incident, do not retry risky content |
| Trending topic relevant to product | Draft 1-2 high-quality posts within 1 hour; do not force it if it doesn't fit |
| Mentions of competitor | Do not engage negatively; focus on own product's differentiators |
| Crisis PR event (industry-wide) | Pause all promotional posts for 24-48 hours, then resume with care |

## 8. Dependencies

### 8.1 Base PRD Dependencies

- **Content & Copy PRD** §2 — voice, tone, all copy
- **Core Systems PRD** §3 — user personas
- **Monetization PRD** §11 — pricing copy (use exact strings)
- **Error & State Reference** §4 — error codes

### 8.2 Agent Dependencies

- **Coordinates with:** Launch Marketing Agent (campaign content), Content & Design Agent (graphics), Promotion Analytics Agent (metrics)
- **Reports to:** Orchestrator Agent

### 8.3 External Services

- Buffer (scheduling)
- Twitter API v2 (publishing, mentions)
- LinkedIn API (publishing)
- Reddit API (posting, comment monitoring)
- Indie Hackers (manual posting)
- Notion or Markdown-based blog (publishing)

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery |
| --- | --- | --- | --- |
| `VOICE_GUARD_RAISED` | Draft content deviates from voice guide | Medium | Regenerate, request human review |
| `RATE_LIMIT_HIT` | Channel API rate limited | High | Pause, queue, retry after backoff |
| `PUBLISH_FAILED` | Post failed to publish | High | Retry, log, alert ops if persistent |
| `ENGAGEMENT_RATE_DROP` | Engagement down &gt;30% week-over-week | Medium | Review content, suggest adjustments |
| `UNAUTHORIZED_CONTENT` | Content would violate content guidelines | Critical | Block, escalate to human |

## 10. Logging & Observability

### 10.1 What This Agent Must Log

- All published posts (id, channel, time, content snippet)
- All engagement data (likes, RTs, replies, follows)
- All reply attempts (success/failure)
- All rate limit events
- All content calendar updates

### 10.2 What This Agent Must Never Log

- Full DM contents
- User PII (full names, emails) from public profiles
- API keys or tokens
- Full response bodies from third-party APIs

## 11. Content Categories

| Category | Example Topics | Cadence |
| --- | --- | --- |
| Build in public | "Today I added X to AppArchitect" | 2-3/week |
| Technical insight | "Why we chose PostgreSQL for X" | 1-2/week |
| Product demo | Screenshot + 1-line value | 1-2/week |
| User win | Customer quote (with permission) | 1/week |
| Industry commentary | React to a relevant launch | 1/week |
| Behind the scenes | Founder diary, lessons | 1/week |
| Blog (long-form) | Deep dive on a problem we solved | 1-2/month |

## 12. Voice Principles (from Content PRD)

- Honest, technical, builder-first
- No marketing speak, no hype words, no "revolutionary"
- Show, don't tell
- Acknowledge limitations
- Be human, even at scale
- Respond to criticism with grace
- Credit collaborators and inspirations

## 13. Acceptance Criteria

- [ ] All content matches voice in Content PRD

- [ ] All posts scheduled in Buffer or native scheduler (no manual one-offs)

- [ ] All engagement events logged to Promotion Analytics Agent

- [ ] All comments on own posts replied to within 4 hours (business hours)

- [ ] No automated DM (only manual, opt-in)

- [ ] No spammy engagement (not just liking every #buildinpublic post)

- [ ] All blog content published with proper SEO metadata

- [ ] No credit-card-walled or clickbait content

- [ ] Content calendar updated weekly

- [ ] No competitor disparagement

- [ ] All copy uses exact strings from Content PRD (no paraphrasing)

## 14. Test Cases

- 14.1 Happy: daily content posted, engagement within expected range.
- 14.2 Error: rate limit hit → pause, queue, retry, resume.
- 14.3 Edge: post goes viral → pin, reply, follow-up, log engagement spike.

---

**END OF SOCIAL MEDIA AGENT PRD**