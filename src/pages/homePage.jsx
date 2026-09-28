import Header from "../components/header";
import Footer from "../components/footer";
import ProdcutCard from "../components/productCard";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  // =========================================================
  // PAGE / SCROLL STATE
  // =========================================================

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRafRef = useRef(null);

  // =========================================================
  // SCROLL TO TOP + RESPONSIVE RPM GAUGE
  // =========================================================

  useEffect(() => {
    // Always start HomePage from the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    const updateScrollProgress = () => {
      if (scrollRafRef.current !== null) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        const scrollTop =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;

        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        const scrollableHeight = Math.max(
          documentHeight - windowHeight,
          1
        );

        const progress = Math.min(
          Math.max(scrollTop / scrollableHeight, 0),
          1
        );

        setScrollProgress(progress);

        scrollRafRef.current = null;
      });
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);

      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/products"
        );

        if (!mounted) return;

        const productData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : [];

        setProducts(productData);

        // Trending products
        const shuffledTrending = [...productData].sort(
          () => Math.random() - 0.5
        );

        setTrendingProducts(shuffledTrending.slice(0, 4));

        // New arrivals
        const shuffledArrivals = [...productData].sort(
          () => Math.random() - 0.5
        );

        setNewArrivalProducts(shuffledArrivals.slice(0, 4));
      } catch (error) {
        if (!mounted) return;

        console.error("Failed to fetch products:", error);

        setProducts([]);
        setTrendingProducts([]);
        setNewArrivalProducts([]);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // RPM GAUGE
  // =========================================================

  /*
    Scroll 0%   -> RPM 0
    Scroll 25%  -> RPM 2250
    Scroll 50%  -> RPM 4500
    Scroll 75%  -> RPM 6750
    Scroll 100% -> RPM 9000
  */

  const rpmHeight = `${Math.max(scrollProgress * 100, 2)}%`;

  const rpmMarkerBottom = `${Math.min(
    Math.max(scrollProgress * 100, 2),
    98
  )}%`;

  const rpmValue = Math.round(scrollProgress * 9000);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F5DC] text-[#0A0A0A] font-['Work_Sans',sans-serif]">
      {/* =====================================================
          GOOGLE FONTS + ANIMATIONS
      ====================================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
        }

        ::selection {
          background: #FF8F00;
          color: #0A0A0A;
        }

        /* =====================================================
           TYPOGRAPHY
        ====================================================== */

        .mg-display {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: .01em;
          font-weight: 700;
          line-height: 1.02;
        }

        .mg-mono {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: .04em;
        }

        /* =====================================================
           BRACKET
        ====================================================== */

        .mg-bracket {
          position: relative;
        }

        .mg-bracket::before,
        .mg-bracket::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          opacity: .55;
          border-color: currentColor;
          pointer-events: none;
          z-index: 5;
        }

        .mg-bracket::before {
          top: 10px;
          left: 10px;
          border-top: 2px solid;
          border-left: 2px solid;
        }

        .mg-bracket::after {
          bottom: 10px;
          right: 10px;
          border-bottom: 2px solid;
          border-right: 2px solid;
        }

        /* =====================================================
           TICKS
        ====================================================== */

        .mg-ticks {
          background: repeating-linear-gradient(
            90deg,
            rgba(10,10,10,.14) 0 1px,
            transparent 1px 10px
          );
        }

        .mg-ticks-dark {
          background: repeating-linear-gradient(
            90deg,
            rgba(245,245,220,.14) 0 1px,
            transparent 1px 10px
          );
        }

        /* =====================================================
           BASIC ANIMATIONS
        ====================================================== */

        @keyframes mgFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -7px, 0);
          }
        }

        @keyframes mgPulse {
          0%, 100% {
            opacity: .65;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes mgSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           PAGE LOAD ANIMATIONS
        ====================================================== */

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

        @keyframes mgScaleIn {
          0% {
            opacity: 0;
            transform: scale(.96);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes mgScaleSoft {
          0% {
            transform: scale(.98);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

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

        @keyframes mgGlow {
          0%, 100% {
            box-shadow: 0 0 0 rgba(255,143,0,0);
          }

          50% {
            box-shadow: 0 0 25px rgba(255,143,0,.15);
          }
        }

        @keyframes mgShine {
          0% {
            transform: translateX(-120%) skewX(-20deg);
          }

          100% {
            transform: translateX(120%) skewX(-20deg);
          }
        }

        @keyframes mgSoftPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.02);
          }
        }

        @keyframes mgRotateSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes mgBounceArrow {
          0%, 100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(4px);
          }
        }

        @keyframes mgTextGlow {
          0%, 100% {
            text-shadow: 0 0 0 rgba(255,143,0,0);
          }

          50% {
            text-shadow: 0 0 15px rgba(255,143,0,.22);
          }
        }

        /* =====================================================
           CONTINUOUS ANIMATIONS
        ====================================================== */

        .mg-float {
          animation: mgFloat 4s ease-in-out infinite;
          will-change: transform;
        }

        .mg-pulse {
          animation: mgPulse 2s ease-in-out infinite;
        }

        .mg-spin {
          animation: mgSpin 18s linear infinite;
        }

        /* =====================================================
           PAGE ENTRANCE
        ====================================================== */

        .mg-page-enter {
          animation: mgFadeUp .55s cubic-bezier(.22,1,.36,1) both;
          will-change: opacity, transform;
        }

        .mg-hero-left {
          animation: mgFadeLeft .7s cubic-bezier(.22,1,.36,1) .05s both;
        }

        .mg-hero-right {
          animation: mgFadeRight .75s cubic-bezier(.22,1,.36,1) .08s both;
        }

        .mg-hero-label {
          animation: mgFadeDown .55s ease .12s both;
        }

        .mg-hero-title {
          animation:
            mgFadeUp .65s cubic-bezier(.22,1,.36,1) .18s both,
            mgTextGlow 5s ease-in-out 1.2s infinite;
        }

        .mg-hero-description {
          animation: mgFadeUp .65s cubic-bezier(.22,1,.36,1) .28s both;
        }

        .mg-hero-buttons {
          animation: mgFadeUp .65s cubic-bezier(.22,1,.36,1) .38s both;
        }

        .mg-hero-stats {
          animation: mgFadeUp .65s cubic-bezier(.22,1,.36,1) .48s both;
        }

        /* =====================================================
           BUTTONS
        ====================================================== */

        .mg-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transform: translateZ(0);
        }

        .mg-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.25),
            transparent
          );
          transform: skewX(-20deg);
          pointer-events: none;
        }

        .mg-button:hover::before {
          animation: mgShine .7s ease;
        }

        .mg-button:active {
          transform: translateY(1px) scale(.98);
        }

        /* =====================================================
           SECTION ANIMATIONS
        ====================================================== */

        .mg-section-title {
          animation: mgFadeUp .7s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-section-description {
          animation: mgFadeUp .7s cubic-bezier(.22,1,.36,1) .1s both;
        }

        .mg-section-line {
          animation: mgRevealLine .8s cubic-bezier(.22,1,.36,1) .05s both;
        }

        /* =====================================================
           CATEGORY CARDS
        ====================================================== */

        .mg-category-card {
          animation: mgScaleIn .55s cubic-bezier(.22,1,.36,1) both;
          transition:
            transform .35s cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease;
          will-change: transform;
        }

        .mg-category-card:nth-child(1) {
          animation-delay: .03s;
        }

        .mg-category-card:nth-child(2) {
          animation-delay: .08s;
        }

        .mg-category-card:nth-child(3) {
          animation-delay: .13s;
        }

        .mg-category-card:nth-child(4) {
          animation-delay: .18s;
        }

        .mg-category-card:nth-child(5) {
          animation-delay: .23s;
        }

        .mg-category-card:nth-child(6) {
          animation-delay: .28s;
        }

        .mg-category-card:hover {
          transform: translate3d(0, -5px, 0);
          box-shadow: 0 14px 30px rgba(10,10,10,.14);
        }

        .mg-category-card:hover .mg-category-label {
          transform: translateX(4px);
        }

        .mg-category-label {
          transition: transform .25s ease;
        }

        /* =====================================================
           PRODUCT SECTION
        ====================================================== */

        .mg-products-wrapper {
          animation: mgFadeUp .7s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-product-item {
          animation: mgFadeUp .6s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-product-item:nth-child(1) {
          animation-delay: .03s;
        }

        .mg-product-item:nth-child(2) {
          animation-delay: .08s;
        }

        .mg-product-item:nth-child(3) {
          animation-delay: .13s;
        }

        .mg-product-item:nth-child(4) {
          animation-delay: .18s;
        }

        /* =====================================================
           RARE FINDS
        ====================================================== */

        .mg-rare-content {
          animation: mgFadeLeft .7s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-rare-image {
          animation: mgFadeRight .7s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-rare-car {
          animation:
            mgScaleSoft .7s cubic-bezier(.22,1,.36,1) .12s both,
            mgFloat 4s ease-in-out .8s infinite;
        }

        .mg-rare-glow {
          animation: mgSoftPulse 4s ease-in-out infinite;
        }

        /* =====================================================
           NEW ARRIVALS
        ====================================================== */

        .mg-arrivals-header {
          animation: mgFadeUp .7s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-arrival-item {
          animation: mgFadeRight .6s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-arrival-item:nth-child(1) {
          animation-delay: .03s;
        }

        .mg-arrival-item:nth-child(2) {
          animation-delay: .08s;
        }

        .mg-arrival-item:nth-child(3) {
          animation-delay: .13s;
        }

        .mg-arrival-item:nth-child(4) {
          animation-delay: .18s;
        }

        /* =====================================================
           SLIDER BUTTONS
        ====================================================== */

        .mg-slider-button {
          transition:
            transform .2s ease,
            background-color .2s ease,
            border-color .2s ease,
            color .2s ease;
        }

        .mg-slider-button:hover {
          transform: translateY(-2px);
        }

        .mg-slider-button:active {
          transform: translateY(0) scale(.94);
        }

        .mg-slider-button:hover svg {
          animation: mgBounceArrow .6s ease infinite;
        }

        /* =====================================================
           STORY SECTION
        ====================================================== */

        .mg-story-image {
          animation: mgFadeLeft .7s cubic-bezier(.22,1,.36,1) both;
          transition:
            transform .45s cubic-bezier(.22,1,.36,1),
            box-shadow .45s ease;
        }

        .mg-story-image:hover {
          transform: translate3d(0, -5px, 0);
          box-shadow: 0 20px 40px rgba(10,10,10,.13);
        }

        .mg-story-content {
          animation: mgFadeRight .7s cubic-bezier(.22,1,.36,1) .08s both;
        }

        /* =====================================================
           WHY US
        ====================================================== */

        .mg-why-item {
          animation: mgFadeUp .6s cubic-bezier(.22,1,.36,1) both;
          transition:
            transform .3s cubic-bezier(.22,1,.36,1),
            background-color .25s ease;
        }

        .mg-why-item:nth-child(1) {
          animation-delay: .03s;
        }

        .mg-why-item:nth-child(2) {
          animation-delay: .08s;
        }

        .mg-why-item:nth-child(3) {
          animation-delay: .13s;
        }

        .mg-why-item:nth-child(4) {
          animation-delay: .18s;
        }

        .mg-why-item:hover {
          transform: translate3d(0, -4px, 0);
        }

        .mg-why-icon {
          transition:
            transform .3s cubic-bezier(.22,1,.36,1),
            filter .3s ease;
        }

        .mg-why-item:hover .mg-why-icon {
          transform: scale(1.08) rotate(-4deg);
          filter: drop-shadow(0 5px 8px rgba(255,143,0,.2));
        }

        /* =====================================================
           COMMUNITY
        ====================================================== */

        .mg-community {
          animation: mgFadeUp .75s cubic-bezier(.22,1,.36,1) both;
        }

        .mg-community-title {
          animation:
            mgFadeUp .7s cubic-bezier(.22,1,.36,1) .1s both,
            mgSoftPulse 5s ease-in-out 1s infinite;
        }

        .mg-community-text {
          animation: mgFadeUp .7s cubic-bezier(.22,1,.36,1) .2s both;
        }

        .mg-community-button {
          animation: mgScaleIn .6s cubic-bezier(.22,1,.36,1) .3s both;
        }

        /* =====================================================
           DECORATIVE ANIMATIONS
        ====================================================== */

        .mg-orange-dot {
          animation: mgPulse 2s ease-in-out infinite;
        }

        .mg-tech-ring {
          animation: mgRotateSlow 25s linear infinite;
          will-change: transform;
        }

        .mg-tech-ring-reverse {
          animation: mgRotateSlow 35s linear infinite reverse;
          will-change: transform;
        }

        /* =====================================================
           HORIZONTAL SCROLLBAR
        ====================================================== */

        .mg-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .mg-scrollbar {
          scrollbar-width: none;
        }

        /* =====================================================
           RPM GAUGE
        ====================================================== */

        /*
          Important:
          The gauge itself is fixed to the viewport.
          It does NOT move with page content.

          right: 18px
          top: 50%
          transform: translateY(-50%)

          This keeps it perfectly centered on the right side
          regardless of the page height.
        */

        .mg-rpm-gauge {
          position: fixed;
          right: 18px;
          top: 50%;
          width: 42px;
          height: 270px;

          display: flex;
          flex-direction: column;
          align-items: center;

          z-index: 500;

          transform: translate3d(0, -50%, 0);

          contain: layout paint;

          pointer-events: none;

          user-select: none;
        }

        .mg-rpm-track {
          position: relative;

          width: 3px;
          height: 230px;

          border-radius: 999px;

          background: rgba(10,10,10,.14);

          box-shadow:
            0 0 0 1px rgba(10,10,10,.02),
            0 4px 12px rgba(10,10,10,.06);
        }

        .mg-rpm-progress {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 100%;

          border-radius: 999px;

          will-change: height;

          transform: translateZ(0);

          transition:
            height .12s linear;

          box-shadow:
            0 0 10px rgba(255,143,0,.25);
        }

        .mg-rpm-marker {
          position: absolute;

          left: 50%;

          width: 16px;
          height: 16px;

          border-radius: 999px;

          border: 2px solid #FF8F00;

          background: #0A0A0A;

          will-change: bottom;

          transform:
            translate3d(-50%, 50%, 0);

          transition:
            bottom .12s linear;

          box-shadow:
            0 0 12px rgba(255,143,0,.25);
        }

        .mg-rpm-number {
          transition: opacity .15s ease;
        }

        .mg-rpm-label {
          margin-top: 9px;

          font-family: 'JetBrains Mono', monospace;

          font-size: 9px;

          line-height: 1;

          letter-spacing: .12em;

          color: rgba(10,10,10,.55);
        }

        .mg-rpm-value {
          margin-top: 4px;

          font-family: 'JetBrains Mono', monospace;

          font-size: 8px;

          line-height: 1;

          letter-spacing: .05em;

          color: rgba(10,10,10,.4);
        }

        /* RPM scale marks */

        .mg-rpm-tick {
          position: absolute;

          right: 8px;

          width: 9px;

          height: 1px;

          background: rgba(10,10,10,.22);
        }

        .mg-rpm-tick-1 {
          top: 10%;
        }

        .mg-rpm-tick-2 {
          top: 30%;
        }

        .mg-rpm-tick-3 {
          top: 50%;
        }

        .mg-rpm-tick-4 {
          top: 70%;
        }

        .mg-rpm-tick-5 {
          top: 90%;
        }

        /* Redline area */

        .mg-rpm-redline {
          position: absolute;

          left: -5px;
          top: 0;

          width: 13px;
          height: 14%;

          opacity: .55;

          background:
            repeating-linear-gradient(
              45deg,
              #FF3B00 0 3px,
              transparent 3px 6px
            );
        }

        /* =====================================================
           ACCESSIBILITY
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }

          .mg-float,
          .mg-tech-ring,
          .mg-tech-ring-reverse {
            animation: none !important;
          }

          .mg-rpm-progress,
          .mg-rpm-marker {
            transition: none !important;
          }
        }

        /* =====================================================
           MOBILE / TABLET
        ====================================================== */

        @media (max-width: 1279px) {
          .mg-rpm-gauge {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .mg-category-card:hover {
            transform: translate3d(0, -3px, 0);
          }

          .mg-why-item:hover {
            transform: translate3d(0, -3px, 0);
          }

          .mg-story-image:hover {
            transform: translate3d(0, -3px, 0);
          }

          .mg-page-enter {
            animation-duration: .4s;
          }
        }
      `}</style>

      {/* =====================================================
          HIDDEN SVG CAR LIBRARY
      ====================================================== */}

      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
      >
        <defs>
          <g id="car-a">
            <path
              d="M30 130 C34 100 55 92 80 90 L120 60 C132 50 150 44 172 44 L250 44 C268 44 282 52 292 66 L316 92 C336 94 356 100 366 122 L366 138 L338 138 C338 122 326 110 310 110 C294 110 282 122 282 138 L150 138 C150 122 138 110 122 110 C106 110 94 122 94 138 L30 138 Z"
              fill="#0A0A0A"
              stroke="#0A0A0A"
              strokeWidth="2"
            />

            <path
              d="M132 62 L168 48 L246 48 L286 68 L296 90 L136 90 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <circle cx="122" cy="138" r="28" fill="#0A0A0A" />
            <circle cx="122" cy="138" r="12" fill="#FF8F00" />

            <circle cx="310" cy="138" r="28" fill="#0A0A0A" />
            <circle cx="310" cy="138" r="12" fill="#FF8F00" />
          </g>

          <g id="car-b">
            <path
              d="M26 132 L40 96 C46 82 60 74 76 74 L110 74 L134 50 C142 42 154 38 166 38 L228 38 C240 38 250 44 256 54 L268 74 L300 74 C324 74 344 90 350 112 L364 118 L364 138 L330 138 C330 122 318 110 302 110 C286 110 274 122 274 138 L128 138 C128 122 116 110 100 110 C84 110 72 122 72 138 L26 138 Z"
              fill="#0A0A0A"
            />

            <path
              d="M118 78 L146 54 L222 54 L246 78 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <circle cx="100" cy="138" r="28" fill="#0A0A0A" />
            <circle cx="100" cy="138" r="12" fill="#FF8F00" />

            <circle cx="302" cy="138" r="28" fill="#0A0A0A" />
            <circle cx="302" cy="138" r="12" fill="#FF8F00" />

            <rect
              x="20"
              y="100"
              width="14"
              height="6"
              fill="#FF8F00"
            />
          </g>

          <g id="car-c">
            <path
              d="M24 128 C30 96 52 84 82 82 L104 58 C114 46 132 38 152 38 L246 38 C264 38 278 46 288 60 L306 84 C334 86 358 98 364 122 L364 136 L332 136 C332 120 320 108 304 108 C288 108 276 120 276 136 L140 136 C140 120 128 108 112 108 C96 108 84 120 84 136 L24 136 Z"
              fill="#0A0A0A"
            />

            <path
              d="M116 60 L150 42 L242 42 L282 62 L292 82 L120 82 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <path
              d="M154 46 L196 44 L196 78 L136 78 Z"
              fill="#FF8F00"
              opacity=".8"
            />

            <circle cx="112" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="112" cy="136" r="12" fill="#FF8F00" />

            <circle cx="304" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="304" cy="136" r="12" fill="#FF8F00" />
          </g>

          <g id="car-d">
            <path
              d="M20 130 L34 92 C40 78 54 70 70 70 L118 70 L146 46 C154 40 164 36 174 36 L232 36 C244 36 254 42 260 52 L276 70 L316 70 C338 70 356 84 362 106 L368 116 L368 136 L336 136 C336 120 324 108 308 108 C292 108 280 120 280 136 L120 136 C120 120 108 108 92 108 C76 108 64 120 64 136 L20 136 Z"
              fill="#0A0A0A"
            />

            <path
              d="M124 74 L152 50 L228 50 L254 74 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <rect
              x="60"
              y="46"
              width="10"
              height="60"
              fill="#FF8F00"
              opacity=".85"
            />

            <circle cx="92" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="92" cy="136" r="12" fill="#FF8F00" />

            <circle cx="308" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="308" cy="136" r="12" fill="#FF8F00" />
          </g>

          <g id="car-e">
            <path
              d="M18 132 C22 108 36 96 58 92 L96 56 C108 44 126 36 148 36 L252 36 C270 36 284 44 292 58 L310 90 C338 92 358 102 366 124 L366 138 L342 138 C342 122 330 110 314 110 C298 110 286 122 286 138 L108 138 C108 122 96 110 80 110 C64 110 52 122 52 138 L18 138 Z"
              fill="#0A0A0A"
            />

            <path
              d="M108 58 L150 40 L244 40 L280 60 L288 90 L100 90 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <circle cx="80" cy="138" r="30" fill="#0A0A0A" />
            <circle cx="80" cy="138" r="13" fill="#FF8F00" />

            <circle cx="314" cy="138" r="30" fill="#0A0A0A" />
            <circle cx="314" cy="138" r="13" fill="#FF8F00" />

            <rect
              x="330"
              y="120"
              width="20"
              height="5"
              fill="#FF8F00"
            />
          </g>

          <g id="car-f">
            <path
              d="M22 128 L32 90 C38 74 54 64 72 64 L108 64 L146 40 C158 34 172 30 186 30 L236 30 C248 30 258 36 264 46 L280 70 L312 70 C336 70 356 84 362 108 L368 116 L368 136 L334 136 C334 120 322 108 306 108 C290 108 278 120 278 136 L114 136 C114 120 102 108 86 108 C70 108 58 120 58 136 L22 136 Z"
              fill="#0A0A0A"
            />

            <path
              d="M120 68 L158 44 L232 44 L268 70 Z"
              fill="#F5F5DC"
              opacity=".9"
            />

            <circle cx="86" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="86" cy="136" r="12" fill="#FF8F00" />

            <circle cx="306" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="306" cy="136" r="12" fill="#FF8F00" />

            <path
              d="M64 66 L108 66"
              stroke="#FF8F00"
              strokeWidth="3"
            />
          </g>

          <g id="car-f-lg">
            <path
              d="M22 128 L32 90 C38 74 54 64 72 64 L108 64 L146 40 C158 34 172 30 186 30 L236 30 C248 30 258 36 264 46 L280 70 L312 70 C336 70 356 84 362 108 L368 116 L368 136 L334 136 C334 120 322 108 306 108 C290 108 278 120 278 136 L114 136 C114 120 102 108 86 108 C70 108 58 120 58 136 L22 136 Z"
              fill="#F5F5DC"
              stroke="#FF8F00"
              strokeWidth="1.5"
            />

            <path
              d="M120 68 L158 44 L232 44 L268 70 Z"
              fill="#0A0A0A"
            />

            <circle cx="86" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="86" cy="136" r="12" fill="#FF8F00" />

            <circle cx="306" cy="136" r="28" fill="#0A0A0A" />
            <circle cx="306" cy="136" r="12" fill="#FF8F00" />

            <path
              d="M64 66 L108 66"
              stroke="#FF8F00"
              strokeWidth="3"
            />
          </g>
        </defs>
      </svg>

      {/* =====================================================
          RPM GAUGE
          FIXED CENTER-RIGHT POSITION
      ====================================================== */}

      <div
        aria-hidden="true"
        className="mg-rpm-gauge hidden xl:flex"
      >
        <div className="mg-rpm-track">

          {/* Redline */}
          <div className="mg-rpm-redline" />

          {/* Scale ticks */}
          <span className="mg-rpm-tick mg-rpm-tick-1" />
          <span className="mg-rpm-tick mg-rpm-tick-2" />
          <span className="mg-rpm-tick mg-rpm-tick-3" />
          <span className="mg-rpm-tick mg-rpm-tick-4" />
          <span className="mg-rpm-tick mg-rpm-tick-5" />

          {/* Scroll progress */}
          <div
            className="mg-rpm-progress"
            style={{
              height: rpmHeight,
              background:
                "linear-gradient(to top, #FF8F00, #FF8F00, #FF3B00)",
            }}
          />

          {/* Current scroll position */}
          <div
            className="mg-rpm-marker"
            style={{
              bottom: rpmMarkerBottom,
            }}
          />

          {/* Top marker */}
          <div
            className="absolute left-1/2 top-0 h-[4px] w-[10px] -translate-x-1/2 rounded-full bg-[#FF3B00]"
          />
        </div>

        <div className="mg-rpm-label">
          RPM
        </div>

        <div className="mg-rpm-value">
          {rpmValue}
        </div>
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="w-full mg-page-enter">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#0A0A0A] px-0 pb-[90px] pt-[120px] text-[#F5F5DC]">

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_40%,rgba(255,143,0,.10),transparent_55%),repeating-linear-gradient(115deg,rgba(245,245,220,.025)_0_1px,transparent_1px_64px)]" />

          <div className="pointer-events-none absolute right-[-6%] top-0 h-full w-[46%] bg-[linear-gradient(100deg,transparent_46%,rgba(255,143,0,.09)_47%,rgba(255,143,0,.09)_49%,transparent_50%,transparent_60%,rgba(255,143,0,.05)_61%,rgba(255,143,0,.05)_62%,transparent_63%)]" />

          <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 min-[981px]:px-10">

            <div className="mg-hero-left">

              <div className="mg-hero-label mb-[22px] flex items-center gap-[10px]">

                <span className="mg-orange-dot h-[7px] w-[7px] rounded-full bg-[#FF8F00]" />

                <span className="mg-mono text-[12px] tracking-[.22em] text-[#FF8F00]">
                  PREMIUM DIE-CAST · EST. GARAGE 01
                </span>

              </div>

              <h1 className="mg-display mg-hero-title mb-[22px] text-[clamp(42px,5.2vw,74px)] text-[#F5F5DC]">
                Build your
                <br />

                <span className="text-[#FF8F00]">
                  collection.
                </span>
              </h1>

              <p className="mg-hero-description mb-[38px] max-w-[440px] text-[17px] leading-[1.6] text-[#F5F5DC]/70">
                Discover legendary die-cast cars, rare releases, and collector
                favorites — all in one garage.
              </p>

              <div className="mg-hero-buttons flex flex-wrap gap-4">

                <a
                  href="#shop"
                  className="mg-button inline-flex items-center gap-[10px] rounded-[2px] border border-transparent bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffa733] hover:shadow-[0_10px_24px_rgba(255,143,0,.25)]"
                >
                  Shop Collection
                </a>

                <a
                  href="#rare"
                  className="mg-button inline-flex items-center gap-[10px] rounded-[2px] border border-[#F5F5DC]/15 px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#F5F5DC] transition-all duration-200 hover:border-[#FF8F00] hover:text-[#FF8F00]"
                >
                  Explore Rare Finds
                </a>

              </div>

              <div className="mg-hero-stats mt-[52px] flex gap-9 border-t border-[#F5F5DC]/15 pt-7">

                <div>
                  <div className="mg-mono text-[26px] text-[#F5F5DC]">
                    4,200+
                  </div>

                  <div className="mt-[2px] text-[11px] uppercase tracking-[.1em] text-[#F5F5DC]/50">
                    Models Catalogued
                  </div>
                </div>

                <div>
                  <div className="mg-mono text-[26px] text-[#F5F5DC]">
                    1:64
                  </div>

                  <div className="mt-[2px] text-[11px] uppercase tracking-[.1em] text-[#F5F5DC]/50">
                    Precision Scale
                  </div>
                </div>

                <div>
                  <div className="mg-mono text-[26px] text-[#F5F5DC]">
                    180+
                  </div>

                  <div className="mt-[2px] text-[11px] uppercase tracking-[.1em] text-[#F5F5DC]/50">
                    Rare Castings
                  </div>
                </div>

              </div>

            </div>

            <div className="mg-hero-right relative order-first flex items-center justify-center lg:order-none">

              <div className="absolute h-[112%] w-[112%] rounded-[6px] border border-[#F5F5DC]/15">

                <div className="absolute inset-[14px] rounded border border-dashed border-[#F5F5DC]/10" />

              </div>

              <div className="pointer-events-none absolute h-[75%] w-[75%] rounded-full bg-[#FF8F00]/10 blur-[80px] mg-rare-glow" />

              <span className="mg-mono absolute left-[-2%] top-[16%] z-20 flex items-center gap-1.5 text-[10px] tracking-[.1em] text-[#FF8F00]">

                <span className="h-px w-4 bg-[#FF8F00]" />

                SCALE 1:18 — ALLOY BODY

              </span>

              <span className="mg-mono absolute bottom-[20%] right-[-4%] z-20 flex items-center gap-1.5 text-[10px] tracking-[.1em] text-[#FF8F00]">

                <span className="h-px w-4 bg-[#FF8F00]" />

                LTD. RUN — SERIAL 0042

              </span>

              <div className="relative z-10 flex w-full items-center justify-center">

                <img
                  src="/hero.png"
                  alt="Hot Wheels collectible car"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="mg-float h-[300px] w-[78%] max-w-[540px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.03] sm:h-[340px] lg:h-[390px]"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORIES
        ====================================================== */}

        <section
          id="collections"
          className="px-0 py-[70px] lg:py-[110px]"
        >

          <div className="mx-auto max-w-[1320px] px-5 lg:px-10">

            <div className="mb-[18px] flex items-center gap-[6px]">

              <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                01 — CATEGORIES
              </span>

              <div className="mg-ticks mg-section-line h-2 flex-1" />

            </div>

            <div className="mb-14 max-w-[640px]">

              <h2 className="mg-display mg-section-title mb-[14px] text-[clamp(30px,3.4vw,44px)]">
                Explore the garage
              </h2>

              <p className="mg-section-description text-[15.5px] leading-[1.6] text-black/60">
                Six curated corners of the collection, from pocket-sized JDM
                icons to full-throttle supercars.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-[14px] lg:grid-cols-6 lg:grid-rows-[220px_220px]">

              {[
                ["FLAGSHIP LINE", "Hot Wheels", "car-a", "/home1.png"],
                ["DIE-CAST ALLOY", "Premium", "car-b", "/home2.png"],
                ["TOKYO GARAGE", "JDM Legends", "car-c", "/home3.png"],
                ["AMERICANA", "Muscle Cars", "car-d"],
                ["TOP TIER", "Supercars", "car-e"],
                ["SERIAL NUMBERED", "Rare Finds", "car-f"],
              ].map(([label, title, car, image], index) => (

                <a
                  key={title}
                  href={index < 3 ? "/products" : "#"}
                  className={[
                    "mg-category-card group relative block h-[200px] overflow-hidden rounded-[6px] bg-[#0A0A0A] lg:h-auto",
                    index === 0
                      ? "lg:col-span-3 lg:row-span-2"
                      : index === 1 || index === 2
                      ? "lg:col-span-3"
                      : "lg:col-span-2",
                  ].join(" ")}
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-[1.06]"
                    style={
                      image
                        ? {
                            backgroundImage: `linear-gradient(rgba(10,10,10,.20), rgba(10,10,10,.72)), url(${image})`,
                          }
                        : undefined
                    }
                  />

                  {!image && (
                    <div className="absolute bottom-[6px] right-[10px] w-[56%] text-[#F5F5DC] opacity-[.16]">

                      <svg
                        viewBox="0 0 400 180"
                        className="w-full"
                      >
                        <use href={`#${car}`} />
                      </svg>

                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-[22px] right-[22px] text-[#F5F5DC]">

                    <span className="mg-category-label mg-mono mb-1.5 block text-[10.5px] text-[#FF8F00]">
                      {label}
                    </span>

                    <h3 className="mg-display mb-2.5 text-[22px]">
                      {title}
                    </h3>

                    <span className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[.08em] text-[#F5F5DC]/70 transition-all duration-200 group-hover:gap-2.5 group-hover:text-[#FF8F00]">
                      Explore →
                    </span>

                  </div>

                </a>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            PRODUCTS / TRENDING
        ====================================================== */}

        <section
          id="shop"
          className="bg-[#ECE8D6] px-0 py-[70px] lg:py-[110px]"
        >

          <div className="mx-auto max-w-[1320px] px-5 lg:px-10">

            <div className="mg-products-wrapper mb-[56px]">

              <div className="mb-[18px] flex items-center gap-[6px]">

                <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                  02 — TRENDING
                </span>

                <div className="mg-ticks mg-section-line h-2 flex-1" />

              </div>

              <div className="max-w-[640px]">

                <h2 className="mg-display mg-section-title mb-[14px] text-[clamp(30px,3.4vw,44px)]">
                  Hot in the garage
                </h2>

                <p className="mg-section-description text-[15.5px] leading-[1.6] text-black/60">
                  The four models collectors keep coming back for, this week.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-[14px] lg:grid-cols-4 lg:gap-[22px]">

              {trendingProducts.map((product, index) => (

                <div
                  key={
                    product?.productID ||
                    product?._id ||
                    product?.id ||
                    product?.name
                  }
                  className="mg-product-item"
                  style={{
                    animationDelay: `${index * 0.09}s`,
                  }}
                >
                  <ProdcutCard product={product} />
                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            RARE FINDS
        ====================================================== */}

        <section
          id="rare"
          className="bg-[#0A0A0A] p-0 text-[#F5F5DC]"
        >

          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-2">

            <div className="mg-rare-content relative z-10 flex flex-col justify-center px-7 py-[60px] lg:px-[60px] lg:py-[90px]">

              <div className="mb-[18px] flex items-center gap-[6px]">

                <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                  03 — RARE FINDS
                </span>

                <div className="mg-ticks-dark mg-section-line h-2 flex-1" />

              </div>

              <h2 className="mg-display mb-5 text-[clamp(32px,3.6vw,50px)]">

                Rare finds.
                <br />

                <span className="text-[#FF8F00]">
                  Serious collections.
                </span>

              </h2>

              <p className="mb-[34px] max-w-[420px] text-[15.5px] leading-[1.65] text-[#F5F5DC]/70">
                Hunt down limited releases, hard-to-find castings, and
                collector favorites before they're gone.
              </p>

              <div>

                <a
                  href="#arrivals"
                  className="mg-button inline-flex items-center gap-[10px] rounded-[2px] border border-transparent bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all hover:-translate-y-0.5 hover:bg-[#ffa733]"
                >
                  Discover Rare Cars
                </a>

              </div>

            </div>

            <div className="mg-rare-image relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_60%_50%,rgba(255,143,0,.14),transparent_60%),repeating-linear-gradient(-45deg,rgba(245,245,220,.03)_0_1px,transparent_1px_26px),#111]">

              <div className="mg-tech-ring absolute h-[420px] w-[420px] rounded-full border border-[#FF8F00]/15" />

              <div className="mg-tech-ring-reverse absolute h-[340px] w-[340px] rounded-full border border-[#FF8F00]/30" />

              <div className="mg-rare-glow pointer-events-none absolute h-[55%] w-[55%] rounded-full bg-[#FF8F00]/10 blur-[70px]" />

              <img
                src="/home5.png"
                alt="Rare collectible die-cast car"
                loading="lazy"
                decoding="async"
                className="mg-rare-car relative z-10 w-[88%] max-w-[650px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.04]"
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            NEW ARRIVALS
        ====================================================== */}

        <section
          id="arrivals"
          className="px-0 py-[70px] lg:py-[110px]"
        >

          <div className="mx-auto max-w-[1320px] px-5 lg:px-10">

            <div className="mg-arrivals-header mb-[56px] flex flex-wrap items-end justify-between gap-6">

              <div>

                <div className="mb-[18px] flex items-center gap-[6px]">

                  <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                    04 — NEW ARRIVALS
                  </span>

                  <div className="mg-ticks mg-section-line h-2 w-[200px]" />

                </div>

                <div className="max-w-[640px]">

                  <h2 className="mg-display mg-section-title mb-[14px] text-[clamp(30px,3.4vw,44px)]">
                    Just dropped
                  </h2>

                  <p className="mg-section-description text-[15.5px] leading-[1.6] text-black/60">
                    The newest die-cast releases, fresh off the line.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  aria-label="Previous"
                  className="mg-slider-button flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-all hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FF8F00]"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>

                </button>

                <button
                  type="button"
                  aria-label="Next"
                  className="mg-slider-button flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-all hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FF8F00]"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M9 6l6 6-6-6" />
                  </svg>

                </button>

              </div>

            </div>

            <div className="mg-scrollbar flex gap-[22px] overflow-x-auto pb-2">

              {newArrivalProducts.map((product, index) => (

                <div
                  key={
                    product?.productID ||
                    product?._id ||
                    product?.id ||
                    product?.name
                  }
                  className="mg-arrival-item min-w-[280px] snap-start"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <ProdcutCard product={product} />
                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            OUR STORY
        ====================================================== */}

        <section
          id="about"
          className="bg-[#ECE8D6] px-0 py-[70px] lg:py-[110px]"
        >

          <div className="mx-auto grid max-w-[1320px] items-center gap-[60px] px-5 lg:grid-cols-2 lg:px-10">

            <div className="mg-story-image relative flex aspect-[4/3.3] items-center justify-center overflow-hidden rounded-[6px] bg-[#0A0A0A]">

              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(245,245,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,245,220,.05) 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <img
                src="/home4.png"
                alt="Metal Garage collectible car collection"
                loading="lazy"
                decoding="async"
                className="mg-float relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,.55)] transition-transform duration-500 hover:scale-[1.03]"
              />

            </div>

            <div className="mg-story-content">

              <div className="mb-[22px] flex items-center gap-[6px]">

                <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                  05 — OUR STORY
                </span>

                <div className="mg-ticks mg-section-line h-2 flex-1" />

              </div>

              <h2 className="mg-display mb-5 text-[clamp(30px,3.2vw,44px)]">

                Welcome to
                <br />

                the garage.

              </h2>

              <p className="mb-[30px] max-w-[460px] text-[15.5px] leading-[1.7] text-black/70">
                Metal Garage is built for collectors who appreciate the
                details — from legendary JDM icons to exotic supercars and
                unforgettable classics.
              </p>

              <a
                href="#"
                className="mg-button inline-flex items-center gap-[10px] rounded-[2px] border border-black/15 px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] transition-all hover:border-[#FF8F00] hover:text-[#CC7000]"
              >
                Our Story →
              </a>

            </div>

          </div>

        </section>

        {/* =====================================================
            WHY US
        ====================================================== */}

        <section className="px-0 py-[70px] lg:py-[110px]">

          <div className="mx-auto max-w-[1320px] px-5 lg:px-10">

            <div className="mb-[18px] flex items-center gap-[6px]">

              <span className="mg-mono whitespace-nowrap text-[11px] tracking-[.18em] text-[#FF8F00]">
                06 — WHY US
              </span>

              <div className="mg-ticks mg-section-line h-2 flex-1" />

            </div>

            <div className="mb-14 max-w-[640px]">

              <h2 className="mg-display mg-section-title text-[clamp(30px,3.4vw,44px)]">
                Why collectors choose Metal Garage
              </h2>

            </div>

            <div className="grid grid-cols-1 gap-px border border-black/15 bg-black/15 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  title: "Authentic Collectibles",
                  text: "Genuine die-cast models carefully selected for collectors.",
                  icon: (
                    <>
                      <path d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </>
                  ),
                },
                {
                  title: "Collector Focused",
                  text: "Built specifically around the needs of serious die-cast enthusiasts.",
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="3.4" />
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                    </>
                  ),
                },
                {
                  title: "Rare & Limited",
                  text: "Discover hard-to-find releases and special editions.",
                  icon: (
                    <path d="M12 2l2.5 6.9L21 11l-6.5 2.1L12 20l-2.5-6.9L3 11z" />
                  ),
                },
                {
                  title: "Secure Shopping",
                  text: "Safe checkout and reliable delivery.",
                  icon: (
                    <>
                      <rect x="5" y="10" width="14" height="10" rx="1.5" />
                      <path d="M8 10V7a4 4 0 018 0v3" />
                    </>
                  ),
                },
              ].map((item, index) => (

                <div
                  key={item.title}
                  className="mg-why-item bg-[#F5F5DC] px-[30px] py-10"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >

                  <div className="mg-why-icon mb-[22px] h-9 w-9 text-[#FF8F00]">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="h-full w-full"
                    >
                      {item.icon}
                    </svg>

                  </div>

                  <h3 className="mb-2.5 text-[16px] font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-[13.5px] leading-[1.6] text-black/60">
                    {item.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            COMMUNITY
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#0A0A0A] px-0 py-[100px] text-center text-[#F5F5DC] lg:py-[130px]">

          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,143,0,.035)_0_2px,transparent_2px_90px)]" />

          <div className="mg-community relative z-10 mx-auto max-w-[640px] px-5">

            <div className="mb-[18px] flex justify-center">

              <span className="mg-mono mg-orange-dot text-[11px] tracking-[.18em] text-[#FF8F00]">
                07 — COMMUNITY
              </span>

            </div>

            <h2 className="mg-display mg-community-title mb-5 text-[clamp(30px,4vw,52px)]">

              More than a collection.
              <br />

              <span className="text-[#FF8F00]">
                It's a passion.
              </span>

            </h2>

            <p className="mg-community-text mb-[38px] text-[16px] leading-[1.6] text-[#F5F5DC]/70">
              Join a growing community of collectors, discover new releases,
              and stay ahead of the latest drops.
            </p>

            <a
              href="#"
              className="mg-button mg-community-button inline-flex items-center gap-[10px] rounded-[2px] bg-[#FF8F00] px-[30px] py-4 text-[13px] font-semibold uppercase tracking-[.1em] text-[#0A0A0A] transition-all hover:-translate-y-0.5 hover:bg-[#ffa733]"
            >
              Join the Garage
            </a>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}