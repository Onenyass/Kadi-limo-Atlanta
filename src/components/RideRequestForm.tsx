"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "./Icons";

type Option = { value: string; label: string };

type Values = {
  name: string;
  contact: string;
  service: string;
  vehicle: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  passengers: string;
  notes: string;
};

type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "sent" | "error" | "summary";

/** Field names must stay in sync with public/__forms.html (Netlify Forms). */
const LABELS: Record<FieldName, string> = {
  name: "Name",
  contact: "Phone or email",
  service: "Service type",
  vehicle: "Preferred vehicle",
  date: "Pickup date",
  time: "Pickup time",
  pickup: "Pickup location",
  destination: "Destination",
  passengers: "Number of passengers",
  notes: "Notes",
};

const ORDER: FieldName[] = [
  "name",
  "contact",
  "service",
  "vehicle",
  "date",
  "time",
  "pickup",
  "destination",
  "passengers",
  "notes",
];

const STEPS: { title: string; label: string; intro: string; fields: FieldName[] }[] = [
  {
    label: "Occasion",
    title: "What’s the occasion?",
    intro: "Choose a service and, if you have one in mind, a vehicle.",
    fields: ["service", "vehicle", "passengers"],
  },
  {
    label: "Journey",
    title: "Where and when?",
    intro: "Tell us when to collect you and where you’re going.",
    fields: ["date", "time", "pickup", "destination"],
  },
  {
    label: "Details",
    title: "How do we reach you?",
    intro: "We’ll reply with availability and a quote. Nothing is booked until we confirm it with you.",
    fields: ["name", "contact", "notes"],
  },
];

const HINTS: Partial<Record<FieldName, string>> = {
  contact: "We’ll use this to reply to you.",
  pickup: "Address, hotel, venue or airport.",
  destination: "For hourly service, describe your plans or enter “As directed”.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function todayLocal(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  const contact = v.contact.trim();
  const digits = contact.replace(/\D/g, "");
  if (!contact) e.contact = "Please enter a phone number or email address.";
  else if (contact.includes("@") ? !EMAIL_RE.test(contact) : digits.length < 10)
    e.contact = "Please enter a valid phone number (with area code) or email address.";
  if (!v.service) e.service = "Please choose a service type.";
  if (!v.date) e.date = "Please choose a pickup date.";
  else if (v.date < todayLocal()) e.date = "Please choose a date that is today or later.";
  if (!v.time) e.time = "Please choose a pickup time.";
  if (!v.pickup.trim()) e.pickup = "Please enter a pickup location.";
  if (!v.destination.trim()) e.destination = "Please enter a destination.";
  const n = Number(v.passengers);
  if (!v.passengers) e.passengers = "Please enter the number of passengers.";
  else if (!Number.isInteger(n) || n < 1 || n > 99) e.passengers = "Please enter a whole number between 1 and 99.";
  return e;
}

const pick = (e: Errors, fields: FieldName[]): Errors =>
  Object.fromEntries(fields.filter((f) => e[f]).map((f) => [f, e[f]]));

