<!-- @format -->

# sikopet / sikopet Design System

> Codified from `md/style-guide.md`, `src/page/Home.jsx`, `src/page/auth/Login.jsx`, and `src/App.jsx`.
> Every component in this project MUST follow these conventions.

---

## 1. Design Principles

- **8pt spacing grid** — all spacing is a multiple of 4 or 8
- **Soft UI** — no hard borders; use shadows and subtle backgrounds for depth
- **Mobile-first** responsive — base styles for mobile, `sm:`, `md:`, `lg:` breakpoints
- **Information hierarchy** through spacing, not borders
- **Minimal accent** — one primary color, neutral palette for everything else
- **Accessible** — focus rings, semantic HTML, ARIA labels, keyboard navigable

---

## 2. Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| UI Library | React 19 (JSX)                                     |
| Build Tool | Vite 8                                             |
| CSS        | Tailwind CSS 4 (utility-first, no custom CSS file) |
| Local DB   | Dexie (IndexedDB)                                  |
| PWA        | vite-plugin-pwa (Workbox)                          |
| Linting    | ESLint 10                                          |
| Routing    | react-router-dom                                   |

---

## 3. Color Palette

### 3.1 Brand / Primary

| Token          | Hex       | Tailwind Usage                    | Use                            |
| -------------- | --------- | --------------------------------- | ------------------------------ |
| Primary        | `#398EB3` | `bg-[#398EB3]` `stroke="#398eb3"` | Buttons, links, icons, accents |
| Primary Hover  | `#2F7A9A` | `hover:bg-[#2F7A9A]`              | Button/link hover states       |
| Primary Active | `#286783` | —                                 | Active/pressed states          |
| Primary Dark   | `#2F7698` | `text-[#2F7698]`                  | Headings, secondary brand      |
| Primary Light  | `#EAF6FB` | `bg-[#EAF6FB]`                    | Icon containers, tag bg        |
| Primary Soft   | `#D8EDF6` | —                                 | Lighter tints                  |

### 3.2 Accent / Secondary

| Token | Hex       | Tailwind Usage                    | Use                                                |
| ----- | --------- | --------------------------------- | -------------------------------------------------- |
| Teal  | `#4CC9B0` | `bg-[#4CC9B0]`                    | Gradients, checkmarks, highlights                  |
| Sky   | `#67B2D4` | `bg-[#67B2D4]` `stroke="#67B2D4"` | Decorative blobs, selection bg, decorative accents |

### 3.3 Gradient Pairs

| Name           | Tailwind                                    | Use                                  |
| -------------- | ------------------------------------------- | ------------------------------------ |
| Brand Gradient | `from-[#398eb3] to-[#4CC9B0]`               | Logo bg, progress bars, hero accents |
| Dark Gradient  | `from-[#2F7698] to-[#0F172A]`               | Dark cards, role badges              |
| CTA Gradient   | `from-[#398eb3] via-[#2F7698] to-[#0F172A]` | CTA banner background                |

### 3.4 Neutral / Background

| Token             | Hex                   | Tailwind Usage                | Use                                      |
| ----------------- | --------------------- | ----------------------------- | ---------------------------------------- |
| Background        | `#F7F9FB` / `#F7FAFC` | `bg-[#F7F9FB]` `bg-[#F7FAFC]` | Page background                          |
| Surface           | `#FFFFFF`             | `bg-white`                    | Cards, panels                            |
| Surface Secondary | `#F1F5F9`             | `bg-[#F1F5F9]`                | Nested cards, sidebar bg, muted sections |
| Border            | `#E5E7EB`             | `border-[#E5E7EB]`            | Input borders                            |
| Border Soft       | `#D8E4EA`             | `border-[#D8E4EA]`            | Card borders, dividers                   |
| Divider           | `#E8EEF2`             | `border-[#E8EEF2]`            | Table row borders, subtle dividers       |

### 3.5 Text

| Token          | Hex       | Tailwind Usage          | Use                                  |
| -------------- | --------- | ----------------------- | ------------------------------------ |
| Primary Text   | `#0F172A` | `text-[#0F172A]`        | Headings, bold text, primary content |
| Body Dark      | `#1F2937` | `text-[#1F2937]`        | Alt primary text                     |
| Body Medium    | `#374151` | `text-[#374151]`        | Form labels                          |
| Secondary Text | `#475569` | `text-[#475569]`        | Body paragraphs, descriptions        |
| Tertiary Text  | `#6B7280` | `text-[#6B7280]`        | Subtitles, helper text               |
| Muted Text     | `#94A3B8` | `text-[#94A3B8]`        | Captions, timestamps, small labels   |
| Placeholder    | `#9CA3AF` | `placeholder-[#9CA3AF]` | Input placeholders                   |
| Disabled       | `#D1D5DB` | `text-[#D1D5DB]`        | Disabled state                       |

