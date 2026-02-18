/**
 * AURELIUS ESTATE — main.js
 * Advanced Scroll Animations powered by GSAP 3 + ScrollTrigger
 *
 * Architecture:
 *  1.  Plugin Registration & Config
 *  2.  Custom Cursor
 *  3.  Scroll Progress Bar
 *  4.  Section Nav Dots
 *  5.  Site Header (scroll-aware)
 *  6.  Hero Section — Cinematic Intro Timeline
 *  7.  Hero Parallax (scrub)
 *  8.  About Section — Pin + Clip Reveal + Text Cascade
 *  9.  Portfolio — Horizontal Scroll (pin + scrub)
 *  10. Services — Staggered Reveal + Left Panel Parallax
 *  11. CTA Section — Typography Reveal (pin + scrub)
 *  12. Navigation Dots Logic
 *  13. Smooth Anchor Scrolling
 */

/* ════════════════════════════════════════════════════════════════════
   1. PLUGIN REGISTRATION & CONFIG
   ════════════════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global GSAP defaults
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

// ScrollTrigger global settings
ScrollTrigger.config({
  limitCallbacks: true,  // performance
  syncInterval: 60,
});

/* ════════════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
   ════════════════════════════════════════════════════════════════════ */
(function initCursor() {
  const outer = document.getElementById("cursorOuter");
  const dot   = document.getElementById("cursorDot");

  // Positions tracked separately so outer lags behind for fluid feel
  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let outerX = mouseX;
  let outerY = mouseY;

  // Update raw mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows exactly
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  // Outer ring lags with lerp
  function animateCursor() {
    outerX += (mouseX - outerX) * 0.1;
    outerY += (mouseY - outerY) * 0.1;
    outer.style.left = outerX + "px";
    outer.style.top  = outerY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .property-card, .service-block, .btn-primary, .btn-ghost, .btn-cta-primary"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    outer.style.opacity = "0";
    dot.style.opacity   = "0";
  });
  document.addEventListener("mouseenter", () => {
    outer.style.opacity = "1";
    dot.style.opacity   = "1";
  });
})();

/* ════════════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
   ════════════════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  ScrollTrigger.create({
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      bar.style.width = (self.progress * 100) + "%";
    },
  });
})();

/* ════════════════════════════════════════════════════════════════════
   4. SECTION NAV DOTS — wired in section 12
   ════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════
   5. SITE HEADER — scrolled class
   ════════════════════════════════════════════════════════════════════ */
(function initHeader() {
  const header = document.getElementById("siteHeader");
  ScrollTrigger.create({
    start: "80px top",
    onEnter:     () => header.classList.add("scrolled"),
    onLeaveBack: () => header.classList.remove("scrolled"),
  });
})();

/* ════════════════════════════════════════════════════════════════════
   6. HERO SECTION — Cinematic Intro Timeline
   Purpose: On page load, orchestrate a staggered reveal of every
   hero element using a GSAP timeline. This plays once and creates
   the first impression — immersive, layered, cinematic.
   ════════════════════════════════════════════════════════════════════ */
(function initHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  // ── Sequenced reveals ──
  tl
    // Background image zooms in from slightly enlarged state
    .from(".hero-bg--far", {
      scale: 1.1,
      duration: 2.2,
      ease: "expo.out",
    }, 0)

    // Eyebrow fades + slides up
    .to(".hero-eyebrow", {
      opacity: 1,
      y: 0,
      duration: 1,
    }, 0.5)

    // Title lines cascade up, clipped from bottom
    .to(".hero-title__line--1", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
    }, 0.7)

    .to(".hero-title__line--2", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
    }, 0.85)

    .to(".hero-title__line--3", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
    }, 1.0)

    // Subheading fades in
    .to(".hero-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
    }, 1.2)

    // CTA buttons
    .to(".hero-actions", {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, 1.4)

    // Scroll indicator
    .to(".scroll-indicator", {
      opacity: 1,
      duration: 0.8,
    }, 1.6)

    // Stats bar slides up from bottom
    .to(".hero-stats", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "expo.out",
    }, 1.5)

    // Decorative lines draw in
    .from(".hero-line--left", {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.5,
      ease: "expo.out",
    }, 0.3)

    .from(".hero-line--right", {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 1.5,
      ease: "expo.out",
    }, 0.3);

  // Set initial y positions for stagger targets
  gsap.set([".hero-eyebrow", ".hero-sub", ".hero-actions", ".hero-stats"], { y: 30 });
  gsap.set(".hero-title__line", { y: "100%" });
})();

