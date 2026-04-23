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

  /**
   * На мобильном (< md, 768px) «летающие тарелки» прячем:
   *   их absolute-координаты `left-16 top-[420px]` рассчитаны под desktop-hero шириной
   *   ~980px. На мобиле (390–430px) декор наезжает на параграф и CTA,
   *   ломая читаемость. Показываем их только на md+ — там макет даёт достаточно воздуха.
   */
  return (
    <>
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute left-8 top-[680px] hidden h-36 w-36 rotate-[-15deg] md:block"
        aria-hidden
      >
        <PlateIcon variant="plov" size={140} />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute right-10 top-[620px] hidden h-32 w-32 rotate-[22deg] opacity-85 md:block"
        aria-hidden
      >
        <PlateIcon variant="kazy" size={120} />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="pointer-events-none absolute left-16 top-[420px] hidden h-20 w-20 rotate-[8deg] opacity-70 md:block"
        aria-hidden
      >
        <PlateIcon variant="samsa" size={80} />
      </motion.div>
    </>
  );
}

