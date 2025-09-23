"use client";

import { motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

type BoxRevealProps = {
  children: ReactNode;
  boxColor?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

export function BoxReveal({
  children,
  boxColor = "#5046e6",
  duration = 0.5,
  delay = 0,
  className = "",
}: BoxRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isVisible ? { y: "-100%" } : { y: "100%" }}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10"
        style={{ backgroundColor: boxColor }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: duration * 0.3,
          delay: delay + duration * 0.7,
        }}
        className="relative z-20"
      >
        {children}
      </motion.div>
    </div>
  );
}
