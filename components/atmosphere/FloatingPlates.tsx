"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PlateIcon } from "@/components/ornaments/PlateIcon";

export function FloatingPlates() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const intensity = reduceMotion ? 0 : 1;
  const y1 = useTransform(scrollY, [0, 800], [0, -120 * intensity]);
  const y2 = useTransform(scrollY, [0, 800], [0, -80 * intensity]);
  const y3 = useTransform(scrollY, [0, 800], [0, -200 * intensity]);

  return (
    <>
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute left-8 top-[680px] w-36 h-36 rotate-[-15deg]"
        aria-hidden
      >
        <PlateIcon variant="plov" size={140} />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute right-10 top-[620px] w-32 h-32 rotate-[22deg] opacity-85"
        aria-hidden
      >
        <PlateIcon variant="kazy" size={120} />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="pointer-events-none absolute left-16 top-[420px] w-20 h-20 rotate-[8deg] opacity-70"
        aria-hidden
      >
        <PlateIcon variant="samsa" size={80} />
      </motion.div>
    </>
  );
}

