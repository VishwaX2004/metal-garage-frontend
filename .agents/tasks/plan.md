# CSS-to-Tailwind Migration Plan: homePage.css → homePage.jsx

**Workspace Root:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend`

**Objective:** Migrate all CSS animations, utilities, and styles from `src/pages/homePage.css` to Tailwind CSS utilities, custom @layer directives, and inline styles. Remove the CSS file and its import.

---

## (a) KEYFRAMES ANIMATIONS MAPPING

All @keyframes must be migrated to Tailwind custom animations via @layer directive in `src/index.css`. These are NOT built-in Tailwind animations and require custom definitions.

### Custom Animations to Add to `src/index.css` (in @layer directive)

**1. mgFloat (4s ease-in-out infinite)**
- Used on: `.mg-float` elements (hero image, story image, rare car)
- Maps to Tailwind: Custom animation (no built-in equivalent)
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgFloat {
      0%, 100% { transform: translate3d(0, 0, 0); }
      50% { transform: translate3d(0, -7px, 0); }
    }
    .animate-mg-float {
      animation: mgFloat 4s ease-in-out infinite;
      will-change: transform;
    }
  }
  ```

**2. mgPulse (2s ease-in-out infinite)**
- Used on: `.mg-pulse`, `.mg-orange-dot`
- Maps to Tailwind: Similar to `animate-pulse` but with `ease-in-out` instead of `cubic-bezier`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgPulse {
      0%, 100% { opacity: 0.65; }
      50% { opacity: 1; }
    }
    .animate-mg-pulse {
      animation: mgPulse 2s ease-in-out infinite;
    }
  }
  ```

**3. mgSpin (18s linear infinite)**
- Used on: `.mg-spin`
- Maps to Tailwind: Built-in `animate-spin` but with custom duration
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-mg-spin {
      animation: mgSpin 18s linear infinite;
    }
  }
  ```

