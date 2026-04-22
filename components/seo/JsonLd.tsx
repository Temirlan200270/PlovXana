export type JsonLdProps = {
  /** Объект schema.org (Restaurant, Menu, BreadcrumbList, etc.) */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * JSON-LD инъекция (server-first).
 * Важно: компонент рендерит <script type="application/ld+json"> в HTML ответа,
 * чтобы structured data был доступен без JS/гидрации.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

