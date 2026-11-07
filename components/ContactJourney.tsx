"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Pencil,
} from "lucide-react";
import { offices, solutions } from "@/lib/content";
import { serviceCatalog } from "@/lib/service-catalog";
import { emailRecipients } from "@/lib/email-recipients";

type Enquiry = {
  interest: string;
  office: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};
type PreparedDraft = { gmail: string; mailto: string };
const fieldLimits: Record<keyof Enquiry, number> = {
  name: 120,
  email: 254,
  phone: 32,
  company: 160,
  message: 8000,
  interest: 160,
  office: 120,
};
const projectFields = ["interest", "office", "message"] as const;
const detailFields = ["name", "email", "phone", "company"] as const;
const steps = ["Your project", "Your details", "Review & send"];
const titles = [
  "Choose your focus.",
  "Introduce yourself.",
  "Review your enquiry.",
];
const descriptions = [
  "Tell us what you’re working towards. A few sentences are enough to start the conversation.",
  "Let us know who we’ll be speaking with and how to reach you.",
  "Review your details, make any changes, then choose Send email to open your Gmail draft.",
];
function fieldError(field: keyof Enquiry, value: string) {
  if (!value.trim()) return "Please complete this field.";
  if (value.length > fieldLimits[field])
    return `Please use no more than ${fieldLimits[field]} characters.`;
  if (field === "phone") {
    const digits = value.replace(/\D/g, "").length;
    if (!/^[+()\d\s.\-]+$/.test(value) || digits < 7 || digits > 15)
      return "Enter a phone number with 7–15 digits. You can include +, spaces, brackets or hyphens.";
  }
  return "";
}
export default function ContactJourney() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Enquiry>({
    interest: "",
    office: "",
    message: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [consent, setConsent] = useState(false);
  const [preparedDraft, setPreparedDraft] = useState<PreparedDraft | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("service");
    const service = serviceCatalog.find((item) => item.id === id);
    if (service)
      setValues((previous) =>
        previous.interest ? previous : { ...previous, interest: service.title },
      );
  }, []);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [step]);
  useEffect(() => {
    if (preparedDraft)
      resultRef.current?.scrollIntoView({
        block: "nearest",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [preparedDraft]);
  function update(field: keyof Enquiry, value: string) {
    const control = formRef.current?.elements.namedItem(field) as
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    control?.setCustomValidity("");
    setValues((previous) => ({
      ...previous,
      [field]: value.slice(0, fieldLimits[field]),
    }));
    setPreparedDraft(null);
    setConsent(false);
  }
  function goTo(next: number) {
    setPreparedDraft(null);
    setStep(next);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (step < 2) {
      const fields = step === 0 ? projectFields : detailFields;
      fields.forEach((field) => {
        const control = form.elements.namedItem(field) as
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        control.setCustomValidity(fieldError(field, values[field]));
      });
      if (form.reportValidity()) goTo(step + 1);
      return;
    }
    if (!consent || !form.reportValidity()) return;
    const invalid = [...projectFields, ...detailFields].find((field) =>
      fieldError(field, values[field]),
    );
    if (invalid) {
      goTo(projectFields.some((field) => field === invalid) ? 0 : 1);
      return;
    }
    const to = emailRecipients.join(",");
    const subject = "Infocus enquiry — " + values.interest.trim();
    const body = [
      "Hello Infocus team,",
      "I would like to discuss the following enquiry.",
      "Name: " + values.name.trim(),
      "Work email: " + values.email.trim(),
      "Phone: " + values.phone.trim(),
      "Company: " + values.company.trim(),
      "Service interest: " + values.interest.trim(),
      "Preferred office: " + values.office.trim(),
      "Your challenge:\n" + values.message.trim(),
      "Consent to the privacy policy for this enquiry: Yes",
    ].join("\n\n");
    const draft = {
      gmail:
        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
        encodeURIComponent(to) +
        "&su=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body),
      mailto:
        "mailto:" +
        emailRecipients.map(encodeURIComponent).join(",") +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body),
    };
    setPreparedDraft(draft);
    try {
      // Keep this call in the submit gesture. With noopener, a null return
      // does not mean the popup failed; the explicit links always remain.
      window.open(draft.gmail, "_blank", "noopener,noreferrer");
    } catch {
      // The prepared draft links also work when automatic popups are blocked.
    }
  }
  return (
    <form
      className="contact-form guided-contact"
      ref={formRef}
      onSubmit={submit}
    >
      <div className="contact-progress-heading">
        <span className="eyebrow">LET’S SHAPE YOUR NEXT MOVE</span>
        <span>Step {step + 1} of 3</span>
      </div>
      <ol className="contact-steps" aria-label="Enquiry progress">
        {steps.map((name, index) => (
          <li
            key={name}
            className={
              index === step ? "current" : index < step ? "complete" : ""
            }
          >
            <button
              type="button"
              disabled={index > step}
              aria-current={index === step ? "step" : undefined}
              aria-label={"Step " + (index + 1) + ": " + name}
              onClick={() => goTo(index)}
            >
              <span>{index < step ? <Check size={17} /> : index + 1}</span>
              <strong>{name}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="contact-progress-track" aria-hidden="true">
        <span style={{ width: ((step + 1) / 3) * 100 + "%" }} />
      </div>
      <section
        className="contact-step-panel"
        key={step}
        aria-labelledby="contact-step-heading"
      >
        <h2 ref={headingRef} id="contact-step-heading" tabIndex={-1}>
          {titles[step]}
        </h2>
        <p className="contact-step-description">{descriptions[step]}</p>
        {step === 0 && (
          <>
            <div className="form-grid">
              <label>
                I’m interested in
                <select
                  name="interest"
                  required
                  value={values.interest}
                  onChange={(event) => update("interest", event.target.value)}
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  <optgroup label="Cloud, development & support services">
                    {serviceCatalog.map((service) => (
                      <option key={service.id}>{service.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other areas & enquiries">
                    {solutions.map((s) => (
                      <option key={s.slug}>{s.title}</option>
                    ))}
                    <option>Oracle services</option>
                    <option>Careers</option>
                    <option>Help me choose</option>
                  </optgroup>
                </select>
              </label>
              <label>
                Preferred office
                <select
                  name="office"
                  required
                  value={values.office}
                  onChange={(event) => update("office", event.target.value)}
                >
                  <option value="" disabled>
                    Choose an office
                  </option>
                  {offices.map((office) => (
                    <option key={office.city}>{office.city}</option>
                  ))}
                  <option>No preference</option>
                </select>
              </label>
            </div>
            <label>
              Your challenge
              <textarea
                name="message"
                required
                rows={5}
                maxLength={fieldLimits.message}
                value={values.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="What would you like to improve, connect or build?"
                aria-describedby="challenge-hint"
              />
            </label>
            <p id="challenge-hint" className="contact-field-hint">
              Your goal, the systems involved and any timing you have in mind.
            </p>
          </>
        )}
        {step === 1 && (
          <>
            <label>
              Your name
              <input
                required
                name="name"
                autoComplete="name"
                maxLength={fieldLimits.name}
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Full name"
              />
            </label>
            <label>
              Work email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                maxLength={fieldLimits.email}
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@company.com"
              />
            </label>
            <label>
              Phone number
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={fieldLimits.phone}
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="Include your country code"
                aria-describedby="phone-hint"
              />
            </label>
            <p id="phone-hint" className="contact-field-hint">
              Use a number with 7–15 digits, including your country code.
            </p>
            <label>
              Company
              <input
                required
                name="company"
                autoComplete="organization"
                maxLength={fieldLimits.company}
                value={values.company}
                onChange={(event) => update("company", event.target.value)}
                placeholder="Company name"
              />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <div className="enquiry-review">
              <div className="review-group">
                <div className="review-heading">
                  <h3>Your project</h3>
                  <button type="button" onClick={() => goTo(0)}>
                    <Pencil size={14} /> Edit project
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Service</dt>
                    <dd>{values.interest}</dd>
                  </div>
                  <div>
                    <dt>Office</dt>
                    <dd>{values.office}</dd>
                  </div>
                  <div className="review-message">
                    <dt>Your challenge</dt>
                    <dd>{values.message}</dd>
                  </div>
                </dl>
              </div>
              <div className="review-group">
                <div className="review-heading">
                  <h3>Your details</h3>
                  <button type="button" onClick={() => goTo(1)}>
                    <Pencil size={14} /> Edit details
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd>{values.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{values.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{values.phone}</dd>
                  </div>
                  <div>
                    <dt>Company</dt>
                    <dd>{values.company}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <label className="checkbox contact-consent">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  setPreparedDraft(null);
                }}
              />
              <span>
                I agree to the{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                  privacy policy
                </Link>{" "}
                for this enquiry.
              </span>
            </label>
          </>
        )}
      </section>
      <div className="contact-step-actions">
        {step > 0 && (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => goTo(step - 1)}
          >
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <button className="button contact-continue" type="submit">
          {step === 0
            ? "Continue to your details"
            : step === 1
              ? "Review"
              : "Send email"}
          {step === 2 ? (
            <ArrowUpRight size={19} aria-hidden="true" />
          ) : (
            <ArrowRight size={19} aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="form-note">
        {step < 2
          ? "You can go back at any time. Your answers stay with you as you move through the steps."
          : "Gmail opens with your details. Review the message and choose Send in Gmail."}
      </p>
      {preparedDraft && (
        <div ref={resultRef} className="form-result" role="status">
          <Check size={24} />
          <div>
            <strong>Your email draft is ready.</strong>
            <p>
              Gmail opens with your details. Review the message and choose Send
              in Gmail.
            </p>
            <div className="contact-draft-actions">
              <a
                href={preparedDraft.gmail}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Gmail draft <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a href={preparedDraft.mailto}>
                Open in email app <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