### 3.6 Status

| Status  | Solid     | Light / bg | Tailwind Pattern                                      |
| ------- | --------- | ---------- | ----------------------------------------------------- |
| Success | `#22C55E` | `#DCFCE7`  | `text-[#22C55E] bg-[#22C55E]/10` + dot `bg-[#22C55E]` |
| Warning | `#F59E0B` | `#FEF3C7`  | `text-[#F59E0B] bg-[#F59E0B]/10`                      |
| Danger  | `#EF4444` | `#FEE2E2`  | `text-[#EF4444] bg-[#EF4444]/10`                      |
| Info    | `#3B82F6` | `#DBEAFE`  | `text-[#3B82F6] bg-[#3B82F6]/10`                      |
| Neutral | `#94A3B8` | `#F1F5F9`  | `text-[#94A3B8] bg-[#F1F5F9]`                         |

---

## 4. Typography

### 4.1 Font Families

```css
/* Body (default) */
font-family: "Inter", "Segoe UI", Roboto, sans-serif;

/* Display / Headings */
font-family: "Hanken Grotesk", sans-serif;
```

**Tailwind usage:**

- Body text: no extra class needed (applied at root `div`)
- Headings: add `font-display` class

### 4.2 Type Scale

| Level         | Size (Mobile) | Size (Desktop) | Weight          | Tailwind Pattern                                                                       |
| ------------- | ------------- | -------------- | --------------- | -------------------------------------------------------------------------------------- |
| H1            | `38px`        | `46px → 56px`  | extrabold (800) | `font-display font-extrabold text-[38px] sm:text-[46px] lg:text-[56px] tracking-tight` |
| H2            | `30px`        | `38px`         | extrabold (800) | `font-display font-extrabold text-[30px] sm:text-[38px] tracking-tight`                |
| H3            | `24px`        | —              | bold (700)      | `font-display font-bold text-[24px] tracking-tight`                                    |
| H4            | `16px`        | —              | bold (700)      | `font-display font-bold text-[16px]`                                                   |
| Section Title | `30px`        | `36px → 38px`  | extrabold (800) | `font-display font-extrabold text-[30px] sm:text-[36px] sm:text-[38px] tracking-tight` |
| Body Large    | `17px`        | `18px`         | —               | `text-[17px] lg:text-[18px] leading-relaxed`                                           |
| Body Regular  | `15px`        | `16px`         | —               | `text-[15px]` or `text-[14.5px]`                                                       |
| Body Small    | `14px`        | `14.5px`       | —               | `text-[14px]` or `text-[14.5px]`                                                       |
| Caption       | `12px`        | `13px`         | medium          | `text-[12px] font-medium` or `text-[13px] font-medium`                                 |
| Micro         | `10px`        | `11px`         | medium          | `text-[10px]` or `text-[11px] font-medium`                                             |

### 4.3 Section Label (Eyebrow)

Pattern used above section headings:

```
text-[13px] font-bold text-[#2F7698] uppercase tracking-wider
```

---

## 5. Spacing (8pt Grid)

All spacing values used in the project:

| Value | Tailwind                        | Common Use                             |
| ----- | ------------------------------- | -------------------------------------- |
| 4px   | `p-1`, `gap-1`, `m-1`           | Tight internal spacing                 |
| 8px   | `p-2`, `gap-2`, `m-2`           | Small internal spacing                 |
| 12px  | `p-3`, `gap-3`, `m-3`, `py-1.5` | Form field gaps, list items            |
| 16px  | `p-4`, `gap-4`, `m-4`           | Card padding small, section gaps       |
| 20px  | `p-5`, `gap-5`                  | Card padding, grid gaps                |
| 24px  | `p-6`, `gap-6`, `mt-6`          | Card padding standard, section margins |
| 32px  | `p-8`, `gap-8`, `mt-8`          | Large card padding, section gaps       |
| 40px  | `gap-10`, `mt-10`               | Feature section gaps                   |
| 48px  | `gap-12`, `py-12`               | Section vertical padding               |
| 64px  | `py-20`, `py-24`, `py-28`       | Major section vertical spacing         |
| 80px  | `py-32`                         | Largest section spacing                |

