// Режем длинную страницу на секции фиксированной высоты для удобного ревью.
// Output: screenshots/<ts>/sections/<page>__NN.png

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://178.104.163.216";
const SECTION_HEIGHT = 1100;
const VIEWPORT = { width: 1440, height: SECTION_HEIGHT };

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "menu", path: "/default/menu" },
  { slug: "privacy", path: "/privacy" },
];

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}-sections`;
}

async function run() {
  const outDir = join("screenshots", timestamp());
  await mkdir(outDir, { recursive: true });
  console.log(`==> Output: ${outDir}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();

  try {
    for (const p of PAGES) {
      const url = `${BASE_URL}${p.path}`;
      console.log(`\n-> ${p.slug}: ${url}`);

      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      if (!resp?.ok()) {
        console.log(`   skip (HTTP ${resp?.status()})`);
        continue;
      }

      // Прогреваем lazy-контент: прокручиваем всю страницу вниз.
      const totalHeight = await page.evaluate(async () => {
        const step = 400;
        const delay = 100;
        const total = document.documentElement.scrollHeight;
        for (let y = 0; y < total; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, delay));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
        return document.documentElement.scrollHeight;
      });

      console.log(`   scrollHeight = ${totalHeight}px`);
      const chunks = Math.ceil(totalHeight / SECTION_HEIGHT);

      for (let i = 0; i < chunks; i++) {
        const y = i * SECTION_HEIGHT;
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(400);
        const file = join(outDir, `${p.slug}__${String(i).padStart(2, "0")}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`   ${file}`);
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`\n==> Done`);
}

run().catch((e) => { console.error(e); process.exit(1); });