/* ════════════════════════════════════════════════════════════════════
   7. HERO PARALLAX — scrub
   Purpose: As the user scrolls past the hero, the background image
   moves at a different rate (parallax), the content lifts and fades,
   creating depth and cinematic motion.
   scrub: 1 — Ties the animation position smoothly to scroll position
   ════════════════════════════════════════════════════════════════════ */
(function initHeroParallax() {
  // Background parallax — slower than scroll speed
  gsap.to(".hero-bg--far", {
    yPercent: 25,  // moves 25% of its height while scrolling out of view
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,      // smooth scrub value: 1 = 1 second lag for buttery feel
    },
  });

  // Content parallax — lifts faster than scroll
  gsap.to(".hero-content", {
    yPercent: -20,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "center top",
      end: "bottom top",
      scrub: 0.8,
    },
  });

  // Gold radial mid-layer parallax
  gsap.to(".hero-bg--mid", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
  });
})();

/* ════════════════════════════════════════════════════════════════════
   8. ABOUT SECTION — Pin + Clip Reveal + Scroll-scrubbed text cascade
   
   How it works:
   • The section is NOT pinned globally, but elements are revealed
     as the viewport enters them.
   • The image uses clip-path animation (industry standard masking).
   • Text lines cascade with staggered ScrollTrigger instances.
   • scrub: false (not scrubbed) — triggers play forward on enter.
   ════════════════════════════════════════════════════════════════════ */