### Common Spacing Patterns

```
Form field gap:        space-y-5
Card internal:         p-5, p-6, or p-8
Section vertical:      py-24 lg:py-32
Section horizontal:    px-6 lg:px-10
Feature grid gap:      gap-10 lg:gap-16
Small grid gap:        gap-5
Tight grid gap:        gap-3 or gap-3.5
```

---

## 6. Border Radius

| Component           | Radius       | Tailwind                         |
| ------------------- | ------------ | -------------------------------- |
| Card (standard)     | 16px         | `rounded-lg`                     |
| Card (large)        | 28px         | `rounded-[1.75rem]`              |
| Card (hero)         | 36px         | `rounded-[2.25rem]`              |
| Modal / Auth card   | 24px         | `rounded-[24px]`                 |
| Button              | 12px or full | `rounded-[12px]` or `rounded-lg` |
| Input               | 12px         | `rounded-[12px]`                 |
| Badge / Pill        | full         | `rounded-lg`                     |
| Table container     | 16px         | `rounded-lg`                     |
| Dropdown            | 16px         | `rounded-lg`                     |
| Icon container (sm) | 8px          | `rounded-lg`                     |
| Icon container (md) | 12px         | `rounded-lg`                     |
| Icon container (lg) | 16px         | `rounded-lg`                     |

---

## 7. Shadows

Defined as custom CSS classes in `<style>` blocks:

```css
.shadow-soft {
	box-shadow:
		0 1px 2px rgba(15, 23, 42, 0.04),
		0 8px 24px -8px rgba(15, 23, 42, 0.08);
}

.shadow-lift {
	box-shadow:
		0 4px 10px rgba(15, 23, 42, 0.05),
		0 20px 40px -16px rgba(15, 23, 42, 0.16);
}

.shadow-glow {
	box-shadow:
		0 0 0 1px rgba(57, 142, 179, 0.1),
		0 12px 32px -8px rgba(57, 142, 179, 0.28);
}
```

### Shadow Usage

| Class         | Use                                              |
| ------------- | ------------------------------------------------ |
| `shadow-soft` | Default card elevation, logo icon, nav on scroll |
| `shadow-lift` | Hero cards, hover state, dashboard preview, CTA  |
| `shadow-glow` | Primary CTA buttons (adds blue glow ring)        |

### Hover Shadows (CSS pseudo-class)

```css
.hover\:shadow-lift:hover {
	/* same as shadow-lift */
}
.hover\:shadow-soft:hover {
	/* same as shadow-soft */
}
```

---

## 8. Glass Effects

```css
.glass-nav {
	background: rgba(247, 250, 252, 0.72);
	backdrop-filter: blur(14px) saturate(160%);
	-webkit-backdrop-filter: blur(14px) saturate(160%);
	border-bottom: 1px solid rgba(216, 228, 234, 0.6);
}

.glass-card {
	background: rgba(255, 255, 255, 0.62);
	backdrop-filter: blur(16px) saturate(160%);
	-webkit-backdrop-filter: blur(16px) saturate(160%);
	border: 1px solid rgba(255, 255, 255, 0.5);
}
```

| Class        | Use                                               |
| ------------ | ------------------------------------------------- |
| `glass-nav`  | Fixed top navigation bar                          |
| `glass-card` | Floating info cards, sidebar nav items on dark bg |

---

## 9. Layout

### 9.1 Page Container

```
max-w-[1280px] mx-auto px-6 lg:px-10
```

### 9.2 Responsive Breakpoints

| Name    | Width      | Tailwind         |
| ------- | ---------- | ---------------- |
| Mobile  | < 768px    | base (no prefix) |
| Tablet  | 768–1199px | `sm:` / `md:`    |
| Desktop | ≥ 1200px   | `lg:`            |

### 9.3 App Layout (Dashboard)

```
Sidebar:     240px (desktop), 80px collapsed (tablet)
Topbar:      72px height (h-[72px])
Content:     Fluid, max-w-[1280px]
```

### 9.4 Landing Page Layout

```
Nav height:          72px (h-[72px])
Hero section:        pt-[150px] lg:pt-[176px]
Section vertical:    py-24 lg:py-32
Section max-width:   max-w-[1280px] (full), max-w-[820px] (FAQ), max-w-[620px] (text blocks)
```

---

## 10. Components

### 10.1 Buttons

#### Primary Button

