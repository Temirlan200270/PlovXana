import type { Metadata } from "next";
import { getLegalInfo } from "@/lib/legal";
import { LanguageTabs } from "@/components/legal/LanguageTabs";

export const metadata: Metadata = {
  title: "Политика конфиденциальности / Privacy Policy",
  description:
    "Политика конфиденциальности ИП АБИШЕВ для сайта и сервиса обработки заказов для кафе и ресторанов.",
};

export default function PrivacyPage() {
  const legal = getLegalInfo();
  const lastUpdatedRu = "26 апреля 2026 г.";
  const lastUpdatedEn = "26 April 2026";

  return (
    <main className="min-h-screen bg-[#0f172a] px-6 py-16 text-[#e2e8f0] md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight md:text-5xl">
          Политика конфиденциальности / Privacy Policy
        </h1>
        <p className="mt-4 max-w-[80ch] text-sm text-slate-300">
          Документ описывает обработку персональных данных на сайте {legal.domain} и в
          связанных обращениях по сервису обработки заказов для кафе. / This document
          describes personal data processing on {legal.domain} and related requests for
          the cafe order-processing service.
        </p>

        <div className="mt-10 rounded-xl border border-slate-700 bg-[#1e293b] p-6 md:p-8">
          <LanguageTabs
            defaultLang="ru"
            showControls={false}
            useUrlLang
            ru={
              <div className="space-y-8 text-sm leading-7 text-slate-200">
                <section className="space-y-3">
                  <p>
                    Настоящая Политика конфиденциальности описывает, как сервис{" "}
                    <strong>{legal.brandName}</strong>, управляемый{" "}
                    <strong>{legal.operatorNameRu}</strong>, обрабатывает информацию при
                    использовании сайта <span className="whitespace-nowrap">{legal.domain}</span> и
                    при обращении за внедрением решений для обработки заказов в кафе.
                  </p>
                </section>

              <p className="text-slate-300">
                Разделы ниже описывают категории данных, цели обработки и права пользователя в
                рамках применимого законодательства Республики Казахстан.
              </p>

              <section>
                <h2 className="text-xl font-semibold">1. Оператор</h2>
                <p className="mt-3">
                  Оператор персональных данных — {legal.operatorNameRu}
                  {legal.iinBin ? ` (БИН/ИИН: ${legal.iinBin})` : ""}, адрес: {legal.addressLine}.
                  Для международных сервисов оператор может указываться на английском как{" "}
                  <span className="whitespace-nowrap">{legal.operatorNameEn}</span>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">2. Какие данные мы можем обрабатывать</h2>
                <p className="mt-3">Мы можем обрабатывать следующие категории информации:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    контактные данные и данные обращений: имя, телефон, email (если указан), дата
                    и время обращения, содержание сообщения;
                  </li>
                  <li>
                    технические данные: IP-адрес, тип браузера, устройство, язык, время посещения,
                    просмотренные страницы;
                  </li>
                  <li>cookie и аналогичные технические идентификаторы, необходимые для работы сайта.</li>
                </ul>
                <p className="mt-3">
                  Мы не собираем намеренно данные банковских карт, биометрию и специальные категории
                  персональных данных.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">3. Цели обработки</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>предоставление и поддержание работы Сервиса;</li>
                  <li>связь с вами и обработка запросов;</li>
                  <li>улучшение функциональности и пользовательского опыта;</li>
                  <li>обеспечение безопасности и предотвращение злоупотреблений;</li>
                  <li>исполнение требований применимого законодательства.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">4. Правовые основания</h2>
                <p className="mt-3">
                  Обработка может осуществляться на основании вашего согласия (например,
                  при отправке формы), а также на иных основаниях, предусмотренных
                  законодательством Республики Казахстан. Отозвать согласие можно,
                  связавшись с нами по контактам в разделе 9.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">5. Сроки хранения</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    данные запросов — до <strong>90 дней</strong>, после чего удаляются
                    или обезличиваются, если иное не требуется законом;
                  </li>
                  <li>
                    технические логи безопасности — до <strong>30 дней</strong>;
                  </li>
                  <li>
                    cookie — в соответствии с настройками браузера, обычно до{" "}
                    <strong>365 дней</strong>.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">6. Передача третьим лицам</h2>
                <p className="mt-3">
                  Мы не продаём персональные данные. Передача возможна только:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    поставщикам инфраструктуры (хостинг, CDN, аналитика) — в объёме,
                    необходимом для работы Сервиса;
                  </li>
                  <li>
                    государственным органам — при наличии законных оснований и
                    надлежащих запросов.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">7. Cookie</h2>
                <p className="mt-3">
                  Мы используем необходимые cookie для работы сайта и безопасности.
                  Отключение cookie в браузере может ограничить часть функций.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">8. Ваши права</h2>
                <p className="mt-3">
                  В пределах, предусмотренных применимым правом, вы можете запросить:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>доступ к персональным данным;</li>
                  <li>исправление или удаление;</li>
                  <li>отзыв согласия;</li>
                  <li>подачу жалобы в уполномоченный орган.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">9. Контакты</h2>
                <p className="mt-3">
                  По вопросам конфиденциальности:{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">10. Изменения политики</h2>
                <p className="mt-3">
                  Мы можем обновлять настоящую Политику. Актуальная версия всегда
                  размещена на этой странице; дата последнего обновления указана ниже.
                </p>
              </section>

              <p className="text-xs text-slate-400">Последнее обновление: {lastUpdatedRu}</p>
            </div>
            }
            en={
              <div className="space-y-8 text-sm leading-7 text-slate-200">
                <section className="space-y-3">
                  <p>
                    This Privacy Policy explains how{" "}
                    <strong>{legal.brandName}</strong>, operated by{" "}
                    <strong>{legal.operatorNameEn}</strong> ({legal.operatorNameRu}), processes
                    information when you use our website{" "}
                    <span className="whitespace-nowrap">{legal.domain}</span> or request
                    order-processing solutions for cafes.
                  </p>
                </section>

              <p className="text-slate-300">
                The sections below describe categories of data, processing purposes, and user
                rights under the applicable laws of the Republic of Kazakhstan.
              </p>

              <section>
                <h2 className="text-xl font-semibold">1. Operator</h2>
                <p className="mt-3">
                  The operator responsible for processing personal data is{" "}
                  <strong>{legal.operatorNameEn}</strong> (
                  <span className="whitespace-nowrap">{legal.operatorNameRu}</span>)
                  {legal.iinBin ? (
                    <span className="whitespace-nowrap"> (BIN/IIN: {legal.iinBin})</span>
                  ) : null}
                  , address:{" "}
                  <span className="whitespace-nowrap">{legal.addressLine}</span>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">2. Information we collect</h2>
                <p className="mt-3">We may collect the following categories of information:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    contact/request details: name, phone number, email (if provided), timestamps,
                    and details submitted in your request;
                  </li>
                  <li>
                    usage data: IP address, browser type, device information, language, timestamps,
                    and visited pages;
                  </li>
                  <li>
                    cookies and similar technical identifiers required for website functionality.
                  </li>
                </ul>
                <p className="mt-3">
                  We do <strong>not</strong> intentionally collect payment card details,
                  biometric data, or special categories of personal data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">3. How we use information</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>To provide and maintain the Service.</li>
                  <li>To communicate with you and respond to requests.</li>
                  <li>To improve functionality and user experience.</li>
                  <li>To ensure security and prevent fraud or abuse.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">4. Legal basis</h2>
                <p className="mt-3">
                  Where required, we process personal data based on your consent (for
                  example, when you submit a request), as well as other grounds provided
                  by the laws of the Republic of Kazakhstan. You may withdraw consent by
                  contacting us using the details in section 9.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">5. Data retention</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Request details are retained for up to <strong>90 days</strong>,
                    then deleted or anonymized unless a longer retention is required by
                    law.
                  </li>
                  <li>
                    Security and technical logs are retained for up to{" "}
                    <strong>30 days</strong>.
                  </li>
                  <li>
                    Cookies are retained according to your browser settings, generally
                    up to <strong>365 days</strong>.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">6. Sharing of information</h2>
                <p className="mt-3">
                  We do not sell personal data. We may share information only:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    With service providers (hosting, analytics, infrastructure) strictly
                    as necessary to operate the Service.
                  </li>
                  <li>
                    With authorities when required by applicable law and valid requests.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">7. Cookies</h2>
                <p className="mt-3">
                  We use essential cookies to support website functionality and security.
                  Disabling cookies in your browser may reduce functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">8. Your rights</h2>
                <p className="mt-3">
                  Depending on applicable law, you may request:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>access to your personal data;</li>
                  <li>correction or deletion;</li>
                  <li>withdrawal of consent;</li>
                  <li>submitting a complaint to the relevant data protection authority.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">9. Contact</h2>
                <p className="mt-3">
                  For privacy-related requests, contact{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">10. Changes to this policy</h2>
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. The latest version
                  will always be published on this page and the &quot;Last updated&quot;
                  date will be adjusted.
                </p>
              </section>

              <p className="text-xs text-slate-400">Last updated: {lastUpdatedEn}</p>
            </div>
            }
          />
        </div>
      </div>
    </main>
  );
}
