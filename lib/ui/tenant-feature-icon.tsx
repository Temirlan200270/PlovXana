import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ChefHat,
  Clock,
  Coffee,
  Flame,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Utensils,
} from "lucide-react";

/**
 * Разрешённые имена иконок для блока фич лендинга (строка из `home_config` / пилот).
 * Не используем динамический import по произвольной строке — только whitelist.
 */
const TENANT_FEATURE_ICONS: Readonly<Record<string, LucideIcon>> = {
  ShieldCheck,
  Truck,
  Flame,
  Sparkles,
  Star,
  Heart,
  MapPin,
  Clock,
  Utensils,
  ChefHat,
  Coffee,
  Leaf,
  BadgeCheck,
};

export type TenantFeatureIconProps = {
  iconName: string;
  className?: string;
};

export function TenantFeatureIcon({
  iconName,
  className = "h-5 w-5 text-[color:var(--primary)]",
}: TenantFeatureIconProps) {
  const trimmed = iconName.trim();
  const Icon = TENANT_FEATURE_ICONS[trimmed] ?? Flame;
  return <Icon className={className} aria-hidden />;
}
