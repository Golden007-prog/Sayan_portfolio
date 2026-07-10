import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, SSR-safe. Import gsap/ScrollTrigger from here everywhere.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power4.out", duration: 0.9 });
}

export { gsap, ScrollTrigger };
