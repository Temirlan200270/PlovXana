// Режем мобильную главную на секции для ревью.
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://178.104.163.216";
const DEVICE = devices["iPhone 14 Pro"];
const SECTION_HEIGHT = 900;

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}-mobile`;
}

async function run() {
  const outDir = join("screenshots", timestamp());
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...DEVICE,
    viewport: { width: DEVICE.viewport.width, height: SECTION_HEIGHT },
  });
  const page = await context.newPage();

  for (const p of [{ slug: "home", path: "/" }]) {
    const resp = await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle", timeout: 30_000 });
    if (!resp?.ok()) continue;

    const total = await page.evaluate(async () => {
      const step = 300;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      return document.documentElement.scrollHeight;
    });

    const chunks = Math.ceil(total / SECTION_HEIGHT);
    for (let i = 0; i < chunks; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * SECTION_HEIGHT);
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(outDir, `${p.slug}__${String(i).padStart(2, "0")}.png`), fullPage: false });
    }
    console.log(`${p.slug}: ${chunks} sections`);
  }

  await browser.close();
  console.log(`\nOutput: ${outDir}`);
}

run();
