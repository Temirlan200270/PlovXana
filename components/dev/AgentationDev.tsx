"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);

const DEFAULT_SYNC = "http://localhost:4747";

/**
 * Визуальные аннотации для агентов разработки. Только dev (см. условие ниже).
 * MCP-сервер: `npm run mcp:agentation` — порт по умолчанию 4747.
 */
export function AgentationDev(): ReactNode {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const endpoint =
    process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ?? DEFAULT_SYNC;

  return (
    <Agentation
      endpoint={endpoint}
      onSessionCreated={(sessionId) => {
        console.debug("[Agentation] session:", sessionId);
      }}
    />
  );
}
