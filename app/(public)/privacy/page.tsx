import type { Metadata } from "next";
import { getLegalInfo } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the Plovxana PVL website and services.",
};

export default function PrivacyPage() {
  const legal = getLegalInfo();
  const lastUpdated = "26 April 2026";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-24">
      <h1 className="t-h1">Privacy Policy</h1>

      <p className="mt-8 t-body text-cream-100/80">
        This Privacy Policy explains how{" "}
        <strong className="text-cream-100">{legal.brandName}</strong> (the
        &quot;Service&quot;), operated by{" "}
        <strong className="text-cream-100">{legal.operatorNameEn}</strong>, collects,
        uses, and protects information when you use our website{" "}
        <span className="whitespace-nowrap">{legal.domain}</span> and related
        services.
      </p>

      <h2 className="mt-12 t-h3">1. Operator</h2>
      <p className="mt-4 t-body text-cream-100/80">
        The operator responsible for processing personal data is{" "}
        <strong className="text-cream-100">{legal.operatorNameEn}</strong>{" "}
        (<span className="whitespace-nowrap">{legal.operatorNameRu}</span>){" "}
        {legal.iinBin ? (
          <span className="whitespace-nowrap">(БИН/ИИН: {legal.iinBin})</span>
        ) : null}
        , address:{" "}
        <span className="whitespace-nowrap">{legal.addressLine}</span>.
      </p>

      <h2 className="mt-12 t-h3">2. Information we collect</h2>
      <p className="mt-4 t-body text-cream-100/80">
        We may collect the following categories of information:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>
          <strong className="text-cream-100">Contact/booking details:</strong> name,
          phone number, email address (if provided), requested date/time and other
          details you submit.
        </li>
        <li>
          <strong className="text-cream-100">Usage data:</strong> IP address, browser
          type, device information, language, timestamps, and pages visited.
        </li>
        <li>
          <strong className="text-cream-100">Cookies:</strong> technical identifiers
          used to support website functionality (see section 7).
        </li>
      </ul>
      <p className="mt-4 t-body text-cream-100/80">
        We do <strong>not</strong> intentionally collect payment card details,
        government IDs, biometric data, or special categories of personal data.
      </p>

      <h2 className="mt-12 t-h3">3. How we use information</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>To provide and maintain the Service.</li>
        <li>
          To communicate with you and respond to requests.
        </li>
        <li>
          To improve functionality and user experience.
        </li>
        <li>To ensure security and prevent fraud or abuse.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="mt-12 t-h3">4. Legal basis</h2>
      <p className="mt-4 t-body text-cream-100/80">
        Where required, we process personal data based on your consent (for example,
        when you submit a request). You may withdraw consent by contacting us using
        the details in section 9.
      </p>

      <h2 className="mt-12 t-h3">5. Data retention</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>
          Request details are retained for up to <strong>90 days</strong>, then
          deleted or anonymized unless a longer retention is required by law.
        </li>
        <li>
          Security and technical logs are retained for up to <strong>30 days</strong>.
        </li>
        <li>
          Cookies are retained according to your browser settings, generally up to{" "}
          <strong>365 days</strong>.
        </li>
      </ul>

      <h2 className="mt-12 t-h3">6. Sharing of information</h2>
      <p className="mt-4 t-body text-cream-100/80">
        We do not sell personal data. We may share information only:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>
          With service providers (hosting, analytics, infrastructure) strictly as
          necessary to operate the Service.
        </li>
        <li>
          With authorities when required by applicable law and valid requests.
        </li>
      </ul>

      <h2 className="mt-12 t-h3">7. Cookies</h2>
      <p className="mt-4 t-body text-cream-100/80">
        We use essential cookies to support website functionality and security.
        Disabling cookies in your browser may reduce functionality.
      </p>

      <h2 className="mt-12 t-h3">8. Your rights</h2>
      <p className="mt-4 t-body text-cream-100/80">
        Depending on applicable law, you may request:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>access to your personal data;</li>
        <li>correction or deletion;</li>
        <li>withdrawal of consent;</li>
        <li>
          submitting a complaint to the relevant data protection authority.
        </li>
      </ul>

      <h2 className="mt-12 t-h3">9. Contact</h2>
      <p className="mt-4 t-body text-cream-100/80">
        For privacy-related requests, contact:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>
          by email:{" "}
          <a
            href={`mailto:${legal.publicEmail}`}
            className="whitespace-nowrap text-gold-500 hover:text-gold-400"
          >
            {legal.publicEmail}
          </a>
          .
        </li>
      </ul>

      <h2 className="mt-12 t-h3">10. Changes to this policy</h2>
      <p className="mt-4 t-body text-cream-100/80">
        We may update this Privacy Policy from time to time. The latest version will
        always be published on this page and the &quot;Last updated&quot; date will
        be adjusted.
      </p>

      <p className="mt-12 t-micro">
        Last updated: {lastUpdated}
      </p>
    </main>
  );
}