(function initAbout() {
  const aboutSection = document.querySelector(".about");
  if (!aboutSection) return;

  // ── Image clip-path reveal ──
  // Clip moves from "all hidden right" → "fully shown"
  gsap.to(".about-image-mask", {
    clipPath: "inset(0 0% 0 0)",  // from inset(0 100% 0 0) set in CSS
    duration: 1.6,
    ease: "expo.inOut",
    scrollTrigger: {
      trigger: ".about-image-wrap",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    onComplete: () => {
      // Also scale down the image for a zoom-in-and-settle effect
      gsap.to(".about-image", { scale: 1, duration: 1.4, ease: "expo.out" });
    },
  });

  // ── Image accent border ──
  gsap.to(".about-image-accent", {
    opacity: 0.6,
    duration: 1,
    delay: 0.5,
    scrollTrigger: {
      trigger: ".about-image-wrap",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // ── Image caption ──
  gsap.to(".about-image-caption", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".about-image-wrap",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.set(".about-image-caption", { y: 10 });

  // ── Kicker ──
  gsap.to(".about-kicker", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.set(".about-kicker", { y: 15 });

  // ── Heading lines cascade ──
  const headingLines = document.querySelectorAll(".about-heading__line");
  headingLines.forEach((line, i) => {
    gsap.to(line, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      delay: i * 0.12,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".about-heading",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
  gsap.set(headingLines, { y: 30 });

  // ── Paragraphs ──
  gsap.to(".about-para--1", {
    opacity: 1, y: 0, duration: 0.9,
    scrollTrigger: {
      trigger: ".about-body",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.to(".about-para--2", {
    opacity: 1, y: 0, duration: 0.9, delay: 0.15,
    scrollTrigger: {
      trigger: ".about-body",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.set(".about-para--1, .about-para--2", { y: 20 });

  // ── Awards stagger ──
  gsap.to(".award", {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".about-awards",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.set(".award", { x: -20 });

  // ── CTA button ──
  gsap.to(".about-cta", {
    opacity: 1, y: 0, duration: 0.8,
    scrollTrigger: {
      trigger: ".about-cta",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.set(".about-cta", { y: 15 });

  // ── Background word parallax (subtle scroll drift) ──
  gsap.to(".about-bg-word", {
    x: -80,
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,  // very smooth drift
    },
  });
})();

/* ════════════════════════════════════════════════════════════════════
   9. PORTFOLIO — Horizontal Scroll Gallery
   
   This is the centerpiece scroll effect:
   • The .portfolio section is PINNED during the horizontal animation.
   • The .portfolio-track is translated in X as the user scrolls Y.
   • pin: true — keeps the section fixed while the scrub plays.
   • pinSpacing: true — adds padding after the pinned element equal
     to the scroll distance, so subsequent sections push down naturally.
   • scrub: 1 — ties X translation to scroll position (1 = 1s lag).
   ════════════════════════════════════════════════════════════════════ */
(function initPortfolioHorizontal() {
  const track      = document.getElementById("portfolioTrack");
  const pinWrapper = document.querySelector(".portfolio-pin-wrap");
  if (!track || !pinWrapper) return;

  // Wait for layout to calculate scroll distance
  let ctx; // GSAP context for cleanup

  function buildHorizontalScroll() {
    if (ctx) ctx.revert(); // Clean up if rebuilding

    // The amount the track needs to move = track width - viewport width
    const trackWidth = track.scrollWidth;
    const viewWidth  = window.innerWidth;
    const scrollDist = trackWidth - viewWidth;

    // Only animate if there's overflow
    if (scrollDist <= 0) return;

    ctx = gsap.context(() => {
      // Horizontal scroll timeline
      const tlHoriz = gsap.timeline({
        scrollTrigger: {
          trigger: ".portfolio-pin-wrap",
          start: "top top",           // pin starts when top of wrapper hits viewport top
          end: () => `+=${scrollDist}`, // scroll distance = overflow amount
          pin: true,                  // 🔑 pin the wrapper in place
          pinSpacing: true,           // 🔑 add spacing below so rest of page follows naturally
          scrub: 1,                   // 🔑 smooth scrub tied to scroll position (1s lag)
          anticipatePin: 1,           // prevents "jump" at pin start
          invalidateOnRefresh: true,  // recalculates on resize
        },
      });

      // The actual horizontal movement
      tlHoriz.to(track, {
        x: -scrollDist,
        ease: "none",  // linear — scrub handles easing
      });

    });
  }

  buildHorizontalScroll();

  // Rebuild on resize (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildHorizontalScroll, 250);
  });

  // ── Portfolio header reveal ──
  gsap.to(".portfolio-kicker", {
    opacity: 1, y: 0, duration: 0.8,
    scrollTrigger: { trigger: ".portfolio-header", start: "top 85%" },
  });
  gsap.to(".portfolio-title", {
    opacity: 1, y: 0, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".portfolio-header", start: "top 85%" },
  });
  gsap.set(".portfolio-kicker", { y: 15 });
  gsap.set(".portfolio-title", { y: 25 });

  // ── Drag hint ──
  gsap.to(".portfolio-drag-hint", {
    opacity: 1,
    duration: 1,
    delay: 0.5,
    scrollTrigger: { trigger: ".portfolio-header", start: "top 80%" },
  });

  // ── Card reveal on scroll (stagger as cards come into view) ──
  // Cards animate as they enter viewport
  gsap.from(".property-card", {
    opacity: 0,
    y: 50,
    scale: 0.97,
    duration: 0.9,
    stagger: 0.12,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".portfolio-pin-wrap",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
})();

/* ════════════════════════════════════════════════════════════════════
   10. SERVICES — Staggered Reveal + Left Panel Parallax
   
   • Service blocks slide in from below with stagger.
   • Left panel image is revealed with clip-path.
   • Background image parallaxes slightly as the section scrolls.
   ════════════════════════════════════════════════════════════════════ */
(function initServices() {
  const serviceBlocks = document.querySelectorAll(".service-block");
  if (!serviceBlocks.length) return;

  // ── Left panel text reveals ──
  gsap.to(".services-kicker", {
    opacity: 1, y: 0, duration: 0.8,
    scrollTrigger: { trigger: ".services-left", start: "top 80%" },
  });
  gsap.to(".services-title", {
    opacity: 1, y: 0, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".services-left", start: "top 80%" },
  });
  gsap.to(".services-intro", {
    opacity: 1, y: 0, duration: 0.9, delay: 0.15,
    scrollTrigger: { trigger: ".services-left", start: "top 80%" },
  });
  gsap.set(".services-kicker, .services-title, .services-intro", { y: 20 });

  // ── Left image clip reveal ──
  gsap.to(".services-img-wrap", {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.4,
    ease: "expo.inOut",
    scrollTrigger: {
      trigger: ".services-img-wrap",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    onStart: () => {
      gsap.to(".services-img", { scale: 1, duration: 1.6, ease: "expo.out" });
    },
  });

  // ── Service blocks — staggered scroll reveal ──
  // Each block gets its own ScrollTrigger so they reveal progressively
  serviceBlocks.forEach((block, i) => {
    gsap.to(block, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: {
        trigger: block,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
  });
})();

/* ════════════════════════════════════════════════════════════════════
   11. CTA SECTION — Dramatic Typography Reveal (pin + scrub)
   
   How the pin works here:
   • The CTA is pinned for a duration equal to its own height.
   • A timeline scrubbed to scroll reveals each text element.
   • This creates a "pause and read" moment — the user is held in
     the section while the dramatic copy unfolds cinematically.
   ════════════════════════════════════════════════════════════════════ */
(function initCTA() {
  const ctaSection = document.querySelector(".cta");
  if (!ctaSection) return;

  // Timeline scrubbed to scroll — plays as user scrolls into CTA
  const tlCta = gsap.timeline({
    scrollTrigger: {
      trigger: ".cta",
      start: "top top",
      end: "+=80%",        // pin for 80% of viewport height of scroll
      pin: true,           // 🔑 pin the CTA
      pinSpacing: true,    // 🔑 adds scroll space below
      scrub: 1.5,          // 🔑 silky smooth scrub
      anticipatePin: 1,
    },
  });

  // CTA background subtle parallax
  tlCta
    .to(".cta-bg", {
      yPercent: 8,
      ease: "none",
    }, 0)

    // Kicker fades in at 0% scroll progress
    .to(".cta-kicker", {
      opacity: 1, y: 0, duration: 0.4, ease: "power2.out",
    }, 0.05)

    // Title line 1
    .to(".cta-title__line:nth-child(1)", {
      opacity: 1, y: 0, duration: 0.5, ease: "expo.out",
    }, 0.15)

    // Title line 2
    .to(".cta-title__line:nth-child(2)", {
      opacity: 1, y: 0, duration: 0.5, ease: "expo.out",
    }, 0.25)

    // Subtitle
    .to(".cta-sub", {
      opacity: 1, y: 0, duration: 0.4, ease: "power2.out",
    }, 0.4)

    // CTA button
    .to(".btn-cta-primary", {
      opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)",
    }, 0.55)

    // Contact row
    .to(".cta-contact-row", {
      opacity: 1, duration: 0.3,
    }, 0.7);

  // Set initial states for CTA elements
  gsap.set(".cta-kicker", { y: 20 });
  gsap.set(".cta-title__line", { y: 40 });
  gsap.set(".cta-sub", { y: 20 });
  gsap.set(".btn-cta-primary", { y: 20, scale: 0.97 });
})();

/* ════════════════════════════════════════════════════════════════════
   12. SECTION NAV DOTS — active state driven by ScrollTrigger
   ════════════════════════════════════════════════════════════════════ */
(function initNavDots() {
  const dots    = document.querySelectorAll(".nav-dot");
  const sections = document.querySelectorAll("[data-section]");

  sections.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter:      () => setActiveDot(i),
      onEnterBack:  () => setActiveDot(i),
    });
  });

  function setActiveDot(index) {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  // Click nav dots to scroll to section
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const target = sections[i];
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 0 },
          ease: "expo.inOut",
        });
      }
    });
  });
})();

/* ════════════════════════════════════════════════════════════════════
   13. SMOOTH ANCHOR SCROLLING
   ════════════════════════════════════════════════════════════════════ */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        duration: 1.4,
        scrollTo: { y: target, offsetY: 0 },
        ease: "expo.inOut",
      });
    });
  });
})();

/* ════════════════════════════════════════════════════════════════════
   14. PERFORMANCE — Refresh on load (images, fonts)
   ════════════════════════════════════════════════════════════════════ */
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

/* ════════════════════════════════════════════════════════════════════
   15. SECTION ENTRY ANIMATIONS (fallback for small sections)
   Any [data-section] that hasn't been explicitly handled gets
   a simple fade-up on entry.
   ════════════════════════════════════════════════════════════════════ */
(function initGenericReveal() {
  // Footer columns
  gsap.from(".footer-inner > *", {
    opacity: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".site-footer",
      start: "top 90%",
    },
  });
})();

/* ════════════════════════════════════════════════════════════════════
   16. SERVICES IMAGE — set initial clip state in JS
   (CSS clip-path "inset(100% 0 0 0)" set as start; JS animates to
   "inset(0% 0 0 0)". Already declared above, this ensures it's set.)
   ════════════════════════════════════════════════════════════════════ */
gsap.set(".services-img-wrap", { clipPath: "inset(100% 0 0 0)" });
gsap.set(".services-img", { scale: 1.1 });
gsap.set(".about-image-mask", { clipPath: "inset(0 100% 0 0)" });
