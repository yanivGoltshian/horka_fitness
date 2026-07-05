"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global scroll-reveal controller.
 *  - [data-animate]        → single element fades + slides up when scrolled into view
 *  - [data-animate-group]  → its direct children reveal with a stagger
 * Above-the-fold hero keeps its CSS entrance so there is no first-paint flash.
 * Fully skipped for users who prefer reduced motion.
 */
export default function Animations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate-group]").forEach((group) => {
        const kids = gsap.utils.toArray<HTMLElement>(group.children);
        gsap.from(kids, {
          opacity: 0,
          y: 34,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      // let layout settle (fonts/images) before ScrollTrigger measures
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, []);

  return null;
}
