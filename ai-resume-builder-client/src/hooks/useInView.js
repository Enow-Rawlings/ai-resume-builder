import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, hasBeenVisible].
 * hasBeenVisible flips to true once the element enters the viewport and
 * stays true — so the animation only plays once (no reset on scroll-out).
 *
 * @param {number} threshold  - 0–1, fraction of element that must be visible. Default 0.15.
 * @param {string} rootMargin - IntersectionObserver rootMargin. Default "0px 0px -60px 0px"
 *                              (fires 60px before the bottom of the viewport).
 */
const useInView = (threshold = 0.15, rootMargin = "0px 0px -60px 0px") => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Bail out gracefully in environments without IntersectionObserver (SSR, old browsers)
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // fire once only
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
};

export default useInView;
