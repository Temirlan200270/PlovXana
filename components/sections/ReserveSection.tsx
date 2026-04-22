"use client";

import { useMemo, useState } from "react";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { atmosphere } from "@/config/atmosphere";
import { Section } from "@/components/ui/primitives/Section";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { Button } from "@/components/ui/primitives/Button";

type ReserveView = "form" | "success";

const guestsOptions: readonly string[] = ["1", "2", "3", "4", "5", "6", "7", "8+"];
const timeOptions: readonly string[] = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function buildNextDates(days = 10): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function ReserveSection({ copy }: { copy: TenantPublicConfig }) {
  const a = atmosphere.reserve;
  const dates = useMemo(() => buildNextDates(12), []);

  const [view, setView] = useState<ReserveView>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [date, setDate] = useState(dates[0] ?? "");
  const [time, setTime] = useState(timeOptions[6] ?? "18:00");
  const [guests, setGuests] = useState(guestsOptions[1] ?? "2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!date.trim()) return "Этот день у нас закрыт — попробуйте выбрать другой вечер.";
    if (!time.trim()) return "Этот день у нас закрыт — попробуйте выбрать другой вечер.";
    if (!guests.trim()) return "Этот день у нас закрыт — попробуйте выбрать другой вечер.";
    if (name.trim().length < 2) return "Как к вам обращаться?";
    const p = phone.replace(/\s+/g, "");
    if (p.length < 8) return "Куда набрать";
    return null;
  };

  const onSubmit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setView("success");
      window.location.href = `tel:${copy.contacts.bookingPhoneE164}`;
    }, 850);
  };

  return (
    <Section
      bokehImage="/photo/hero-dombra.jpg"
      bokehBlurPx={a.bokeh.blur}
      bokehOverlayAlpha={a.bokeh.overlayAlpha}
      texture="pergament"
      grainOpacity={a.grain.opacity}
      className="bg-umber-950"
    >
      <div id="reserve" className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="t-caps">{copy.reserveEyebrow}</div>
          <h2 className="mt-6 t-h1">
            {copy.reserveTitleLine1} <br />
            <ItalicAccent>{copy.reserveTitleAccent}</ItalicAccent>
          </h2>
          <p className="mt-6 t-body">{copy.reserveSub}</p>

          <div className="mt-10 relative">
            {view === "success" ? (
              <div className="relative overflow-hidden bg-umber-900 ring-1 ring-gold-500/60 shadow-lift-md p-8 text-center">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(232, 168, 79, 0.35), transparent 70%)",
                    opacity: 0.25,
                  }}
                  aria-hidden
                />
                <h3 className="t-h2">
                  Стол забронирован. <br />
                  <ItalicAccent>Казан уже ставим.</ItalicAccent>
                </h3>
                <p className="mt-4 t-body text-cream-100/80">Ждём к {time}.</p>
                <div className="mt-8">
                  <Button
                    href="#menu"
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => setView("form")}
                  >
                    Смотреть меню
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative bg-umber-900 ring-1 ring-gold-500/60 shadow-lift-md p-6">
                <div className="grid gap-4">
                  <Field label="Дата">
                    <Select value={date} onChange={setDate}>
                      {dates.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Время">
                      <Select value={time} onChange={setTime}>
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Гости">
                      <Select value={guests} onChange={setGuests}>
                        {guestsOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>

                  <Field label="Имя">
                    <Input
                      value={name}
                      onChange={setName}
                      placeholder="Как к вам обращаться"
                    />
                  </Field>
                  <Field label="Телефон">
                    <Input
                      value={phone}
                      onChange={setPhone}
                      placeholder="Куда набрать"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="Пожелание">
                    <Textarea
                      value={note}
                      onChange={setNote}
                      placeholder="Что для вас важно"
                    />
                  </Field>

                  {error ? (
                    <div className="ring-1 ring-ember-600/60 bg-umber-950/40 p-4">
                      <p className="t-body text-cream-100/80">{error}</p>
                    </div>
                  ) : null}

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Передаём на кухню…" : "Забронировать"}
                  </Button>
                </div>

                {isSubmitting ? (
                  <div className="absolute inset-0 bg-umber-950/60 flex items-center justify-center">
                    <div className="t-caps text-gold-500 lamp-breathe">
                      Передаём на кухню…
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="lg:pt-10">
          <div className="grid gap-10">
            <div>
              <div className="t-caps">АДРЕС</div>
              <p className="mt-4 t-body text-cream-100/80">{copy.contacts.addressLine}</p>
            </div>
            <div>
              <div className="t-caps">ЧАСЫ</div>
              <p className="mt-4 t-body text-cream-100/80">{copy.contacts.hoursLine}</p>
              <p className="mt-4 t-micro">{copy.contacts.kazansLine}</p>
            </div>
            <div>
              <div className="t-caps">КОНТАКТ</div>
              <div className="mt-4 space-y-3">
                <a
                  href={`tel:${copy.contacts.bookingPhoneE164}`}
                  className="block font-serif text-xl text-cream-100 transition-colors duration-600 ease-heritage hover:text-gold-500"
                >
                  {copy.contacts.bookingPhoneDisplay}
                </a>
                <a
                  href={`tel:${copy.contacts.deliveryPhoneE164}`}
                  className="block t-body text-cream-100/80 transition-colors duration-600 ease-heritage hover:text-gold-500"
                >
                  {copy.contacts.deliveryPhoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-micro">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputMode?: "text" | "tel";
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="w-full px-4 py-3 bg-umber-900 text-cream-100 font-sans text-base ring-[0.5px] ring-gold-500/60 shadow-inset-sm placeholder:text-muted-400 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all duration-600 ease-heritage rounded-none"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 bg-umber-900 text-cream-100 font-sans text-base ring-[0.5px] ring-gold-500/60 shadow-inset-sm placeholder:text-muted-400 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all duration-600 ease-heritage rounded-none resize-none"
    />
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-umber-900 text-cream-100 font-sans text-base ring-[0.5px] ring-gold-500/60 shadow-inset-sm placeholder:text-muted-400 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all duration-600 ease-heritage rounded-none appearance-none pr-10"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold-500">
        ▾
      </span>
    </div>
  );
}

