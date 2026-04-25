import type { Metadata } from "next";
import { getLegalInfo } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of the Plovxana PVL website and services.",
};

export default function TermsPage() {
  const legal = getLegalInfo();
  const effectiveDate = "26 April 2026";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-24">
      <h1 className="t-h1">Terms of Service</h1>

      <p className="mt-6 t-micro text-muted-400">Effective date: {effectiveDate}</p>

      <p className="mt-8 t-body text-cream-100/80">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of{" "}
        <span className="whitespace-nowrap">{legal.domain}</span> and related services
        (the &quot;Service&quot;). The Service is operated by{" "}
        <strong className="text-cream-100">{legal.operatorNameEn}</strong>{" "}
        (the &quot;Operator&quot;) under the brand{" "}
        <strong className="text-cream-100">{legal.brandName}</strong>.
      </p>

      <h2 className="mt-12 t-h3">1. Use of the Service</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 t-body text-cream-100/80 marker:text-gold-500">
        <li>You may use the Service only for lawful purposes.</li>
        <li>
          You agree not to attempt to disrupt, overload, or compromise the security of
          the Service.
        </li>
        <li>
          We may update, suspend, or discontinue parts of the Service at any time.
        </li>
      </ul>

      <h2 className="mt-12 t-h3">2. User Content and Requests</h2>
      <p className="mt-4 t-body text-cream-100/80">
        If the Service allows you to submit requests (for example, bookings, messages,
        or orders), you are responsible for the accuracy of the information you
        provide.
      </p>

      <h2 className="mt-12 t-h3">3. Third-Party Services</h2>
      <p className="mt-4 t-body text-cream-100/80">
        The Service may integrate or reference third-party services (including Meta
        platforms). Third-party services are governed by their own terms and policies.
      </p>

      <h2 className="mt-12 t-h3">4. Intellectual Property</h2>
      <p className="mt-4 t-body text-cream-100/80">
        The Service, including its design, branding, and content, is owned by the
        Operator or its licensors. You may not copy, modify, or redistribute any part
        of the Service without prior written permission, except as permitted by law.
      </p>

      <h2 className="mt-12 t-h3">5. Disclaimer and Limitation of Liability</h2>
      <p className="mt-4 t-body text-cream-100/80">
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis. To the maximum extent permitted by applicable law, the Operator is not
        liable for indirect damages, loss of data, or interruptions of service.
      </p>

      <h2 className="mt-12 t-h3">6. Governing Law</h2>
      <p className="mt-4 t-body text-cream-100/80">
        These Terms are governed by the laws of the Republic of Kazakhstan.
      </p>

      <h2 className="mt-12 t-h3">7. Contact</h2>
      <p className="mt-4 t-body text-cream-100/80">
        For questions about these Terms, contact us at{" "}
        <a
          href={`mailto:${legal.publicEmail}`}
          className="whitespace-nowrap text-gold-500 hover:text-gold-400"
        >
          {legal.publicEmail}
        </a>
        .
      </p>
    </main>
  );
}

