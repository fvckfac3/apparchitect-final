# AppArchitect Brand Assets

Ready-to-use logo, monogram, wordmark, and favicon in SVG.

## Files

- `file logo.svg` — Primary mark (uses `currentColor`)
- `file logo-monogram.svg` — 16-32px variant
- `file logo-wordmark.svg` — 220x48 header variant
- `file favicon.svg` — 32x32 favicon (teal + orange)

## Usage

### HTML

```html
<img src="/brand/logo-wordmark.svg" alt="AppArchitect" width="180">
```

### Inline (for currentColor inheritance)

```html
<a href="/" class="flex items-center gap-2 text-neutral-900">
  <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
    <path d="M4 28 L16 4 L28 28 L23 28 L16 12 L9 28 Z"/>
    <rect x="14" y="2" width="4" height="4"/>
  </svg>
  <span class="font-bold text-lg">AppArchitect</span>
</a>
```

### Next.js metadata

```ts
export const metadata = {
  icons: { icon: '/brand/favicon.svg' }
}
```

## Color tokens

- Primary: `#0F766E` (teal)
- Highlight: `#F59E0B` (amber — only on the apex marker)
- Text on light: `#0F172A`
- Text on dark: `#F1F5F9`