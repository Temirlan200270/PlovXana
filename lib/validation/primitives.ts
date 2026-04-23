import { z } from "zod";

/**
 * Нормативные примитивы (согласованы с zod_schemas.md §1).
 * Единая точка правды для UUID, телефона и slug в валидации на границе.
 */

/**
 * Идентификатор сущности — строка (string).
 * Источник истины — БД бота (PostgreSQL serial integer), приводится к строке
 * на границе чтения, чтобы UI не зависел от типа БД.
 */
export const IdSchema = z
  .union([z.string().min(1), z.number().int().nonnegative()])
  .transform((v) => String(v));

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
