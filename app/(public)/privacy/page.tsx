import type { Metadata } from "next";
import { getLegalInfo } from "@/lib/legal";
import { LanguageTabs } from "@/components/legal/LanguageTabs";

export const metadata: Metadata = {
  title: "Privacy Policy / Политика конфиденциальности",
  description:
    "Политика конфиденциальности и обработки данных для сайта plovxanapvl.com и связанных сервисов.",
};

export default function PrivacyPage() {
  const legal = getLegalInfo();
  const lastUpdatedRu = "26 апреля 2026 г.";
  const lastUpdatedEn = "26 April 2026";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-24">
      <h1 className="t-h1">Privacy Policy / Политика конфиденциальности</h1>

      <div className="mt-10">
        <LanguageTabs
          defaultLang="ru"
          ru={
            <div className="space-y-10">
              <section className="space-y-4">
                <p className="t-body text-cream-100/80">
                  Настоящая Политика конфиденциальности описывает, как{" "}
                  <strong className="text-cream-100">{legal.brandName}</strong> (далее
                  — «Сервис»), управляемый{" "}
                  <strong className="text-cream-100">{legal.operatorNameRu}</strong>,
                  обрабатывает информацию при использовании сайта{" "}
                  <span className="whitespace-nowrap">{legal.domain}</span> и связанных
                  сервисов.
                </p>
                <p className="t-body text-cream-100/80">
                  Для международных интеграций (включая Meta) оператор может указываться
                  на английском как:{" "}
                  <span className="whitespace-nowrap">{legal.operatorNameEn}</span>.
                </p>
                <p className="t-body text-cream-100/80">
                  Оператор персональных данных:{" "}
                  <strong className="text-cream-100">{legal.operatorNameRu}</strong>
                  {legal.iinBin ? (
                    <span className="whitespace-nowrap"> (БИН/ИИН: {legal.iinBin})</span>
                  ) : null}
                  , адрес:{" "}
                  <span className="whitespace-nowrap">{legal.addressLine}</span>.
                </p>
                <p className="t-body text-cream-100/80">
                  По вопросам обработки персональных данных:{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-gold-500 hover:text-gold-400"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <p className="t-body text-cream-100/80">
                Разделы ниже описывают типовые категории данных и цели обработки. Документ
                носит информационный характер и не заменяет обязательные уведомления,
                если они требуются применимым законодательством.
              </p>

              <section>
                <h2 className="t-h3">1. Оператор</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Оператором персональных данных является{" "}
                  <strong className="text-cream-100">{legal.operatorNameRu}</strong>
                  {legal.iinBin ? (
                    <span className="whitespace-nowrap"> (БИН/ИИН: {legal.iinBin})</span>
                  ) : null}
                  , адрес:{" "}
                  <span className="whitespace-nowrap">{legal.addressLine}</span>.
                </p>
              </section>

              <section>
                <h2 className="t-h3">2. Какие данные мы можем обрабатывать</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Мы можем обрабатывать следующие категории информации:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>
                    <strong className="text-cream-100">Контактные данные / данные
                    запросов:</strong> имя, номер телефона, адрес электронной почты (если
                    указан), дата/время и иные сведения, которые вы добровольно
                    передаёте через формы или коммуникации.
                  </li>
                  <li>
                    <strong className="text-cream-100">Технические данные:</strong> IP,
                    тип браузера, язык, сведения об устройстве, время посещения,
                    просмотренные страницы.
                  </li>
                  <li>
                    <strong className="text-cream-100">Cookie:</strong> технические
                    идентификаторы, необходимые для работы сайта (см. раздел 7).
                  </li>
                </ul>
                <p className="mt-4 t-body text-cream-100/80">
                  Мы <strong>не собираем намеренно</strong> реквизиты банковских карт,
                  паспортные данные, биометрию и специальные категории персональных
                  данных.
                </p>
              </section>

              <section>
                <h2 className="t-h3">3. Цели обработки</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>предоставление и поддержание работы Сервиса;</li>
                  <li>связь с вами и обработка запросов;</li>
                  <li>улучшение функциональности и пользовательского опыта;</li>
                  <li>обеспечение безопасности и предотвращение злоупотреблений;</li>
                  <li>исполнение требований применимого законодательства.</li>
                </ul>
              </section>

              <section>
                <h2 className="t-h3">4. Правовые основания</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Обработка может осуществляться на основании вашего согласия (например,
                  при отправке формы), а также на иных основаниях, предусмотренных
                  законодательством Республики Казахстан. Отозвать согласие можно,
                  связавшись с нами по контактам в разделе 9.
                </p>
              </section>

              <section>
                <h2 className="t-h3">5. Сроки хранения</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
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
                <h2 className="t-h3">6. Передача третьим лицам</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Мы не продаём персональные данные. Передача возможна только:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
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
                <h2 className="t-h3">7. Cookie</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Мы используем необходимые cookie для работы сайта и безопасности.
                  Отключение cookie в браузере может ограничить часть функций.
                </p>
              </section>

              <section>
                <h2 className="t-h3">8. Ваши права</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  В пределах, предусмотренных применимым правом, вы можете запросить:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>доступ к персональным данным;</li>
                  <li>исправление или удаление;</li>
                  <li>отзыв согласия;</li>
                  <li>подачу жалобы в уполномоченный орган.</li>
                </ul>
              </section>

              <section>
                <h2 className="t-h3">9. Контакты</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  По вопросам конфиденциальности:{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-gold-500 hover:text-gold-400"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="t-h3">10. Изменения политики</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Мы можем обновлять настоящую Политику. Актуальная версия всегда
                  размещена на этой странице; дата последнего обновления указана ниже.
                </p>
              </section>

              <p className="t-micro text-muted-400">Последнее обновление: {lastUpdatedRu}</p>
            </div>
          }
          en={
            <div className="space-y-10">
              <section className="space-y-4">
                <p className="t-body text-cream-100/80">
                  This Privacy Policy explains how{" "}
                  <strong className="text-cream-100">{legal.brandName}</strong> (the
                  &quot;Service&quot;), operated by{" "}
                  <strong className="text-cream-100">{legal.operatorNameEn}</strong> (
                  {legal.operatorNameRu}), collects, uses, and protects information when
                  you use our website{" "}
                  <span className="whitespace-nowrap">{legal.domain}</span> and related
                  services.
                </p>
                <p className="t-body text-cream-100/80">
                  Operator:{" "}
                  <strong className="text-cream-100">{legal.operatorNameEn}</strong>
                  {legal.iinBin ? (
                    <span className="whitespace-nowrap"> (BIN/IIN: {legal.iinBin})</span>
                  ) : null}
                  , address:{" "}
                  <span className="whitespace-nowrap">{legal.addressLine}</span>.
                </p>
                <p className="t-body text-cream-100/80">
                  For privacy-related requests, contact{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-gold-500 hover:text-gold-400"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <p className="t-body text-cream-100/80">
                The sections below describe common categories of information we may
                process and general purposes of processing. They are provided for
                transparency and do not replace any mandatory disclosures under
                applicable law.
              </p>

              <section>
                <h2 className="t-h3">1. Operator</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  The operator responsible for processing personal data is{" "}
                  <strong className="text-cream-100">{legal.operatorNameEn}</strong> (
                  <span className="whitespace-nowrap">{legal.operatorNameRu}</span>)
                  {legal.iinBin ? (
                    <span className="whitespace-nowrap"> (BIN/IIN: {legal.iinBin})</span>
                  ) : null}
                  , address:{" "}
                  <span className="whitespace-nowrap">{legal.addressLine}</span>.
                </p>
              </section>

              <section>
                <h2 className="t-h3">2. Information we collect</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  We may collect the following categories of information:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>
                    <strong className="text-cream-100">Contact/booking details:</strong>{" "}
                    name, phone number, email address (if provided), requested date/time
                    and other details you submit.
                  </li>
                  <li>
                    <strong className="text-cream-100">Usage data:</strong> IP address,
                    browser type, device information, language, timestamps, and pages
                    visited.
                  </li>
                  <li>
                    <strong className="text-cream-100">Cookies:</strong> technical
                    identifiers used to support website functionality (see section 7).
                  </li>
                </ul>
                <p className="mt-4 t-body text-cream-100/80">
                  We do <strong>not</strong> intentionally collect payment card details,
                  government IDs, biometric data, or special categories of personal data.
                </p>
              </section>

              <section>
                <h2 className="t-h3">3. How we use information</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>To provide and maintain the Service.</li>
                  <li>To communicate with you and respond to requests.</li>
                  <li>To improve functionality and user experience.</li>
                  <li>To ensure security and prevent fraud or abuse.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="t-h3">4. Legal basis</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Where required, we process personal data based on your consent (for
                  example, when you submit a request). You may withdraw consent by
                  contacting us using the details in section 9.
                </p>
              </section>

              <section>
                <h2 className="t-h3">5. Data retention</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
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
                <h2 className="t-h3">6. Sharing of information</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  We do not sell personal data. We may share information only:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
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
                <h2 className="t-h3">7. Cookies</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  We use essential cookies to support website functionality and security.
                  Disabling cookies in your browser may reduce functionality.
                </p>
              </section>

              <section>
                <h2 className="t-h3">8. Your rights</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  Depending on applicable law, you may request:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
                  <li>access to your personal data;</li>
                  <li>correction or deletion;</li>
                  <li>withdrawal of consent;</li>
                  <li>submitting a complaint to the relevant data protection authority.</li>
                </ul>
              </section>

              <section>
                <h2 className="t-h3">9. Contact</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  For privacy-related requests, contact{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-gold-500 hover:text-gold-400"
                  >
                    {legal.publicEmail}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="t-h3">10. Changes to this policy</h2>
                <p className="mt-4 t-body text-cream-100/80">
                  We may update this Privacy Policy from time to time. The latest version
                  will always be published on this page and the &quot;Last updated&quot;
                  date will be adjusted.
                </p>
              </section>

              <p className="t-micro text-muted-400">Last updated: {lastUpdatedEn}</p>
            </div>
          }
        />
      </div>
    </main>
  );
}
