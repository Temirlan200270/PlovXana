import type { Metadata } from "next";
import Link from "next/link";
import { getLegalInfo } from "@/lib/legal";
import { LanguageTabs } from "@/components/legal/LanguageTabs";

export const metadata: Metadata = {
  title: "Условия использования / Terms of Service",
  description:
    "Условия использования сайта и сервиса ИП АБИШЕВ для обработки заказов в кафе.",
};

export default function TermsPage() {
  const legal = getLegalInfo();
  const effectiveDateRu = "26 апреля 2026 г.";
  const effectiveDateEn = "26 April 2026";

  return (
    <main className="min-h-screen bg-[#0f172a] px-6 py-16 text-[#e2e8f0] md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight md:text-5xl">
          Условия использования / Terms of Service
        </h1>
        <p className="mt-4 max-w-[80ch] text-sm text-slate-300">
          Документ регулирует использование сайта {legal.domain} и сервиса обработки заказов
          для кафе. / This document governs use of {legal.domain} and the cafe
          order-processing service.
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
                    Настоящие Условия использования (далее — «Условия») регулируют доступ к
                    сайту <span className="whitespace-nowrap">{legal.domain}</span> и
                    использование связанных сервисов (далее — «Сервис»). Сервис управляется{" "}
                    <strong>{legal.operatorNameRu}</strong> под брендом{" "}
                    <strong>{legal.brandName}</strong>.
                  </p>
                  <p>
                    Разделы ниже описывают правила использования сайта, отправки запросов,
                    работы со сторонними сервисами и связи с оператором.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold">1. Оператор и область действия</h2>
                  <p className="mt-3">
                    Оператор Сервиса — {legal.operatorNameRu}
                    {legal.iinBin ? ` (БИН/ИИН: ${legal.iinBin})` : ""}, адрес: {legal.addressLine}.
                    Условия применяются к сайту, публичным страницам, формам связи и
                    обращениям по внедрению решений для обработки заказов в кафе.
                  </p>
                </section>

              <section>
                <h2 className="text-xl font-semibold">2. Законное использование</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Вы обязуетесь использовать Сервис только в законных целях.</li>
                  <li>
                    Запрещены действия, направленные на нарушение работы, безопасности
                    или доступности Сервиса.
                  </li>
                  <li>
                    Если вы действуете от имени организации, вы подтверждаете наличие
                    полномочий для такого обращения.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">3. Запросы и данные пользователя</h2>
                <p className="mt-3">
                  При отправке коммерческих обращений, заявок на внедрение, запросов
                  демонстрации или сообщений через формы связи вы отвечаете за точность
                  предоставленной информации.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">4. Информация о сервисе</h2>
                <p className="mt-3">
                  Описания функций, материалов и возможностей на сайте носят информационный
                  характер. Конкретные условия внедрения, поддержки и оплаты согласуются
                  отдельно, если иное прямо не указано на сайте.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">5. Сторонние сервисы</h2>
                <p className="mt-3">
                  Сервис может использовать сторонние технические и инфраструктурные
                  сервисы, необходимые для работы сайта, безопасности и обработки
                  обращений. Использование таких сервисов регулируется условиями
                  соответствующих поставщиков.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">6. Интеллектуальная собственность</h2>
                <p className="mt-3">
                  Контент, бренд, дизайн и функциональность Сервиса принадлежат оператору
                  или правообладателям. Копирование, изменение и распространение без
                  разрешения запрещены, кроме случаев, предусмотренных законом.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">7. Доступность и изменения</h2>
                <p className="mt-3">
                  Мы можем обновлять функции, материалы и техническую инфраструктуру
                  Сервиса, а также временно ограничивать доступ в период технических
                  работ, для безопасности или по требованиям законодательства.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">8. Конфиденциальность</h2>
                <p className="mt-3">
                  Обработка персональных данных описана в{" "}
                  <Link
                    href="/privacy?lang=ru"
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    Политике конфиденциальности
                  </Link>
                  . Отправляя запрос через сайт, вы понимаете, что данные будут
                  использованы для обработки обращения и обеспечения работы Сервиса.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">9. Ограничение ответственности</h2>
                <p className="mt-3">
                  Сервис предоставляется «как есть» и «по мере доступности». В пределах,
                  допускаемых законом, оператор не несёт ответственности за косвенные
                  убытки, потерю данных или перерывы в работе.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">10. Применимое право и контакты</h2>
                <p className="mt-3">
                  Настоящие Условия регулируются законодательством Республики Казахстан.
                  По вопросам об условиях использования:{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    {legal.publicEmail}
                  </a>
                  . Актуальная версия Условий размещается на этой странице.
                </p>
              </section>

              <p className="text-xs text-slate-400">Дата вступления в силу: {effectiveDateRu}</p>
            </div>
            }
            en={
              <div className="space-y-8 text-sm leading-7 text-slate-200">
                <section className="space-y-3">
                  <p>
                    These Terms of Service (&quot;Terms&quot;) govern your access to and
                    use of <span className="whitespace-nowrap">{legal.domain}</span> and
                    related services (the &quot;Service&quot;). The Service is operated by{" "}
                    <strong>{legal.operatorNameEn}</strong> under the brand{" "}
                    <strong>{legal.brandName}</strong>.
                  </p>
                  <p>
                    The sections below describe website use, request submission, third-party
                    services, and how to contact the operator.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold">1. Operator and Scope</h2>
                  <p className="mt-3">
                    The operator of the Service is <strong>{legal.operatorNameEn}</strong> (
                    <span className="whitespace-nowrap">{legal.operatorNameRu}</span>)
                    {legal.iinBin ? (
                      <span className="whitespace-nowrap"> (BIN/IIN: {legal.iinBin})</span>
                    ) : null}
                    , address:{" "}
                    <span className="whitespace-nowrap">{legal.addressLineEn}</span>. These
                    Terms apply to the website, public pages, contact forms, and related
                    requests for cafe order-processing solutions.
                  </p>
                </section>

              <section>
                <h2 className="text-xl font-semibold">2. Lawful Use</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>You may use the Service only for lawful purposes.</li>
                  <li>
                    You agree not to disrupt, overload, or compromise the security or
                    availability of the Service.
                  </li>
                  <li>
                    If you act on behalf of an organization, you confirm that you are
                    authorized to do so.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">3. Requests and User Information</h2>
                <p className="mt-3">
                  If you submit commercial inquiries, implementation requests, demo
                  requests, or messages via contact forms, you are responsible for the
                  accuracy of the information you provide.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">4. Service Information</h2>
                <p className="mt-3">
                  Descriptions of features, materials, and capabilities on the website are
                  provided for informational purposes. Specific implementation, support,
                  and payment terms are agreed separately unless expressly stated otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
                <p className="mt-3">
                  The Service may use third-party technical and infrastructure services
                  required for website operation, security, and request handling.
                  Third-party services are governed by their own terms and
                  policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                <p className="mt-3">
                  The content, brand, design, and functionality of the Service are owned
                  by the Operator or its licensors. You may not copy, modify, or
                  redistribute any part of the Service without permission, except as
                  permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">7. Availability and Changes</h2>
                <p className="mt-3">
                  We may update features, materials, and technical infrastructure, and may
                  temporarily limit access during maintenance, for security reasons, or to
                  comply with applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">8. Privacy and Data Protection</h2>
                <p className="mt-3">
                  Processing of personal data is described in the{" "}
                  <Link
                    href="/privacy?lang=en"
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    Privacy Policy
                  </Link>
                  . By submitting a request through the website, you understand that the
                  information will be used to handle the request and operate the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">9. Disclaimer and Limitation of Liability</h2>
                <p className="mt-3">
                  The Service is provided on an &quot;as is&quot; and &quot;as
                  available&quot; basis. To the maximum extent permitted by applicable law,
                  the Operator is not liable for indirect damages, loss of data, or
                  interruptions of service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">10. Governing Law and Contact</h2>
                <p className="mt-3">
                  These Terms are governed by the laws of the Republic of Kazakhstan. For
                  questions about these Terms, contact{" "}
                  <a
                    href={`mailto:${legal.publicEmail}`}
                    className="whitespace-nowrap text-[#22c55e] hover:text-[#4ade80]"
                  >
                    {legal.publicEmail}
                  </a>
                  . The current version of these Terms is published on this page.
                </p>
              </section>

              <p className="text-xs text-slate-400">Effective date: {effectiveDateEn}</p>
            </div>
            }
          />
        </div>
      </div>
    </main>
  );
}