```
px-6 py-3.5 rounded-lg bg-[#398eb3] text-white font-semibold text-[15px]
shadow-glow hover:bg-[#2F7698] hover:-translate-y-0.5
transition-all duration-300
```

Variant (icon + text): add `inline-flex items-center gap-2` and a group-hover arrow.

#### Secondary Button

```
px-6 py-3.5 rounded-lg border border-[#D8E4EA] bg-white/70 text-[#0F172A]
font-semibold text-[15px] hover:bg-white hover:shadow-soft
transition-all duration-300
```

#### Ghost / Text Link Button

```
px-4 py-2.5 text-[14.5px] font-semibold text-[#475569]
hover:text-[#0F172A] transition-colors
```

#### Dark CTA (Navbar)

```
px-5 py-2.5 rounded-lg bg-[#0F172A] text-white text-[14.5px] font-semibold
shadow-soft hover:shadow-lift hover:-translate-y-0.5
transition-all duration-300
```

#### Form Submit Button (Login)

```
w-full h-[48px] rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px]
shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98]
transition-all duration-200
```

#### Mobile Menu Button

```
p-2 -mr-2 lg:hidden focus-ring
```

### 10.2 Inputs

```
w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white
text-[15px] text-[#0F172A] placeholder-[#9CA3AF]
transition-colors duration-200
hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none
```

Label pattern:

```
block text-[13.5px] font-medium text-[#374151] mb-1.5
```

### 10.3 Cards

#### Standard Card

```
rounded-lg bg-white border border-[#D8E4EA] p-6 shadow-soft
```

#### Feature Card (with hover)

```
rounded-lg bg-white border border-[#D8E4EA] p-6
hover:shadow-lift hover:-translate-y-1 transition-all duration-300
```

#### Hero Card (large)

```
rounded-[2.25rem] bg-white shadow-lift border border-[#D8E4EA] p-6 sm:p-8
```

#### Nested Card (inside feature section)

```
rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5
```

#### Section Container Card

```
rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8
```

#### Dark Card

```
rounded-[1.75rem] bg-[#0F172A] px-6 sm:px-10 py-9 sm:py-11 shadow-lift
```

#### Glass Card (floating)

```
glass-card rounded-lg shadow-lift px-4 py-3.5
```

#### Auth Card (Login)

```
rounded-[24px] bg-white border border-[#D8E4EA] shadow-lift p-8 sm:p-10
```

### 10.4 Status Badges

#### Success

```
inline-flex items-center gap-1.5 text-[12px] font-semibold
text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-lg
```

With dot: `w-1.5 h-1.5 rounded-lg bg-[#22C55E]`

#### Info

```
text-[11px] font-semibold text-[#2F7698] bg-[#EAF6FB] px-2 py-0.5 rounded-lg
```

#### Neutral / Muted

```
text-[11px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-lg
```

#### Warning

```
text-[11px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-lg
```

### 10.5 KPI / Stat Cards

#### Dark Stats Bar

```
rounded-[1.75rem] bg-[#0F172A] px-6 sm:px-10 py-9 sm:py-11
grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 shadow-lift
```

Stat number: `font-display font-extrabold text-white text-[30px] sm:text-[36px] tracking-tight`
Stat label: `text-[13px] text-white/60 font-medium mt-1`

#### Light KPI Card

```
rounded-lg bg-white border border-[#D8E4EA] p-5 shadow-soft
```

KPI label: `text-[12px] text-[#94A3B8] font-medium`
KPI value: `font-display font-bold text-[#0F172A] text-[22px] mt-1`
KPI change: `text-[12px] text-[#22C55E] font-semibold mt-1`

### 10.6 Navigation

#### Desktop Nav Link

```
font-medium text-[14.5px] text-[#475569]
hover:text-[#0F172A] transition-colors focus-ring
```

#### Mobile Nav Link

```
font-medium text-[#475569] focus-ring
```

#### Sidebar Active Item

```
px-3 py-2 rounded-lg bg-[#EAF6FB] text-[#2F7698] text-[13px] font-semibold
```

#### Sidebar Inactive Item

```
px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium
```

### 10.7 Icon Containers

#### Small (32px)

```
w-8 h-8 rounded-lg bg-[color]/15 grid place-items-center
```

#### Medium (40px)

```
w-10 h-10 rounded-lg bg-[#EAF6FB] grid place-items-center
```

#### Large (48px)

```
w-12 h-12 rounded-lg bg-[#EAF6FB] grid place-items-center
```

