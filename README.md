# AURELIUS ESTATE — Luxury Real Estate Landing Page

A production-grade single-page website built with HTML5, CSS3, Vanilla JS, and GSAP 3 + ScrollTrigger.

---

## Project Structure

```
/
├── index.html              ← Semantic HTML structure
├── css/
│   └── style.css           ← Complete stylesheet (dark luxury theme)
├── js/
│   └── main.js             ← All GSAP animations and interactions
└── assets/
    └── images/             ← (Images served via Unsplash CDN URLs)
```

---

## How to Run Locally

**Option A — Direct (no server needed):**
Simply open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
No build step, no dependencies to install.

**Option B — Local dev server (recommended for best experience):**

```bash
# If you have Node.js installed:
npx serve .

# If you have Python:
python3 -m http.server 8080

# Then open: http://localhost:8080
```

---

## GSAP + ScrollTrigger Configuration — Full Explanation

### Plugin Registration

```js
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
```
Both plugins are registered before any animations are created. `ScrollToPlugin` enables smooth programmatic scrolling when nav dots or anchor links are clicked.

---

### How `ScrollTrigger` is Configured

`ScrollTrigger` attaches GSAP animations to scroll position. Each trigger has:
- `trigger` — the DOM element that triggers the animation when it enters the viewport
- `start` — when the animation begins (e.g., `"top 80%"` = element's top reaches 80% down from top of viewport)
- `end` — when the animation ends
- `toggleActions` — what happens on enter/leave/enterBack/leaveBack

**Example:**
```js
scrollTrigger: {
  trigger: ".about-image-wrap",
  start: "top 80%",
  toggleActions: "play none none reverse",
}
```

---

### How `pin` is Used

**`pin: true`** locks an element to the viewport while the scroll continues past it. The page appears frozen, but scroll progress still accumulates and drives the animation.

Used in two sections:

**1. Portfolio Horizontal Scroll:**
```js
scrollTrigger: {
  trigger: ".portfolio-pin-wrap",
  start: "top top",
  end: () => `+=${scrollDist}`,
  pin: true,       ← locks .portfolio-pin-wrap to viewport
  scrub: 1,
}
```
The section is pinned until the full horizontal track has scrolled through.

**2. CTA Section:**
```js
scrollTrigger: {
  trigger: ".cta",
  start: "top top",
  end: "+=80%",
  pin: true,       ← locks CTA in place while typography reveals
  scrub: 1.5,
}
```

---

### How `pinSpacing` is Used

**`pinSpacing: true`** (the default) automatically inserts spacing after the pinned element equal to the total scroll distance consumed during the pin. This prevents subsequent sections from jumping or overlapping — the page layout remains natural and continuous.

Without pinSpacing, after the portfolio scrolls horizontally, the next section would visually collide with it. With it, the next section appears right where it belongs.

---

### How `scrub` is Used

**`scrub`** ties the animation's playhead to the scroll position rather than playing it forward in time. 

- `scrub: true` or `scrub: 1` — animation position is synced to scroll.
- The number (e.g. `1`, `1.5`, `2`) is the lag time in seconds — higher = more fluid/buttery, lower = snappier.
- `ease: "none"` should be used in scrubbed animations because the easing is effectively applied by the scroll speed.

Used for:
- `scrub: 1` — Hero parallax background drift
- `scrub: 1` — Portfolio horizontal track translation
- `scrub: 1.5` — CTA text reveal
- `scrub: 2` — About background "PRESTIGE" word horizontal drift

---

### Layered Parallax Effects

Multiple layers move at different speeds on the same ScrollTrigger, creating depth:

```js
// Background (slowest)
gsap.to(".hero-bg--far", { yPercent: 25, scrub: 1 });

// Mid-layer gold glow
gsap.to(".hero-bg--mid", { yPercent: 15, scrub: 1.5 });

// Content (fastest - disappears first)
gsap.to(".hero-content", { yPercent: -20, opacity: 0, scrub: 0.8 });
```

---

### Timeline-Based Scroll Choreography

The hero intro uses a **GSAP Timeline** (`gsap.timeline()`) so every element plays in precisely coordinated sequence at specific time offsets, not all at once:

```js
const tl = gsap.timeline();
tl
  .from(".hero-bg--far",  { scale: 1.1, duration: 2.2 }, 0)
  .to(".hero-eyebrow",    { opacity: 1, duration: 1 }, 0.5)
  .to(".hero-title__line--1", { opacity: 1 }, 0.7)
  .to(".hero-title__line--2", { opacity: 1 }, 0.85)
  // etc.
```

The CTA uses a **scrubbed timeline** — the same timeline API but controlled by scroll position instead of time.

---

## Bonus Features Implemented

| Feature | Status |
|---|---|
| Custom cursor (lagged outer ring + dot) | ✅ |
| Grain overlay texture (CSS SVG noise) | ✅ |
| Scroll progress indicator | ✅ |
| Section navigation dots | ✅ |
| Smooth anchor scrolling (GSAP ScrollTo) | ✅ |
| Responsive layout | ✅ |
| Image clip-path reveals | ✅ |
| Horizontal scroll gallery | ✅ |
| CTA pin + scrub typography | ✅ |
| Header scroll-aware glass effect | ✅ |

---

## Image Credits

All images are royalty-free from Unsplash, served via their CDN:
- Hero: Photo by Breno Assis / Curtis Adams
- About: Photo by Point3D Commercial Imaging
- Portfolio: Multiple photographers on Unsplash
- Services: Photo by Francesca Tosolini
- CTA: Photo by R Architecture

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

*Built with GSAP 3.12.5 · ScrollTrigger · ScrollToPlugin*