**4. mgFadeUp (0.55s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-page-enter`, `.mg-section-title`, `.mg-section-description`, `.mg-product-item`, `.mg-rare-content`, `.mg-arrivals-header`, `.mg-why-item`, `.mg-community`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgFadeUp {
      0% {
        opacity: 0;
        transform: translate3d(0, 22px, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .animate-mg-fade-up {
      animation: mgFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      will-change: opacity, transform;
    }
  }
  ```

**5. mgFadeDown (0.55s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-hero-label`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgFadeDown {
      0% {
        opacity: 0;
        transform: translate3d(0, -20px, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .animate-mg-fade-down {
      animation: mgFadeDown 0.55s ease 0.12s both;
    }
  }
  ```

**6. mgFadeLeft (0.7s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-hero-left`, `.mg-rare-content`, `.mg-story-image`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgFadeLeft {
      0% {
        opacity: 0;
        transform: translate3d(-25px, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .animate-mg-fade-left {
      animation: mgFadeLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  }
  ```

**7. mgFadeRight (0.75s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-hero-right`, `.mg-rare-image`, `.mg-story-content`, `.mg-arrival-item`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgFadeRight {
      0% {
        opacity: 0;
        transform: translate3d(25px, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .animate-mg-fade-right {
      animation: mgFadeRight 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  }
  ```

**8. mgScaleIn (0.55s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-category-card`, `.mg-community-button`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgScaleIn {
      0% {
        opacity: 0;
        transform: scale(0.96);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-mg-scale-in {
      animation: mgScaleIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  }
  ```

**9. mgScaleSoft (0.7s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-rare-car`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgScaleSoft {
      0% {
        transform: scale(0.98);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-mg-scale-soft {
      animation: mgScaleSoft 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
    }
  }
  ```

**10. mgRevealLine (0.8s cubic-bezier(.22,1,.36,1))**
- Used on: `.mg-section-line`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgRevealLine {
      0% {
        transform: scaleX(0);
        transform-origin: left;
        opacity: 0;
      }
      100% {
        transform: scaleX(1);
        transform-origin: left;
        opacity: 1;
      }
    }
    .animate-mg-reveal-line {
      animation: mgRevealLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
    }
  }
  ```

**11. mgGlow (infinite)**
- Used on: `.mg-glow` (not in homePage.css directly, but defined)
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgGlow {
      0%, 100% { box-shadow: 0 0 0 rgba(255, 143, 0, 0); }
      50% { box-shadow: 0 0 25px rgba(255, 143, 0, 0.15); }
    }
  }
  ```

**12. mgShine (0.7s ease)**
- Used on: `.mg-button:hover::before`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgShine {
      0% { transform: translateX(-120%) skewX(-20deg); }
      100% { transform: translateX(120%) skewX(-20deg); }
    }
  }
  ```

**13. mgSoftPulse (4s or 5s ease-in-out infinite)**
- Used on: `.mg-rare-glow`, `.mg-community-title`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgSoftPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    .animate-mg-soft-pulse {
      animation: mgSoftPulse 4s ease-in-out infinite;
    }
  }
  ```

**14. mgRotateSlow (25s or 35s linear infinite)**
- Used on: `.mg-tech-ring`, `.mg-tech-ring-reverse`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgRotateSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-mg-rotate-slow {
      animation: mgRotateSlow 25s linear infinite;
      will-change: transform;
    }
    .animate-mg-rotate-slow-reverse {
      animation: mgRotateSlow 35s linear infinite reverse;
      will-change: transform;
    }
  }
  ```

**15. mgBounceArrow (0.6s ease infinite)**
- Used on: `.mg-slider-button:hover svg`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgBounceArrow {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(4px); }
    }
    .animate-mg-bounce-arrow {
      animation: mgBounceArrow 0.6s ease infinite;
    }
  }
  ```

**16. mgTextGlow (5s ease-in-out infinite, starts at 1.2s delay)**
- Used on: `.mg-hero-title`
- Implementation:
  ```css
  @layer utilities {
    @keyframes mgTextGlow {
      0%, 100% { text-shadow: 0 0 0 rgba(255, 143, 0, 0); }
      50% { text-shadow: 0 0 15px rgba(255, 143, 0, 0.22); }
    }
    .animate-mg-text-glow {
      animation: mgTextGlow 5s ease-in-out infinite;
    }
  }
  ```

---

## (b) UTILITY CLASSES MAPPING

### Typography Classes
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-display` | `font-display font-bold uppercase tracking-[.01em] leading-[1.02]` | Uses custom font-display from @theme |
| `.mg-mono` | `font-mono tracking-[.04em]` | Uses custom font-mono from @theme |

### Structural & Decorative Classes
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-bracket` | Custom @layer (pseudo-elements with ::before/::after) | Define in @layer with ::before/::after border styling |
| `.mg-ticks` | `bg-repeat-x` with inline style for gradient | Use inline `backgroundImage` style |
| `.mg-ticks-dark` | `bg-repeat-x` with inline style for gradient | Use inline `backgroundImage` style |

### Button Styling
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-button` | `relative overflow-hidden isolate` + pseudo-element ::before with gradient + inline hover effect | Replace with inline styles for ::before pseudo-element and hover effects |

### Animation Utility Classes (Animation Delays)
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-category-card:nth-child(1-6)` | Use inline `style={{animationDelay}}` | Apply as inline style on each element |
| `.mg-product-item:nth-child(1-4)` | Use inline `style={{animationDelay}}` | Apply as inline style on each element |
| `.mg-arrival-item:nth-child(1-4)` | Use inline `style={{animationDelay}}` | Apply as inline style on each element |
| `.mg-why-item:nth-child(1-4)` | Use inline `style={{animationDelay}}` | Apply as inline style on each element |

### RPM Gauge Styling
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-rpm-gauge` | `fixed right-[18px] top-1/2 w-[42px] h-[270px] flex flex-col items-center z-[500] -translate-y-1/2 pointer-events-none select-none` | Already has tailwind classes in JSX |
| `.mg-rpm-track` | `relative w-[3px] h-[230px] rounded-full bg-black/14 shadow-[0_0_0_1px_rgba(10,10,10,0.02),0_4px_12px_rgba(10,10,10,0.06)]` | Implement with Tailwind |
| `.mg-rpm-progress` | `absolute left-0 bottom-0 w-full rounded-full transition-[height_0.12s_linear]` | Use inline style for height |
| `.mg-rpm-marker` | `absolute left-1/2 w-[16px] h-[16px] rounded-full border-2 border-[#FF8F00] bg-[#0A0A0A] -translate-x-1/2 translate-y-1/2 shadow-[0_0_12px_rgba(255,143,0,0.25)]` | Use inline style for bottom position |
| `.mg-rpm-label` | `mt-[9px] font-mono text-[9px] leading-none tracking-[0.12em] text-black/55` | Implement with Tailwind |
| `.mg-rpm-value` | `mt-1 font-mono text-[8px] leading-none tracking-[0.05em] text-black/40` | Implement with Tailwind |
| `.mg-rpm-tick-*` | Use inline `style={{top}}` on span elements | Position via inline style |
| `.mg-rpm-redline` | `absolute left-[-5px] top-0 w-[13px] h-[14%] opacity-55 bg-striped-orange` | Define custom striped pattern or use inline style |

### Hover & Active States
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-category-card:hover` | `hover:translate-y-[-5px] hover:shadow-[0_14px_30px_rgba(10,10,10,0.14)]` | Apply to card link element |
| `.mg-category-label:hover` | `group-hover:translate-x-1` | Applied via group-hover |
| `.mg-slider-button:hover` | `hover:translate-y-[-2px]` + `hover:scale-94` on active | Use Tailwind hover: utilities |
| `.mg-story-image:hover` | `hover:translate-y-[-5px] hover:shadow-[0_20px_40px_rgba(10,10,10,0.13)]` | Apply to image wrapper |
| `.mg-why-item:hover` | `hover:translate-y-[-4px]` | Apply to item div |
| `.mg-why-icon:hover` | `group-hover:scale-[1.08] group-hover:rotate-[-4deg] group-hover:drop-shadow-[0_5px_8px_rgba(255,143,0,0.2)]` | Use Tailwind group-hover: utilities |

### Scrollbar Styling
| CSS Class | Tailwind Replacement | Notes |
|-----------|---------------------|-------|
| `.mg-scrollbar` | `overflow-x-auto scrollbar-hide` | Use Tailwind's scrollbar hiding or `overflow-x-auto ::-webkit-scrollbar { display: none; }` inline |

### Accessibility
| CSS Class | Media Query | Tailwind Replacement | Notes |
|-----------|-----------|---------------------|-------|
| `prefers-reduced-motion: reduce` | Global reduce-motion styles | `motion-reduce:animate-none` on animated elements | Apply `motion-reduce:` prefix to animation classes |

### Responsive Breakpoints
| CSS Class | Breakpoint | Tailwind Replacement | Notes |
|-----------|-----------|---------------------|-------|
| `.mg-rpm-gauge` at `max-width: 1279px` | `< 1280px` | `hidden xl:flex` | Already in JSX |
| Hover effects at `max-width: 768px` | `< 768px` | `md:hover:translate-y-[-3px]` | Reduce transform on smaller screens |
| `.mg-page-enter` at `max-width: 768px` | `< 768px` | `md:duration-400` | Adjust animation duration on mobile |

---

## (c) CLASSNAME CHANGES IN homePage.jsx

### Step 1: Add @layer directive to `src/index.css`
Replace the contents or append to `src/index.css` with all custom @layer animation definitions listed above in section (a).

### Step 2: Update homePage.jsx className attributes

**Line-by-line changes:**

| Element Description | Current className | New className | Notes |
|-----|-----|-----|-----|
| Main container | `className="min-h-screen w-full overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A] font-['Work_Sans',sans-serif]"` | No change | Already Tailwind-based |
| RPM Gauge | `className="mg-rpm-gauge hidden xl:flex"` | `className="fixed right-[18px] top-1/2 w-[42px] h-[270px] flex flex-col items-center z-[500] -translate-y-1/2 pointer-events-none select-none hidden xl:flex"` | Expand mg-rpm-gauge inline |
| RPM Track | `className="mg-rpm-track"` | `className="relative w-[3px] h-[230px] rounded-full bg-black/14 shadow-[0_0_0_1px_rgba(10,10,10,0.02),0_4px_12px_rgba(10,10,10,0.06)]"` | Define styles inline |
| RPM Progress | `className="mg-rpm-progress"` | `className="absolute left-0 bottom-0 w-full rounded-full will-change-[height] transition-[height_0.12s_linear]"` | Use inline style for height |
| RPM Marker | `className="mg-rpm-marker"` | `className="absolute left-1/2 w-[16px] h-[16px] rounded-full border-2 border-[#FF8F00] bg-[#0A0A0A] -translate-x-1/2 translate-y-1/2 shadow-[0_0_12px_rgba(255,143,0,0.25)]"` | Use inline style for bottom position |
| RPM Ticks | `className="mg-rpm-tick mg-rpm-tick-1"` (etc.) | `className="absolute right-[8px] w-[9px] h-px bg-black/22"` | Use inline style for top position |
| RPM Redline | `className="mg-rpm-redline"` | `className="absolute left-[-5px] top-0 w-[13px] h-[14%] opacity-55"` | Use inline style for gradient background |
| RPM Label | `className="mg-rpm-label"` | `className="mt-[9px] font-mono text-[9px] leading-none tracking-[0.12em] text-black/55 uppercase"` | Inline replacement |
| RPM Value | `className="mg-rpm-value"` | `className="mt-1 font-mono text-[8px] leading-none tracking-[0.05em] text-black/40"` | Inline replacement |
| Header | No change | No change | Already handled |
| Main content | `className="w-full mg-page-enter"` | `className="w-full animate-mg-fade-up motion-reduce:animate-none"` | Use custom animation class |
| Hero section | No change | No change | Already Tailwind-based |
| Orange dot | `className="mg-orange-dot h-[7px] w-[7px] rounded-full bg-[#FF8F00]"` | `className="h-[7px] w-[7px] rounded-full bg-[#FF8F00] animate-mg-pulse motion-reduce:animate-none"` | Add animation class |
| Hero label | `className="mg-hero-label mb-[22px] flex items-center gap-[10px]"` | `className="mb-[22px] flex items-center gap-[10px] animate-mg-fade-down motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.12s'}}` |
| Hero title | `className="mg-display mg-hero-title mb-[22px] text-[clamp(42px,5.2vw,74px)] text-[#F5F5DC]"` | `className="font-display font-bold uppercase tracking-[.01em] leading-[1.02] mb-[22px] text-[clamp(42px,5.2vw,74px)] text-[#F5F5DC]"` + animation | Add `style={{animation: 'mgFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.18s both, mgTextGlow 5s ease-in-out 1.2s infinite'}}` + `motion-reduce:` class |
| Hero description | `className="mg-hero-description mb-[38px] max-w-[440px] text-[17px] leading-[1.6] text-[#F5F5DC]/70"` | `className="mb-[38px] max-w-[440px] text-[17px] leading-[1.6] text-[#F5F5DC]/70 animate-mg-fade-up motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.28s'}}` |
| Hero buttons container | `className="mg-hero-buttons flex flex-wrap gap-4"` | `className="flex flex-wrap gap-4 animate-mg-fade-up motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.38s'}}` |
| Primary button | `className="mg-button inline-flex items-center gap-[10px] rounded-[2px] border border-transparent bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffa733] hover:shadow-[0_10px_24px_rgba(255,143,0,.25)]"` | Same (remove .mg-button) + add pseudo-element | Keep as is (button styles already inline) or add relative overflow-hidden with ::before shimmer on hover |
| Hero stats | `className="mg-hero-stats mt-[52px] flex gap-9 border-t border-[#F5F5DC]/15 pt-7"` | `className="mt-[52px] flex gap-9 border-t border-[#F5F5DC]/15 pt-7 animate-mg-fade-up motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.48s'}}` |
| Hero right | `className="mg-hero-right relative order-first flex items-center justify-center lg:order-none"` | `className="relative order-first flex items-center justify-center lg:order-none animate-mg-fade-right motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.08s'}}` |
| Hero left | `className="mg-hero-left"` | `className="animate-mg-fade-left motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.05s'}}` |
| Hero image | `className="mg-float h-[300px] w-[78%] max-w-[540px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.03] sm:h-[340px] lg:h-[390px]"` | `className="h-[300px] w-[78%] max-w-[540px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.03] sm:h-[340px] lg:h-[390px] animate-mg-float motion-reduce:animate-none"` | Add animation class |
| Categories section line | `className="mg-ticks mg-section-line h-2 flex-1"` | `className="h-2 flex-1 animate-mg-reveal-line motion-reduce:animate-none"` | Use inline style for ticks background + animation |
| Category section title | `className="mg-display mg-section-title mb-[14px] text-[clamp(30px,3.4vw,44px)]"` | `className="font-display font-bold uppercase tracking-[.01em] leading-[1.02] mb-[14px] text-[clamp(30px,3.4vw,44px)] animate-mg-fade-up motion-reduce:animate-none"` | Add animation |
| Category description | `className="mg-section-description text-[15.5px] leading-[1.6] text-black/60"` | `className="text-[15.5px] leading-[1.6] text-black/60 animate-mg-fade-up motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.1s'}}` |
| Category card | `className="mg-category-card group relative block h-[200px] overflow-hidden rounded-[6px] bg-[#0A0A0A] lg:h-auto"` | `className="group relative block h-[200px] overflow-hidden rounded-[6px] bg-[#0A0A0A] lg:h-auto animate-mg-scale-in motion-reduce:animate-none transition-all duration-[350ms] cubic-bezier(0.22,1,0.36,1) hover:translate-y-[-5px] md:hover:translate-y-[-3px] hover:shadow-[0_14px_30px_rgba(10,10,10,0.14)]"` | Add animation + hover effects + inline `style={{animationDelay}}` for each card |
| Product item | `className="mg-product-item"` | `className="animate-mg-fade-up motion-reduce:animate-none"` | Add animation + inline `style={{animationDelay}}` |
| Product wrapper | `className="mg-products-wrapper mb-[56px]"` | `className="mb-[56px] animate-mg-fade-up motion-reduce:animate-none"` | Add animation |
| Arrivals header | `className="mg-arrivals-header mb-[56px] flex flex-wrap items-end justify-between gap-6"` | `className="mb-[56px] flex flex-wrap items-end justify-between gap-6 animate-mg-fade-up motion-reduce:animate-none"` | Add animation |
| Arrival item | `className="mg-arrival-item min-w-[280px] snap-start"` | `className="min-w-[280px] snap-start animate-mg-fade-right motion-reduce:animate-none"` | Add animation + inline `style={{animationDelay}}` |
| Scrollbar container | `className="mg-scrollbar flex gap-[22px] overflow-x-auto pb-2"` | `className="flex gap-[22px] overflow-x-auto pb-2 scrollbar-hide"` | Add scrollbar-hide or custom style |
| Rare content | `className="mg-rare-content relative z-10 flex flex-col justify-center px-7 py-[60px] lg:px-[60px] lg:py-[90px]"` | `className="relative z-10 flex flex-col justify-center px-7 py-[60px] lg:px-[60px] lg:py-[90px] animate-mg-fade-left motion-reduce:animate-none"` | Add animation |
| Rare image section | `className="mg-rare-image relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[radial-gradient(...)]"` | `className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[radial-gradient(...)] animate-mg-fade-right motion-reduce:animate-none"` | Add animation |
| Tech ring | `className="mg-tech-ring absolute h-[420px] w-[420px] rounded-full border border-[#FF8F00]/15"` | `className="absolute h-[420px] w-[420px] rounded-full border border-[#FF8F00]/15 animate-mg-rotate-slow motion-reduce:animate-none"` | Add animation |
| Tech ring reverse | `className="mg-tech-ring-reverse absolute h-[340px] w-[340px] rounded-full border border-[#FF8F00]/30"` | `className="absolute h-[340px] w-[340px] rounded-full border border-[#FF8F00]/30 animate-mg-rotate-slow-reverse motion-reduce:animate-none"` | Add custom animation `animate-mg-rotate-slow-reverse` |
| Rare glow | `className="mg-rare-glow pointer-events-none absolute h-[55%] w-[55%] rounded-full bg-[#FF8F00]/10 blur-[70px]"` | `className="pointer-events-none absolute h-[55%] w-[55%] rounded-full bg-[#FF8F00]/10 blur-[70px] animate-mg-soft-pulse motion-reduce:animate-none"` | Add animation |
| Rare car image | `className="mg-rare-car relative z-10 w-[88%] max-w-[650px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.04]"` | `className="relative z-10 w-[88%] max-w-[650px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.04] animate-mg-scale-soft animate-mg-float motion-reduce:animate-none"` | Add both animations |
| Story image | `className="mg-story-image relative flex aspect-[4/3.3] items-center justify-center overflow-hidden rounded-[6px] bg-[#0A0A0A]"` | `className="relative flex aspect-[4/3.3] items-center justify-center overflow-hidden rounded-[6px] bg-[#0A0A0A] animate-mg-fade-left motion-reduce:animate-none transition-all duration-[450ms] cubic-bezier(0.22,1,0.36,1) hover:translate-y-[-5px] md:hover:translate-y-[-3px] hover:shadow-[0_20px_40px_rgba(10,10,10,0.13)]"` | Add animation + hover effects |
| Story float image | `className="mg-float relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,.55)] transition-transform duration-500 hover:scale-[1.03]"` | `className="relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,.55)] transition-transform duration-500 hover:scale-[1.03] animate-mg-float motion-reduce:animate-none"` | Add animation class |
| Story content | `className="mg-story-content"` | `className="animate-mg-fade-right motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.08s'}}` |
| Why item | `className="mg-why-item bg-[#F5F5DC] px-[30px] py-10"` | `className="bg-[#F5F5DC] px-[30px] py-10 animate-mg-fade-up motion-reduce:animate-none transition-all duration-300 cubic-bezier(0.22,1,0.36,1) hover:translate-y-[-4px]"` | Add animation + hover effect + inline `style={{animationDelay}}` |
| Why icon | `className="mg-why-icon mb-[22px] h-9 w-9 text-[#FF8F00]"` | `className="mb-[22px] h-9 w-9 text-[#FF8F00] transition-all duration-300 cubic-bezier(0.22,1,0.36,1) group-hover:scale-[1.08] group-hover:rotate-[-4deg] group-hover:drop-shadow-[0_5px_8px_rgba(255,143,0,0.2)]"` | Add hover effects (use group-hover on parent) |
| Community section | `className="relative overflow-hidden bg-[#0A0A0A] px-0 py-[100px] text-center text-[#F5F5DC] lg:py-[130px]"` | No change | Already complete |
| Community wrapper | `className="mg-community relative z-10 mx-auto max-w-[640px] px-5"` | `className="relative z-10 mx-auto max-w-[640px] px-5 animate-mg-fade-up motion-reduce:animate-none"` | Add animation |
| Community title | `className="mg-display mg-community-title mb-5 text-[clamp(30px,4vw,52px)]"` | `className="font-display font-bold uppercase tracking-[.01em] leading-[1.02] mb-5 text-[clamp(30px,4vw,52px)] animate-mg-soft-pulse motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '1s'}}` |
| Community text | `className="mg-community-text mb-[38px] text-[16px] leading-[1.6] text-[#F5F5DC]/70"` | `className="mb-[38px] text-[16px] leading-[1.6] text-[#F5F5DC]/70 animate-mg-fade-up motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.2s'}}` |
| Community button | `className="mg-button mg-community-button inline-flex items-center gap-[10px] rounded-[2px] bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all hover:-translate-y-0.5 hover:bg-[#ffa733]"` | `className="inline-flex items-center gap-[10px] rounded-[2px] bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all hover:-translate-y-0.5 hover:bg-[#ffa733] animate-mg-scale-in motion-reduce:animate-none"` | Add animation with inline delay `style={{animationDelay: '0.3s'}}` |
| Slider button | `className="mg-slider-button flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-all hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FF8F00]"` | `className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-all duration-200 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FF8F00] hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.94]"` | Add hover/active effects |
| Slider SVG on hover | In button (needs animation) | `className="hover:animate-mg-bounce-arrow motion-reduce:hover:animate-none"` | Add animation class to svg inside button |
| Bracket element (if used) | `.mg-bracket` with ::before/::after | Define custom @layer class | Not used directly in homePage.jsx; if needed, create @layer directive |

---

## (d) OPERATION ORDER

### Phase 1: Prepare @layer directives
1. **File:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/index.css`
   - Add all 16 @keyframes and @layer utilities from section (a) above
   - Append to existing content
   - Test that Tailwind compilation picks up the new custom animations

### Phase 2: Update homePage.jsx
2. **File:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/pages/homePage.jsx`
   - Replace all `.mg-*` class names with corresponding Tailwind utilities from section (c)
   - Remove `.mg-*` class references entirely
   - Add inline `style={{animationDelay}}` props on:
     - Each `.mg-category-card` (6 cards, delays 0.03s → 0.28s)
     - Each `.mg-product-item` (4 items, delays 0.03s → 0.18s)
     - Each `.mg-arrival-item` (4 items, delays 0.03s → 0.18s)
     - Each `.mg-why-item` (4 items, delays 0.03s → 0.18s)
   - Add `motion-reduce:animate-none` to all animated elements
   - Verify all className attributes are syntactically correct

### Phase 3: Remove CSS import and file
3. **File:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/pages/homePage.jsx`
   - Delete the line: `import './homePage.css';` (currently line 6)

4. **File:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/pages/homePage.css`
   - Delete the entire file

### Phase 4: Verification
5. **Build & Test:**
   - Run `npm run build` from workspace root
   - Verify no compilation errors
   - Test in browser:
     - Page loads without console errors
     - All animations play correctly
     - Hover effects work
     - Responsive breakpoints function
     - Reduced motion preference respected
   - Verify RPM gauge displays and updates on scroll
   - Verify all decorative elements animate smoothly

---

## Notes & Considerations

### Animation Delay Values (Used in homePage.jsx)
- Hero elements: 0.05s (left), 0.08s (right), 0.12s (label), 0.18s (title), 0.28s (desc), 0.38s (buttons), 0.48s (stats)
- Categories: 0.03s, 0.08s, 0.13s, 0.18s, 0.23s, 0.28s
- Products: 0.03s, 0.08s, 0.13s, 0.18s
- Arrivals: 0.03s, 0.08s, 0.13s, 0.18s
- Why Us: 0.03s, 0.08s, 0.13s, 0.18s
- Community: 0.1s (title, starts at 1s), 0.2s (text), 0.3s (button)

### Pseudo-Elements (::before, ::after)
- `.mg-button::before` (shimmer shine effect) - Can be defined in @layer or left as inline CSS via `className` with pseudo-element styling
- `.mg-bracket::before` and `::after` - Define in @layer if needed; currently not used in main homePage

### Custom Tailwind Animations Already in Package
Project uses `@tailwindcss/vite` and Tailwind 4.3.3 — these support custom theme extensions via @layer.

### Fallback for Inline Styles
For complex animations requiring multiple keyframes or timing functions not directly supported by Tailwind utility classes, use inline `style={{}}` attributes in JSX combined with @layer definitions in index.css.

---

## Files to Modify

1. **Primary:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/index.css`
   - Add all @layer @keyframes definitions

2. **Primary:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/pages/homePage.jsx`
   - Replace all className references
   - Add inline `style={{animationDelay}}` props
   - Remove `import './homePage.css';`

3. **Delete:** `d:/Campus/2nd Year/1st Semester/ICT2142 E commerce/Metal Garage/metal garage website/metal-garage-frontend/src/pages/homePage.css`

---

## Verification Commands

```bash
# From workspace root
npm run build

# Expected: Build completes without errors
# Expected: bundle includes new animation classes from src/index.css
# Expected: homePage.jsx compiles without import errors
```

Browser verification:
- Open page in developer tools
- Inspect animated elements
- Confirm `animate-mg-*` classes are applied
- Test hover states
- Verify motion-reduce media query respected
- Check console for no errors