SVG icon inside: `width="18" height="18"` (small), `width="22" height="22"` (large), stroke `#398eb3`, strokeWidth `1.8`

### 10.8 Avatar / Logo

#### Logo Icon

```
w-9 h-9 rounded-lg bg-gradient-to-br from-[#398eb3] to-[#4CC9B0]
grid place-items-center shadow-soft
```

#### Avatar (small, stacked)

```
w-9 h-9 rounded-lg bg-[color] border-2 border-white
```

### 10.9 Checklist / Feature List Items

```
flex items-center gap-2.5 text-[14.5px] text-[#475569]
```

Checkmark icon: SVG `width="16" height="16"`, stroke `#4CC9B0`, strokeWidth `2.5`

### 10.10 FAQ Accordion

#### Trigger Button

```
w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-ring
```

#### Panel

```
px-6 — content has max-height: 0 by default, max-height: 320px when open
```

#### Chevron

Rotates 180deg when `.faq-item.open`.

### 10.11 Table Row Pattern

```
flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2]
```

### 10.12 Progress Bar

Track: `w-full h-2.5 rounded-lg bg-[#D8E4EA] overflow-hidden`
Fill: `h-full rounded-lg bg-gradient-to-r from-[#398eb3] to-[#4CC9B0]`

### 10.13 Browser Mockup (Dashboard Preview)

```
rounded-[2.25rem] bg-white border border-[#D8E4EA] shadow-lift p-3 sm:p-4
```

Window dots: `w-2.5 h-2.5 rounded-lg bg-[#EF4444]/70` (red), `#F59E0B` (yellow), `#22C55E` (green)

URL bar: `text-[12px] text-[#94A3B8] font-medium`

### 10.14 Divider / Separator

```
border-t border-[#E5E7EB]
```

Or softer: `border-t border-[#E8EEF2]`

### 10.15 Blob Decorations

```
blob absolute -top-24 -left-24 w-[420px] h-[420px] rounded-lg bg-[#67B2D4]/30 -z-10
```

Class: `.blob { filter: blur(70px); }`

---

## 11. Animations

### 11.1 Scroll Reveal

```css
.reveal {
	opacity: 0;
	transform: translateY(18px);
	transition:
		opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
		transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.reveal[data-revealed] {
	opacity: 1;
	transform: translateY(0);
}
```

Delays: `.reveal-delay-1` (0.08s), `.reveal-delay-2` (0.16s), `.reveal-delay-3` (0.24s)

**IMPORTANT:** Use `data-revealed` attribute, NOT a CSS class. React overwrites `className` on re-render but does not touch `data-*` attributes.

### 11.2 Float Animation

```css
.float-y {
	animation: floatY 6s ease-in-out infinite;
}
.float-y.slow {
	animation-duration: 8s;
}
.float-y.rev {
	animation-direction: reverse;
}
@keyframes floatY {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}
```

### 11.3 Node Pulse (SVG)

```css
.node-pulse {
	animation: nodePulse 2.6s ease-out infinite;
}
```

### 11.4 Dash Move (SVG paths)

```css
.dash {
	stroke-dasharray: 6 6;
	animation: dashMove 3.5s linear infinite;
}
```

### 11.5 Hover Transitions

```
transition-all duration-300   (cards, buttons, links)
transition-colors duration-200 (inputs, simple color changes)
transition-all duration-200   (form buttons with active state)
```

Hover lift: `hover:-translate-y-0.5` (subtle) or `hover:-translate-y-1` (card)
Active press: `active:scale-[0.98]`

### 11.6 FAQ Accordion

```css
.faq-panel {
	max-height: 0;
	overflow: hidden;
	transition:
		max-height 0.45s ease,
		padding 0.3s ease;
}
.faq-item.open .faq-panel {
	max-height: 320px;
}
.faq-item .chev {
	transition: transform 0.3s ease;
}
.faq-item.open .chev {
	transform: rotate(180deg);
}
```

---

## 12. Accessibility

### 12.1 Focus Ring

```css
.focus-ring:focus-visible {
	outline: 2px solid #398eb3;
	outline-offset: 3px;
	border-radius: 8px;
}
```

Apply `focus-ring` class to ALL interactive elements (links, buttons, inputs).

### 12.2 Skip Link

```
<a href="#main-heading" className="sr-only focus:not-sr-only focus:fixed focus:top-3
focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift">
  Lompat ke konten utama
</a>
```

### 12.3 ARIA Patterns

