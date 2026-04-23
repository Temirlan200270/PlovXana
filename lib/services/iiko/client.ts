import type { Result } from "@/lib/utils/result";
import { fail, ok } from "@/lib/utils/result";

const IIKO_BASE_URL = "https://api-ru.iiko.services/api/1";

type AccessTokenResponse = Readonly<{ token: string }>;

export class IikoClient {
  private readonly apiLogin: string;

  public constructor() {
    const login = process.env.IIKO_API_LOGIN?.trim();
    if (!login) {
      throw new Error("IIKO_API_LOGIN is not set in environment variables");
    }
    this.apiLogin = login;
  }

  /**
   * Получение токена.
   * Next.js 15 fetch не кэшируется по умолчанию — кэшируем токен на ~50 минут.
   */
  private async getToken(): Promise<string> {
    const response = await fetch(`${IIKO_BASE_URL}/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiLogin: this.apiLogin }),
      next: { revalidate: 3000 },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Iiko Auth Failed: ${response.status} ${response.statusText} ${text}`.trim(),
      );
    }

    const data = (await response.json()) as unknown;
    if (
      typeof data !== "object" ||
      data === null ||
      !("token" in data) ||
      typeof (data as AccessTokenResponse).token !== "string" ||
      !(data as AccessTokenResponse).token.trim()
    ) {
      throw new Error("Iiko Auth Failed: invalid token payload");
    }

    return (data as AccessTokenResponse).token;
  }

  /**
   * Универсальный POST к iiko.
   * - меню/стоп-листы кэшируем на 5 минут
   * - для write-path (создание заказа) будем использовать no-store отдельным методом
   */
  public async post<T>(
    endpoint: string,
    body: Readonly<Record<string, unknown>> = {},
  ): Promise<Result<T>> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${IIKO_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`[Iiko API Error] ${endpoint}:`, errorText);
        return fail(`Ошибка внешнего API: ${response.status}`);
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unknown iiko client error";
      console.error(`[Iiko Client Error] ${endpoint}:`, message);
      return fail(message);
    }
  }

  /** Для write-path: без кэша (например, создание заказа). */
  public async postNoStore<T>(
    endpoint: string,
    body: Readonly<Record<string, unknown>> = {},
  ): Promise<Result<T>> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${IIKO_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`[Iiko API Error] ${endpoint}:`, errorText);
        return fail(`Ошибка внешнего API: ${response.status}`);
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unknown iiko client error";
      console.error(`[Iiko Client Error] ${endpoint}:`, message);
      return fail(message);
    }
  }
}

let cachedClient: IikoClient | null = null;

/**
 * Ленивая инициализация, чтобы `next build` не падал без IIKO_API_LOGIN.
 * В runtime (при реальном вызове синка) переменная должна быть задана.
 */
export function getIikoClient(): IikoClient {
  if (cachedClient) return cachedClient;
  cachedClient = new IikoClient();
  return cachedClient;
}

