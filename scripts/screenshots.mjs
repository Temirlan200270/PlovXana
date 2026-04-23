// =============================================================================
//  Скрипт для автоматического снятия скринов прода (или любого URL через env).
//
//  Использование:
//    npm run screenshots                # снимает с http://178.104.163.216
//    BASE_URL=http://localhost:3000 node scripts/screenshots.mjs
//
//  Что снимает:
//    - /              (главная)
//    - /default/menu  (меню)
//    - /privacy       (политика)
//
//  Для каждой страницы — 3 варианта:
//    1. desktop-full  — 1440×900, вся страница (full page)
//    2. desktop-fold  — 1440×900, только первый экран
//    3. mobile-full   — 390×844 (iPhone 14 Pro), вся страница
//
//  Результат сохраняется в screenshots/YYYY-MM-DD_HHmm/*.png
// =============================================================================

import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://178.104.163.216";
const PAGES = [
  { slug: "home", path: "/" },
  { slug: "menu", path: "/default/menu" },
  { slug: "privacy", path: "/privacy" },
];

const VIEWPORTS = [
  {
    name: "desktop-full",
    viewport: { width: 1440, height: 900 },
    fullPage: true,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: "desktop-fold",
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: "mobile-full",
    viewport: devices["iPhone 14 Pro"].viewport,
    fullPage: true,
    deviceScaleFactor: devices["iPhone 14 Pro"].deviceScaleFactor,
    isMobile: true,
    userAgent: devices["iPhone 14 Pro"].userAgent,
  },
];

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

async function scrollToBottom(page) {
  // Плавный скролл вниз, чтобы lazy-loaded картинки успели подгрузиться,
  // flutter_animate-like .fadeIn() анимации — проиграться,
  // а IntersectionObserver'ы — сработать.
  await page.evaluate(async () => {
    const step = 400;
    const delay = 120;
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, delay));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

async function run() {
  const outDir = join("screenshots", timestamp());
  await mkdir(outDir, { recursive: true });

  console.log(`==> BASE_URL = ${BASE_URL}`);
  console.log(`==> Output   = ${outDir}`);

  const browser = await chromium.launch();

  try {
    for (const vp of VIEWPORTS) {
      const contextOpts = {
        viewport: vp.viewport,
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: vp.isMobile,
      };
      if (vp.userAgent) contextOpts.userAgent = vp.userAgent;

      const context = await browser.newContext(contextOpts);
      const page = await context.newPage();

      for (const p of PAGES) {
        const url = `${BASE_URL}${p.path}`;
        const file = join(outDir, `${p.slug}__${vp.name}.png`);

        process.stdout.write(`  ${vp.name.padEnd(14)} ${p.path.padEnd(18)} ... `);

        try {
          const resp = await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30_000,
          });
          const status = resp ? resp.status() : 0;

          if (!resp || !resp.ok()) {
            console.log(`FAIL (HTTP ${status})`);
            continue;
          }

          if (vp.fullPage) {
            await scrollToBottom(page);
          }
          // Небольшая пауза, чтобы flutter_animate / framer-motion завершились
          await page.waitForTimeout(800);

          await page.screenshot({
            path: file,
            fullPage: vp.fullPage,
          });
          console.log(`OK (${status})`);
        } catch (err) {
          console.log(`ERROR: ${err.message}`);
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`\n==> Done. Files in ${outDir}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
