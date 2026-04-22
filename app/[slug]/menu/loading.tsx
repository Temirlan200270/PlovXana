import { MenuSkeleton } from "@/components/menu/MenuSkeleton";
import { Section } from "@/components/ui/primitives/Section";

/** Heritage skeleton-страница меню: совпадает с layout `MenuPage` без TopNav (он рендерится сразу). */
export default function MenuLoading() {
  return (
    <main className="bg-umber-950">
      <Section texture="brick" className="min-h-screen">
        <MenuSkeleton />
      </Section>
    </main>
  );
}
