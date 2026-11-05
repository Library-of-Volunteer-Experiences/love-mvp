// Tracks which demo step is crossing the middle of the viewport.
// Attach stepRefs to each step element; activeStep is that step's index.

import { useEffect, useRef, useState } from 'react';

export function useActiveStep() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = stepRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveStep(index);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return { activeStep, stepRefs };
}
