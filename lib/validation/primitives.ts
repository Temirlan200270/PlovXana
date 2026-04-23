import { z } from "zod";

/**
 * Нормативные примитивы (согласованы с zod_schemas.md §1).
 * Единая точка правды для UUID, телефона и slug в валидации на границе.
 */

/** UUID (строковый идентификатор сущностей БД / API). */
export const IdSchema = z.string().uuid({
  message: "Некорректный идентификатор (ожидается UUID).",
});

/**
 * E.164-подобный номер: опциональный «+», затем 1–15 цифр, без пробелов.
 * Сообщения — для серверных ответов и форм на RU.
 */
export const E164_PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

export const PhoneSchema = z
  .string()
  .trim()
  .regex(
    E164_PHONE_REGEX,
    "Неверный формат телефона (например: +77771234567)",
  );

/** Slug тенанта в URL: строчные латинские буквы, цифры, дефис. */
export const TenantSlugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Некорректный slug тенанта");
