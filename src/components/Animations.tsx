"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global scroll-reveal controller.
 *  - [data-animate]        → single element fades + slides up when scrolled into view
 *  - [data-animate-group]  → its direct children reveal with a stagger
 * Above-the-fold hero keeps its CSS entrance so there is no first-paint flash.
 * Skipped entirely for users who prefer reduced motion.
 *
 * Robustness: elements are hidden with gsap.set and revealed via ScrollTrigger.onEnter
 * (fires immediately for anything already in view on refresh). A safety net force-reveals
 * anything still hidden after a short delay, so content can never get stuck invisible.
 */
export default function Animations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reveal = (el: HTMLElement) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    // Reduced motion: make sure everything is simply visible, do nothing else.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll<HTMLElement>("[data-animate], [data-animate-group] > *")
        .forEach(reveal);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate-group]").forEach((group) => {
        const kids = gsap.utils.toArray<HTMLElement>(group.children);
        gsap.set(kids, { opacity: 0, y: 34 });
        ScrollTrigger.create({
          trigger: group,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(kids, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.09,
            }),
        });
      });

      // Measure after fonts/images/videos settle so triggers fire at the right spot.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // Safety net — never let content stay invisible if a trigger fails to fire
    // (StrictMode double-mount, late layout shift, measurement race, etc.).
    const safety = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>("[data-animate], [data-animate-group] > *")
        .forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) reveal(el);
        });
    }, 2200);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, []);

  return null;
}
