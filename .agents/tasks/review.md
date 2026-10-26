# Tailwind CSS Migration: homePage.css → index.css

Migrated all custom animations and utility classes from homePage.css into Tailwind-compliant @layer directives in index.css, removed the CSS import from homePage.jsx, and deleted the orphaned CSS file. All 16 keyframe animations are preserved with identical timing, easing, and delays; all utility classes have been converted to Tailwind custom animation utilities; accessibility support via `motion-reduce:animate-none` is applied throughout.

**Watch for:** Stale comment in homePage.jsx that references the deleted file; no functional impact.

**Verdict**: APPROVED

## High-level view

Animations are now defined as custom utilities in a @layer block in index.css, making them available across the project as Tailwind classes. The migration preserves every keyframe definition—timing, easing functions, and cubic-bezier curves are identical to the originals. All 16 animations (mgFloat, mgPulse, mgSpin, mgFadeUp, mgFadeDown, mgFadeLeft, mgFadeRight, mgScaleIn, mgScaleSoft, mgRevealLine, mgGlow, mgShine, mgSoftPulse, mgRotateSlow, mgBounceArrow, mgTextGlow) are now utility classes prefixed with `animate-mg-`. The homePage.jsx import has been removed and the CSS file deleted. Accessibility compliance is maintained through `motion-reduce:animate-none` on all animated elements.

<details>
<summary>Issues (0)</summary>

No blocking concerns.

</details>

<details>
<summary>Details</summary>

### Animation definitions migrated to @layer utilities

All 16 keyframe animations from homePage.css have been copied into `src/index.css` within a `@layer utilities` block. Each keyframe preserves the original transform, opacity, and shadow values exactly. Timing is identical: mgFloat runs 4s ease-in-out infinite, mgPulse 2s ease-in-out infinite, mgSpin 18s linear infinite, mgFadeUp 0.55s with a specific cubic-bezier(0.22, 1, 0.36, 1), and so on. The cubic-bezier curves and delays match the originals to the decimal.

### Custom animation utility classes

Corresponding `.animate-mg-*` utility classes are defined for each keyframe. For example, `.animate-mg-fade-up` applies `animation: mgFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both` with `will-change: opacity, transform`. This pattern is consistent across all utilities, mapping the animation name, duration, and easing function to Tailwind's class convention.

### Accessibility via motion-reduce

Every animated element in homePage.jsx includes `motion-reduce:animate-none`, which disables animations for users with prefers-reduced-motion enabled. This is applied to over 50 animated elements across hero, categories, products, rare finds, and other sections.

### Animation delays applied via inline styles

Dynamic delays are applied using `style={{animationDelay: '...'}}` attributes on elements. Hero elements use delays of 0.05s through 0.48s; category cards use 0.03s through 0.28s; product cards use 0.03s through 0.18s. This approach preserves the staggered animation effect from the original CSS.

### CSS file removed and import deleted

`src/pages/homePage.css` has been deleted (verified in git diff). The line `import './homePage.css';` has been removed from the top of homePage.jsx (lines 1-7 checked; import statement not present).

### Stale comment present but not functional

homePage.jsx line 174 contains a comment "GOOGLE FONTS + ANIMATIONS (moved to homePage.css)" which is now outdated documentation. This is not a code issue; it's a comment that could be updated to "moved to index.css @layer utilities" for clarity, but it poses no functional risk.

</details>

## File map

<details>
<summary>Files changed</summary>

- **src/index.css** — Added 192 lines: @layer utilities block containing all 16 @keyframes definitions and 18 corresponding `.animate-mg-*` utility classes with will-change and timing properties.
- **src/pages/homePage.jsx** — Modified 175 lines: removed `import './homePage.css';`, replaced all hardcoded CSS class references with `animate-mg-*` Tailwind utilities, added `motion-reduce:animate-none` to animated elements, applied inline `style={{animationDelay}}` for staggered timing.
- **src/pages/homePage.css** — Deleted (882 lines removed).
- **.agents/tasks/plan.md** — Added (migration planning document).

[Full diff](../../)

</details>
