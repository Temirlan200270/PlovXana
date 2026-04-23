import { z } from "zod";
import type { Result } from "@/lib/utils/result";
import { fail, ok } from "@/lib/utils/result";
import { getIikoClient } from "./client";

// DTO
export type IikoOrganization = Readonly<{
  id: string;
  name: string;
  code?: string;
}>;

export type IikoTerminalGroup = Readonly<{
  id: string;
  organizationId: string;
  name: string;
  address: string;
}>;

export type IikoProduct = Readonly<{
  id: string;
  name: string;
  description?: string;
  price: number;
  imageLinks: string[];
  parentGroup: string | null;
  isDeleted: boolean;
}>;

export type IikoCategory = Readonly<{
  id: string;
  name: string;
  parentGroup: string | null;
  isDeleted: boolean;
}>;

const IikoOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string().optional(),
});

const OrganizationsResponseSchema = z.object({
  organizations: z.array(IikoOrganizationSchema),
});

const TerminalGroupItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string().optional(),
});

const TerminalGroupsWrapperSchema = z.object({
  organizationId: z.string().uuid(),
  items: z.array(TerminalGroupItemSchema).optional(),
});

const TerminalGroupsResponseSchema = z.object({
  terminalGroups: z.array(TerminalGroupsWrapperSchema).optional(),
});

const IikoGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  parentGroup: z.string().uuid().nullable().optional(),
  isDeleted: z.boolean().optional(),
});

const IikoProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  type: z.string().optional(),
  parentGroup: z.string().uuid().nullable().optional(),
  isDeleted: z.boolean().optional(),
  imageLinks: z.array(z.string()).optional(),
  sizePrices: z
    .array(
      z.object({
        price: z
          .object({
            currentPrice: z.number().optional().nullable(),
          })
          .optional(),
      }),
    )
    .optional(),
});

const NomenclatureResponseSchema = z.object({
  groups: z.array(IikoGroupSchema).optional(),
  products: z.array(IikoProductSchema).optional(),
});

/**
 * Аналог `list_iiko_organizations.py`
 */
export async function getOrganizations(): Promise<Result<IikoOrganization[]>> {
  const res = await getIikoClient().post<unknown>("/organizations", {
    returnAdditionalInfo: false,
    includeDisabled: false,
  });

  if (!res.success) return res;

  const parsed = OrganizationsResponseSchema.safeParse(res.data);
  if (!parsed.success) {
    return fail("iiko: некорректный ответ organizations");
  }

  return ok(parsed.data.organizations);
}

/**
 * Аналог `list_iiko_terminal_groups.py`
 */
export async function getTerminalGroups(
  organizationIds: ReadonlyArray<string>,
): Promise<Result<IikoTerminalGroup[]>> {
  const ids = organizationIds
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  if (ids.length === 0) {
    return ok([]);
  }

  const res = await getIikoClient().post<unknown>("/terminal_groups", {
    organizationIds: ids,
    includeDisabled: false,
  });

  if (!res.success) return res;

  const parsed = TerminalGroupsResponseSchema.safeParse(res.data);
  if (!parsed.success) {
    return fail("iiko: некорректный ответ terminal_groups");
  }

  const groups: IikoTerminalGroup[] = [];
  for (const w of parsed.data.terminalGroups ?? []) {
    for (const tg of w.items ?? []) {
      groups.push({
        id: tg.id,
        organizationId: w.organizationId,
        name: tg.name,
        address: tg.address ?? "",
      });
    }
  }

  return ok(groups);
}

/**
 * Получение номенклатуры (меню): iiko -> плоские DTO.
 */
export async function getMenu(organizationId: string): Promise<
  Result<{ categories: IikoCategory[]; products: IikoProduct[] }>
> {
  const res = await getIikoClient().post<unknown>("/nomenclature", {
    organizationId,
    startRevision: 0,
  });

  if (!res.success) return res;

  const parsed = NomenclatureResponseSchema.safeParse(res.data);
  if (!parsed.success) {
    return fail("iiko: некорректный ответ nomenclature");
  }

  const categories: IikoCategory[] = (parsed.data.groups ?? [])
    .filter((g) => g.isDeleted !== true)
    .map((g) => ({
      id: g.id,
      name: g.name,
      parentGroup: g.parentGroup ?? null,
      isDeleted: g.isDeleted === true,
    }));

  const products: IikoProduct[] = (parsed.data.products ?? [])
    .filter((p) => p.isDeleted !== true)
    .filter((p) => (p.type ?? "Product") === "Product")
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? undefined,
      price: p.sizePrices?.[0]?.price?.currentPrice ?? 0,
      imageLinks: p.imageLinks ?? [],
      parentGroup: p.parentGroup ?? null,
      isDeleted: p.isDeleted === true,
    }));

  return ok({ categories, products });
}

