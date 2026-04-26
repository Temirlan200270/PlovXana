import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePublicCopy } from "@/lib/services/home-content";
import { buildHomeMetadata } from "@/lib/seo/seo";
import { buildOrganizationJsonLd } from "@/lib/seo/schema";
import { getTenant } from "@/lib/tenant/getTenant";

export const revalidate = 60;

type SiteLang = "ru" | "en";
type PageProps = { searchParams: Promise<{ lang?: string }> };

function t(lang: SiteLang) {
  if (lang === "en") {
    return {
      heroEyebrow: "ORDER MANAGEMENT SERVICE · CAFES",
      heroTitle: "Order management service for cafes",
      heroSub:
        "We help cafes accept, structure, and process guest orders faster without complex systems or lengthy staff training.",
      identityLine:
        "IE Abishev provides an order management service for cafes that speeds up processing and reduces staff workload.",
      ctaPrimary: "Contact",
      ctaSecondary: "How it works",
      solvedTitle: "What the service solves",
      solvedItems: [
        "Faster order processing",
        "Lower manual load on staff",
        "Fewer order handling mistakes",
        "Better guest service quality",
      ],
      audienceTitle: "Who the service is for",
      audienceItems: [
        "Cafes",
        "Quick-service food points",
        "Small food businesses",
        "Cafe kitchens with delivery",
      ],
      featuresTitle: "What the service does",
      features: [
        "Receive order requests from guests",
        "Staff order confirmations",
        "Provide order status updates",
        "Order processing",
      ],
      howTitle: "How it works",
      steps: [
        "Guest places an order request",
        "The request is structured",
        "Staff confirms and updates status",
      ],
      businessLayerTitle: "How the service fits cafe operations",
      businessLayerItems: [
        "We connect to the cafe's existing order process",
        "Orders are handled through a standard cafe workflow",
        "Staff stays in control of confirmations and status updates",
      ],
      processNote:
        "The service works within the cafe's existing order-handling process.",
      demoTitle: "Order handling scenario",
      demoNote: "Example of a typical cafe order workflow.",
      demoLines: [
        "Guest: Can I get the menu?",
        "Cafe: Provides menu options",
        "Guest: One combo, please",
        "Staff: Confirms order and updates status",
      ],
      aboutTitle: "Service for cafes",
      aboutBody:
        "We provide an order management service for cafes in Kazakhstan. Service operator: Individual Entrepreneur Abishev.",
      contactTitle: "Contact",
      contactFormTitle: "Send request",
      contactFormSub: "Describe your cafe format and your current order flow.",
      fieldName: "Full name",
      fieldCompany: "Cafe / business name",
      fieldEmail: "Email",
      fieldPhone: "Phone",
      fieldMessage: "Message",
      submitLabel: "Send",
      placeholderName: "Your name",
      placeholderCompany: "Business name",
      placeholderEmail: "name@domain.com",
      placeholderPhone: "+7 7xx xxx xx xx",
      placeholderMessage: "Tell us what process you want to improve",
      cityLabel: "City / Country",
      phoneLabel: "Phone",
      hoursLabel: "Working hours",
    };
  }

  return {
    heroEyebrow: "СЕРВИС ОБРАБОТКИ ЗАКАЗОВ · КАФЕ",
    heroTitle: "Сервис приёма и обработки заказов для кафе",
    heroSub:
      "Помогаем кафе быстрее принимать, структурировать и обрабатывать заказы без сложных систем и долгого обучения персонала.",
    identityLine:
      "ИП Абишев предоставляет сервис обработки заказов для кафе, который ускоряет работу с заявками и снижает нагрузку на персонал.",
    ctaPrimary: "Контакты",
    ctaSecondary: "Как работает",
    solvedTitle: "Что решает сервис",
    solvedItems: [
      "Ускоряет обработку заказов",
      "Снижает ручную нагрузку на персонал",
      "Сокращает ошибки при работе с заказами",
      "Улучшает качество обслуживания гостей",
    ],
    audienceTitle: "Для кого сервис",
    audienceItems: [
      "Кафе",
      "Точки быстрого питания",
      "Небольшие заведения",
      "Кухни кафе с доставкой",
    ],
    featuresTitle: "Что входит в сервис",
    features: [
      "Приём заказов от гостей",
      "Подтверждение заказов сотрудником",
      "Статусы по заказам",
      "Обработка заказов",
    ],
    howTitle: "Как работает",
    steps: [
      "Гость отправляет запрос на заказ",
      "Заявка структурируется",
      "Сотрудник подтверждает и обновляет статус",
    ],
    businessLayerTitle: "Как сервис встраивается в работу кафе",
    businessLayerItems: [
      "Подключаемся к текущему процессу приёма заказов в кафе",
      "Заказы обрабатываются по стандартному рабочему процессу кафе",
      "Контроль подтверждений и статусов остаётся у персонала",
    ],
    processNote:
      "Сервис работает в рамках существующего процесса приёма и обработки заказов в кафе.",
    demoTitle: "Сценарий обработки заказа",
    demoNote: "Пример типичного заказа в кафе.",
    demoLines: [
      "Гость: Хочу меню",
      "Кафе: Предлагает варианты меню",
      "Гость: Один комбо",
      "Сотрудник: Подтверждает заказ и обновляет статус",
    ],
    aboutTitle: "Сервис для кафе",
    aboutBody:
      "Мы предоставляем сервис обработки заказов для кафе в Казахстане. Оператор сервиса — ИП Абишев.",
    contactTitle: "Контакты",
    contactFormTitle: "Оставить заявку",
    contactFormSub: "Опишите формат заведения и как сейчас устроен приём заказов.",
    fieldName: "Имя",
    fieldCompany: "Кафе / название бизнеса",
    fieldEmail: "Email",
    fieldPhone: "Телефон",
    fieldMessage: "Сообщение",
    submitLabel: "Отправить",
    placeholderName: "Как к вам обращаться",
    placeholderCompany: "Название заведения",
    placeholderEmail: "name@domain.com",
    placeholderPhone: "+7 7xx xxx xx xx",
    placeholderMessage: "Расскажите, какой процесс хотите улучшить",
    cityLabel: "Город / Страна",
    phoneLabel: "Телефон",
    hoursLabel: "Часы работы",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  return buildHomeMetadata(tenant, copy);
}

export default async function HomePage({ searchParams }: PageProps) {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  const p = await searchParams;
  const lang: SiteLang = p.lang === "en" ? "en" : "ru";
  const text = t(lang);
  const email = copy.contacts.publicEmail?.trim() || "info@plovxanapvl.com";
  const countryName = lang === "en" ? "Kazakhstan" : "Казахстан";

  return (
    <main className="relative min-h-screen bg-[#0f172a] text-[#e2e8f0]">
      <JsonLd data={buildOrganizationJsonLd(tenant, copy)} />

      <section className="border-b border-slate-700/50 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22c55e]">{text.heroEyebrow}</p>
          <h1 className="mt-5 max-w-[24ch] text-3xl font-semibold leading-tight md:text-5xl">{text.heroTitle}</h1>
          <p className="mt-5 max-w-[70ch] text-slate-300">{text.heroSub}</p>
          <p className="mt-4 max-w-[70ch] rounded-md border border-slate-700 bg-[#1e293b] px-4 py-3 text-sm text-slate-200">
            {text.identityLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-md bg-[#22c55e] px-5 py-2.5 text-sm font-semibold text-[#0f172a]">
              {text.ctaPrimary}
            </a>
            <a href="#how" className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200">
              {text.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.featuresTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {text.features.map((item) => (
              <li key={item} className="rounded-lg border border-slate-700 bg-[#1e293b] p-4 text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.solvedTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {text.solvedItems.map((item) => (
              <li key={item} className="rounded-lg border border-slate-700 bg-[#1e293b] p-4 text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.audienceTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {text.audienceItems.map((item) => (
              <li key={item} className="rounded-lg border border-slate-700 bg-[#1e293b] p-4 text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.howTitle}</h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {text.steps.map((step, idx) => (
              <li key={step} className="rounded-lg border border-slate-700 bg-[#1e293b] p-4 text-slate-200">
                <span className="text-xs text-[#22c55e]">0{idx + 1}</span>
                <p className="mt-2">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-slate-400">{text.processNote}</p>
        </div>
      </section>

      <section className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.businessLayerTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {text.businessLayerItems.map((item) => (
              <li key={item} className="rounded-lg border border-slate-700 bg-[#1e293b] p-4 text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="demo" className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.demoTitle}</h2>
          <p className="mt-3 text-sm text-slate-400">{text.demoNote}</p>
          <div className="mt-6 max-w-md rounded-lg border border-slate-700 bg-[#1e293b] p-4">
            <div className="space-y-2 text-sm">
              <p className="rounded bg-slate-700/70 px-3 py-2">{text.demoLines[0]}</p>
              <p className="rounded border border-[#22c55e]/30 px-3 py-2">{text.demoLines[1]}</p>
              <p className="rounded bg-slate-700/70 px-3 py-2">{text.demoLines[2]}</p>
              <p className="rounded border border-[#22c55e]/30 px-3 py-2">{text.demoLines[3]}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-slate-700/50 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.aboutTitle}</h2>
          <p className="mt-4 max-w-[80ch] text-slate-300">{text.aboutBody}</p>
        </div>
      </section>

      <section id="contact" className="px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-2xl font-semibold">{text.contactTitle}</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4">
              <div className="rounded-lg border border-slate-700 bg-[#1e293b] p-4">
                <div className="text-xs text-slate-400">{text.cityLabel}</div>
                <div className="mt-2">{copy.contacts.addressLocality}, {countryName}</div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#1e293b] p-4">
                <div className="text-xs text-slate-400">{text.phoneLabel}</div>
                <a href={`tel:${copy.contacts.bookingPhoneE164}`} className="mt-2 block hover:text-[#22c55e]">
                  {copy.contacts.bookingPhoneDisplay}
                </a>
                <a href={`mailto:${email}`} className="mt-2 block text-[#22c55e] hover:text-[#4ade80]">
                  {email}
                </a>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#1e293b] p-4">
                <div className="text-xs text-slate-400">{text.hoursLabel}</div>
                <div className="mt-2">{copy.contacts.hoursLine}</div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-[#1e293b] p-5 md:p-6">
              <h3 className="text-lg font-semibold">{text.contactFormTitle}</h3>
              <p className="mt-2 text-sm text-slate-400">{text.contactFormSub}</p>
              <form
                className="mt-5 grid gap-4"
                action={`mailto:${email}`}
                method="post"
                encType="text/plain"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">{text.fieldName}</span>
                    <input
                      name="name"
                      required
                      placeholder={text.placeholderName}
                      className="w-full rounded-md border border-slate-600 bg-[#0f172a] px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-[#22c55e]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">{text.fieldCompany}</span>
                    <input
                      name="company"
                      placeholder={text.placeholderCompany}
                      className="w-full rounded-md border border-slate-600 bg-[#0f172a] px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-[#22c55e]"
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">{text.fieldEmail}</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={text.placeholderEmail}
                      className="w-full rounded-md border border-slate-600 bg-[#0f172a] px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-[#22c55e]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">{text.fieldPhone}</span>
                    <input
                      name="phone"
                      placeholder={text.placeholderPhone}
                      className="w-full rounded-md border border-slate-600 bg-[#0f172a] px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-[#22c55e]"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">{text.fieldMessage}</span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder={text.placeholderMessage}
                    className="w-full rounded-md border border-slate-600 bg-[#0f172a] px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-[#22c55e]"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-[#4ade80] md:w-auto"
                >
                  {text.submitLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
