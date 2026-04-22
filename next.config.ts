import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Каталог проекта (на Windows/macOS у родителя может лежать второй lockfile — без этого Next берёт неверный root). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getSupabaseHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = getSupabaseHostname();

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Cloudinary (если выберем его как pipeline; allowlist обязательный по security-spec)
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
