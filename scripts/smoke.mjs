import { execSync, spawn, spawnSync } from "node:child_process";
import net from "node:net";

/**
 * Smoke gate v1: минимальная проверка, что проект собирается и typecheck проходит.
 * Также проверяем публичные поверхности:
 * - / и /plovxana/menu
 * - наличие JSON-LD
 * - наличие базовых мета-тегов
 *
 * Строгий режим (перед прод-деплоем или в CI со секретом):
 *   SMOKE_REQUIRE_SERVICE_ROLE=1
 * требует непустой SUPABASE_SERVICE_ROLE_KEY в окружении, иначе exit 1 и MISSING_SERVICE_ROLE_KEY.
 * По умолчанию выключено: локальная разработка и стандартный CI без секретов Supabase.
 */

function requireServiceRoleIfStrict() {
  const strict =
    process.env.SMOKE_REQUIRE_SERVICE_ROLE === "1" ||
    process.env.SMOKE_REQUIRE_SERVICE_ROLE === "true";
  if (!strict) return;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    console.error(
      "SMOKE: MISSING_SERVICE_ROLE_KEY — задайте SUPABASE_SERVICE_ROLE_KEY или отключите строгий режим (уберите SMOKE_REQUIRE_SERVICE_ROLE).",
    );
    process.exit(1);
  }
}

function run(cmd, envOverrides = {}) {
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...envOverrides },
  });
}

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

async function waitForServer(url, timeoutMs) {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await fetch(url);
      return;
    } catch {
      if (Date.now() - started > timeoutMs) {
        throw new Error(`SMOKE: server did not start within ${timeoutMs}ms`);
      }
      await wait(300);
    }
  }
}

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    const preview = haystack.slice(0, 800).replaceAll("\n", " ");
    throw new Error(`SMOKE: missing ${label}: ${needle}. Preview: ${preview}`);
  }
}

async function getFreePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : null;
  server.close();
  if (!port) throw new Error("SMOKE: failed to allocate free port");
  return port;
}

function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // ignore
  }
}

requireServiceRoleIfStrict();

run("npm run lint");
run("npm run typecheck");
// Build должен быть зелёным даже без реальных env продакшена.
run("npm run build", {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  // В некоторых окружениях NODE_OPTIONS может делать unhandledRejection фатальным.
  NODE_OPTIONS: "",
});

const port = await getFreePort();
const base = `http://127.0.0.1:${port}`;

// Запускаем next напрямую, чтобы корректно уметь убивать процесс (npm/cmd спаунит дерево).
const nextBin =
  process.platform === "win32"
    ? "node_modules\\next\\dist\\bin\\next"
    : "node_modules/next/dist/bin/next";

const server = spawn("node", [nextBin, "start", "-p", String(port)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_SITE_URL: base,
  },
});

try {
  await waitForServer(`${base}/`, 15000);

  const homeHtml = await fetchText(`${base}/`);
  assertIncludes(homeHtml, "application/ld+json", "JSON-LD on /");
  assertIncludes(homeHtml, "<title>", "title on /");

  const menuHtml = await fetchText(`${base}/plovxana/menu`);
  assertIncludes(menuHtml, "application/ld+json", "JSON-LD on /plovxana/menu");
  assertIncludes(menuHtml, "<title>", "title on /plovxana/menu");

  const adminRes = await fetch(`${base}/admin/dashboard`, { redirect: "manual" });
  if (![301, 302, 303, 307, 308].includes(adminRes.status)) {
    throw new Error(
      `SMOKE: expected redirect from /admin/dashboard without session, got HTTP ${adminRes.status}`,
    );
  }
  const loc = adminRes.headers.get("location") ?? "";
  if (!loc.includes("/admin/login")) {
    throw new Error(`SMOKE: /admin/dashboard should redirect to login, Location was: ${loc}`);
  }

  console.log("SMOKE: ok");
} finally {
  killProcessTree(server.pid);
}