- `aria-label` on icon-only buttons and links
- `aria-expanded` on toggle buttons (menu, accordion)
- `aria-label` on SVG illustrations
- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- `role="img"` on decorative SVGs

### 12.4 Selection Color

```css
::selection {
	background: #67b2d4;
	color: #fff;
}
```

---

## 13. Icon Conventions

- Library: **Lucide Icons** (inline SVG, not a dependency)
- Stroke width: `1.8` for nav/feature icons, `2` for status, `2.5` for checkmarks
- Size: `16×16` (inline), `18×18` (nav/small containers), `22×22` (feature headers)
- Color: `stroke="#398eb3"` for primary icons, `stroke="#4CC9B0"` for checkmarks
- All decorative SVGs: `aria-hidden="true"`, functional SVGs: `role="img"` + `aria-label`

---

## 14. Code Conventions

### 14.1 File Structure

```
src/
├── App.jsx              # Router setup
├── main.jsx             # Entry point
├── index.css            # Tailwind import only
├── page/
│   ├── Home.jsx         # Landing page
│   └── auth/
│       ├── Login.jsx    # Login page
│       └── Register.jsx # Register page
├── assets/              # Static assets
└── components/          # Shared components (future)
```

### 14.2 Component Conventions

- One component per file
- Export default at function declaration: `export default function ComponentName()`
- File header: `/** @format */`
- Use tabs for indentation (not spaces)
- No comments unless requested
- Import order: React hooks, then libraries, then local modules
- Use `useState` / `useEffect` from react (named imports, not default React import unless needed for JSX transform)

### 14.3 Tailwind Patterns

- All colors via arbitrary values: `text-[#0F172A]`, `bg-[#398EB3]`
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Hover: `hover:` prefix
- Focus: `focus:`, `focus-visible:`, `focus-ring` class
- Active: `active:` prefix
- Group hover: `group` + `group-hover:`
- Transitions: `transition-all duration-200` or `duration-300`
- Transform: `hover:-translate-y-0.5`, `active:scale-[0.98]`
- Opacity via `/` syntax: `bg-[#22C55E]/10`
- Gradients: `bg-gradient-to-br from-[#398eb3] to-[#4CC9B0]`

### 14.4 Custom CSS Classes

All custom classes are defined in `<style>` blocks within components (not in index.css):

```
.shadow-soft, .shadow-lift, .shadow-glow
.hover\:shadow-lift:hover, .hover\:shadow-soft:hover
.focus-ring
.glass-nav, .glass-card
.blob
.reveal, .reveal[data-revealed]
.reveal-delay-1, .reveal-delay-2, .reveal-delay-3
.float-y, .float-y.slow, .float-y.rev
.node-pulse, .node-pulse.d1–d4
.dash
.faq-panel, .faq-item.open, .chev
::selection
.font-display
```

---

## 15. Responsive Patterns

### 15.1 Grid Layouts

```
Feature sections:    grid lg:grid-cols-2 gap-10 lg:gap-16
KPI bar:             grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6
Small cards:         grid sm:grid-cols-2 lg:grid-cols-4 gap-5
Dashboard sidebar:   grid lg:grid-cols-[220px_1fr]
Hero:                grid lg:grid-cols-[1.05fr_0.95fr] gap-16
```

### 15.2 Show/Hide Patterns

```
Desktop nav links:   hidden lg:flex
Mobile menu toggle:  lg:hidden
Mobile menu:         hidden → block (toggled)
Mobile footer links: grid sm:grid-cols-2 lg:grid-cols-5
```

### 15.3 Responsive Text

```
H1:    text-[38px] sm:text-[46px] lg:text-[56px]
H2:    text-[30px] sm:text-[38px]
Hero p: text-[17px] lg:text-[18px]
```

---

## 16. Page-Specific Patterns

### 16.1 Landing Page (Home.jsx)

- Glass nav with scroll shadow
- Hero: gradient bg blobs + 2-col grid + floating glass cards
- Stats: dark bar with counters
- Features: alternating 2-col sections with mockup cards
- Dashboard preview: browser chrome mockup
- Offline-first: dark card with flow diagram
- Roles: grid of gradient avatar badges
- Testimonials: 3-col glass cards
- FAQ: accordion
- CTA: gradient banner
- Footer: 5-col grid + social icons

### 16.2 Auth Pages (Login.jsx)

- Centered card on bg
- Decorative blobs
- Logo + title
- Form with inputs, checkbox, submit
- Divider ("atau")
- Social login button (Google)
- Register link
- Copyright footer