export function RideRequestForm({
  mode,
  formName,
  services,
  vehicles,
  email,
  businessName,
}: {
  mode: "netlify" | "preview";
  formName: string;
  services: Option[];
  vehicles: Option[];
  email: string | null;
  businessName: string;
}) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<Values>({
    name: "",
    contact: "",
    service: "",
    vehicle: "",
    date: "",
    time: "",
    pickup: "",
    destination: "",
    passengers: "",
    notes: "",
  });
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [moved, setMoved] = useState(false);

  // Prefill from links such as /contact?service=weddings&vehicle=rolls-royce.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const vehicle = params.get("vehicle");
    const prefill: Partial<Values> = {};
    if (service && services.some((o) => o.value === service)) prefill.service = service;
    if (vehicle && vehicles.some((o) => o.value === vehicle)) prefill.vehicle = vehicle;
    if (Object.keys(prefill).length) setValues((v) => ({ ...v, ...prefill }));
  }, [services, vehicles]);

  // Move focus to the step heading after the visitor changes step.
  useEffect(() => {
    if (moved) titleRef.current?.focus();
  }, [step, moved]);

  const optionLabel = (list: Option[], value: string) => list.find((o) => o.value === value)?.label ?? value;

  const readable: Record<FieldName, string> = {
    ...values,
    service: values.service === "other" ? "Something else" : optionLabel(services, values.service),
    vehicle: values.vehicle ? optionLabel(vehicles, values.vehicle) : "No preference",
  };

  const summary = [
    `Ride request for ${businessName}`,
    "",
    ...ORDER.filter((k) => k !== "notes" || readable.notes.trim()).map(
      (k) => `${LABELS[k]}: ${readable[k].trim() || "—"}`,
    ),
  ].join("\n");

  const set = (name: FieldName, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted.has(step)) setErrors(pick(validate(next), STEPS[step].fields));
    if (status === "error" || status === "summary") setStatus("idle");
  };

  const onInput =
    (name: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(name, e.target.value);

  const focusFirstInvalid = (found: Errors, fields: FieldName[]) => {
    const first = fields.find((f) => found[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const goTo = (target: number) => {
    setDir(target < step ? "back" : "fwd");
    setErrors({});
    setMoved(true);
    setStep(target);
    setReached((r) => Math.max(r, target));
  };

  const next = () => {
    const fields = STEPS[step].fields;
    const found = pick(validate(values), fields);
    setAttempted((a) => new Set(a).add(step));
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstInvalid(found, fields);
      return;
    }
    goTo(step + 1);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    // Final check across all steps; send the visitor back to the first problem.
    const all = validate(values);
    const bad = STEPS.findIndex((s) => s.fields.some((f) => all[f]));
    if (bad !== -1) {
      setAttempted((a) => new Set(a).add(bad));
      if (bad !== step) goTo(bad);
      const found = pick(all, STEPS[bad].fields);
      setErrors(found);
      requestAnimationFrame(() => focusFirstInvalid(found, STEPS[bad].fields));
      return;
    }

    if (mode === "preview") {
      setStatus("summary");
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      const body = new URLSearchParams({ "form-name": formName, "bot-field": honeypot, ...readable });
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Form endpoint responded with ${res.status}`);
      setStatus("sent");
    } catch (err) {
      console.error("[ride-request] submission failed", err);
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const pre = document.getElementById(`${uid}-summary`);
      if (pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  const describedBy = (name: FieldName) =>
    [errors[name] ? `${uid}-${name}-error` : null, HINTS[name] ? `${uid}-${name}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldProps = (name: FieldName, required = true) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: onInput(name),
    required,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": describedBy(name),
  });

  const label = (name: FieldName, optional = false) => (
    <label htmlFor={`${uid}-${name}`}>
      {LABELS[name]}
      {optional ? (
        <span className="optional"> (optional)</span>
      ) : (
        <span className="req" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  const feedback = (name: FieldName) => (
    <>
      {HINTS[name] && (
        <span className="field__hint" id={`${uid}-${name}-hint`}>
          {HINTS[name]}
        </span>
      )}
      {errors[name] && (
        <span className="field__error" id={`${uid}-${name}-error`}>
          {errors[name]}
        </span>
      )}
    </>
  );

  const tiles = (name: "service" | "vehicle", options: Option[], legend: string, optional: boolean) => (
    <fieldset className="field field--full" aria-describedby={describedBy(name)}>
      <legend>
        {legend}
        {optional ? (
          <span className="optional"> (optional)</span>
        ) : (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="tiles" data-invalid={errors[name] ? true : undefined}>
        {options.map((o) => (
          <label className="tile" key={o.value || "none"}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={values[name] === o.value}
              onChange={() => set(name, o.value)}
              required={!optional}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {feedback(name)}
    </fieldset>
  );

  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("Ride request")}&body=${encodeURIComponent(summary)}`
    : null;

  const summaryBlock = (
    <>
      <pre className="form-summary" id={`${uid}-summary`} tabIndex={0} aria-label="Request summary">
        {summary}
      </pre>
      <div className="btn-row">
        <button type="button" className="btn btn--brass" onClick={copySummary}>
          {copied ? "Copied" : "Copy summary"}
        </button>
        {mailto && (
          <a className="btn btn--line" href={mailto}>
            Open in email
          </a>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Summary copied to clipboard." : ""}
      </span>
    </>
  );

  // ----- Finished states replace the form.
  if (status === "sent") {
    return (
      <div className="request">
        <div className="form-status" ref={statusRef} tabIndex={-1} role="status">
          <svg className="form-status__mark" viewBox="0 0 56 56" aria-hidden="true">
            <circle cx="28" cy="28" r="27" />
            <path d="M17 29l7 7 15-16" />
          </svg>
          <h3>Thank you. Your request was received.</h3>
          <p className="muted">
            We’ll review the details and reply with availability and a quote. Your ride is not
            booked until we confirm it with you.
          </p>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const serviceOptions = [...services, { value: "other", label: "Something else" }];
  const vehicleOptions = [{ value: "", label: "No preference" }, ...vehicles];

  return (
    <div className="request">
      <div className="request__head">
        {mode === "preview" && <span className="request__badge">Preview · requests are not sent yet</span>}
        <nav aria-label="Request steps">
          <ol className="steps-nav">
            {STEPS.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  data-state={i === step ? "current" : i < step || i <= reached ? "done" : "todo"}
                  aria-current={i === step ? "step" : undefined}
                  disabled={i > reached || status === "submitting"}
                  onClick={() => goTo(i)}
                  style={{ width: "100%" }}
                >
                  <span className="bar" aria-hidden="true" />
                  <span>
                    <span aria-hidden="true">0{i + 1} </span>
                    {s.label}
                    <span className="sr-only">
                      {i === step ? " (current step)" : i <= reached ? " (completed)" : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <form
        ref={formRef}
        name={formName}
        method="POST"
        noValidate
        onSubmit={onSubmit}
        className="request__body"
        aria-describedby={`${uid}-privacy`}
      >
        <input type="hidden" name="form-name" value={formName} />
        <p className="hp-field" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </p>

        <div className="step" key={step} data-dir={dir}>
          <h2 className="step__title" ref={titleRef} tabIndex={-1}>
            <span className="sr-only">
              Step {step + 1} of {STEPS.length}:{" "}
            </span>
            {current.title}
          </h2>
          <p className="step__intro">
            {current.intro}
            {step === 0 && (
              <>
                {" "}
                Fields marked <span aria-hidden="true">*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </>
            )}
          </p>

          {Object.keys(errors).length > 0 && (
            <p className="field__error" role="alert" style={{ marginBottom: 20 }}>
              Please check {Object.keys(errors).length === 1 ? "the highlighted field" : "the highlighted fields"}.
            </p>
          )}

          {step === 0 && (
            <div className="form-grid">
              {tiles("service", serviceOptions, LABELS.service, false)}
              {tiles("vehicle", vehicleOptions, LABELS.vehicle, true)}
              <div className="field">
                {label("passengers")}
                <input type="number" min={1} max={99} step={1} inputMode="numeric" {...fieldProps("passengers")} />
                {feedback("passengers")}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-grid">
              <div className="field">
                {label("date")}
                <input type="date" min={todayLocal()} {...fieldProps("date")} />
                {feedback("date")}
              </div>
              <div className="field">
                {label("time")}
                <input type="time" {...fieldProps("time")} />
                {feedback("time")}
              </div>
              <div className="field field--full">
                {label("pickup")}
                <input type="text" autoComplete="off" {...fieldProps("pickup")} />
                {feedback("pickup")}
              </div>
              <div className="field field--full">
                {label("destination")}
                <input type="text" autoComplete="off" {...fieldProps("destination")} />
                {feedback("destination")}
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="form-grid">
                <div className="field">
                  {label("name")}
                  <input type="text" autoComplete="name" {...fieldProps("name")} />
                  {feedback("name")}
                </div>
                <div className="field">
                  {label("contact")}
                  <input type="text" autoComplete="email" inputMode="email" {...fieldProps("contact")} />
                  {feedback("contact")}
                </div>
                <div className="field field--full">
                  {label("notes", true)}
                  <textarea
                    rows={3}
                    placeholder="Return trip, extra stops, luggage, occasion or anything else we should know."
                    {...fieldProps("notes", false)}
                  />
                  {feedback("notes")}
                </div>
              </div>
              <dl className="review" aria-label="Your trip so far">
                {(["service", "vehicle", "passengers", "date", "time", "pickup", "destination"] as FieldName[]).map((k) => (
                  <div key={k}>
                    <dt>{LABELS[k]}</dt>
                    <dd>{readable[k] || "—"}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        <div className="step-actions">
          {step > 0 && (
            <button type="button" className="btn-back" onClick={() => goTo(step - 1)} disabled={status === "submitting"}>
              <ArrowRight /> Back
            </button>
          )}
          <button type="submit" className="btn btn--brass" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Sending…"
              : !isLast
                ? "Continue"
                : mode === "preview"
                  ? "Prepare request summary"
                  : "Request availability"}
            {status !== "submitting" && <ArrowRight />}
          </button>
        </div>

        <p className="form-privacy" id={`${uid}-privacy`}>
          Privacy: the details you share are used only to respond to your ride request. Submitting
          does not book a ride; we’ll reply to confirm availability and a quote. See our{" "}
          <Link href="/privacy">privacy page</Link>.
        </p>
      </form>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" style={{ outline: "none" }}>
        {status === "error" && (
          <div className="form-status form-status--error" role="alert">
            <h3>Your request could not be sent.</h3>
            <p className="muted">
              Something went wrong and the request did not reach us. Please try again, or copy the
              summary below and send it to us directly.
            </p>
            {summaryBlock}
          </div>
        )}
        {status === "summary" && (
          <div className="form-status" role="status">
            <h3>Your request summary is ready.</h3>
            <p className="muted">
              This form is in preview mode, so <strong>nothing has been sent</strong>. Copy the
              summary below and send it to {businessName}
              {email ? " by email" : " using the contact details on this page once they’re published"}.
            </p>
            {summaryBlock}
          </div>
        )}
      </div>
    </div>
  );
}
