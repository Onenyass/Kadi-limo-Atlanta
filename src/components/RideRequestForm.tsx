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

const HINTS: Partial<Record<FieldName, string>> = {
  contact: "We’ll use this to reply to you.",
  pickup: "Address, hotel, venue or airport.",
  destination: "For hourly service, describe your plans or enter “As directed”.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function todayLocal(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
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
  else if (!Number.isInteger(n) || n < 1 || n > 99)
    e.passengers = "Please enter a whole number between 1 and 99.";
  return e;
}

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
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Prefill service/vehicle from links such as /contact?service=weddings&vehicle=rolls-royce.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const vehicle = params.get("vehicle");
    const prefill: Partial<Values> = {};
    if (service && services.some((o) => o.value === service)) prefill.service = service;
    if (vehicle && vehicles.some((o) => o.value === vehicle)) prefill.vehicle = vehicle;
    if (Object.keys(prefill).length) setValues((v) => ({ ...v, ...prefill }));
  }, [services, vehicles]);

  const optionLabel = (list: Option[], value: string, fallback: string) =>
    list.find((o) => o.value === value)?.label ?? fallback;

  const readable: Record<FieldName, string> = {
    ...values,
    service:
      values.service === "other" ? "Something else" : optionLabel(services, values.service, values.service),
    vehicle: values.vehicle ? optionLabel(vehicles, values.vehicle, values.vehicle) : "No preference",
  };

  const summary = [
    `Ride request for ${businessName}`,
    "",
    ...ORDER.filter((k) => k !== "notes" || readable.notes.trim()).map(
      (k) => `${LABELS[k]}: ${readable[k].trim() || "—"}`,
    ),
  ].join("\n");

  const set = (name: FieldName) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
    if (status !== "idle" && status !== "submitting") setStatus("idle");
  };

  const focusStatus = () => {
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = ORDER.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (mode === "preview") {
      setStatus("summary");
      focusStatus();
      return;
    }

    setStatus("submitting");
    try {
      const body = new URLSearchParams({
        "form-name": formName,
        "bot-field": honeypot,
        ...readable,
      });
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
    focusStatus();
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
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

  const fieldProps = (name: FieldName, required = true) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    required,
    "aria-required": required || undefined,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby":
      [errors[name] ? `${uid}-${name}-error` : null, HINTS[name] ? `${uid}-${name}-hint` : null]
        .filter(Boolean)
        .join(" ") || undefined,
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

  const errorCount = Object.keys(errors).length;
  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("Ride request")}&body=${encodeURIComponent(summary)}`
    : null;

  const summaryBlock = (
    <>
      <pre className="form-summary" id={`${uid}-summary`} tabIndex={0} aria-label="Request summary">
        {summary}
      </pre>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={copySummary}>
          {copied ? "Copied" : "Copy summary"}
        </button>
        {mailto && (
          <a className="btn btn--ghost" href={mailto}>
            Open in email
          </a>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Summary copied to clipboard." : ""}
      </span>
    </>
  );

  return (
    <div className="form-card light light--paper">
      <div className="form-card__head">
        {mode === "preview" && (
          <span className="form-badge">Preview · requests are not sent yet</span>
        )}
        <h2 className="display-sm">Request a ride</h2>
        <p className="muted" style={{ fontSize: "0.95rem" }}>
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
          {mode === "preview" &&
            " Online sending is not switched on yet — when you submit, you’ll get a summary you can copy and send to us directly."}
        </p>
      </div>

      <form
        ref={formRef}
        name={formName}
        method="POST"
        noValidate
        onSubmit={onSubmit}
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

        {submitted && errorCount > 0 && (
          <p className="field__error" role="alert" style={{ marginBottom: 20 }}>
            Please correct {errorCount === 1 ? "1 field" : `${errorCount} fields`} below.
          </p>
        )}

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

          <div className="field">
            {label("service")}
            <select {...fieldProps("service")}>
              <option value="">Choose a service</option>
              {services.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
              <option value="other">Something else</option>
            </select>
            {feedback("service")}
          </div>

          <div className="field">
            {label("vehicle", true)}
            <select {...fieldProps("vehicle", false)}>
              <option value="">No preference</option>
              {vehicles.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {feedback("vehicle")}
          </div>

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

          <div className="field">
            {label("passengers")}
            <input type="number" min={1} max={99} step={1} inputMode="numeric" {...fieldProps("passengers")} />
            {feedback("passengers")}
          </div>

          <div className="field field--full">
            {label("notes", true)}
            <textarea
              rows={4}
              placeholder="Return trip, extra stops, luggage, occasion or anything else we should know."
              {...fieldProps("notes", false)}
            />
            {feedback("notes")}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Sending…"
              : mode === "preview"
                ? "Prepare request summary"
                : "Request availability"}
            {status !== "submitting" && <ArrowRight />}
          </button>
        </div>

        <p className="form-privacy" id={`${uid}-privacy`}>
          Privacy: the details you share are used only to respond to your ride request. Submitting
          this form does not book a ride; we’ll reply to confirm availability and a quote. See our{" "}
          <Link href="/privacy">privacy page</Link>.
        </p>
      </form>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" style={{ outline: "none" }}>
        {status === "sent" && (
          <div className="form-status form-status--success" role="status">
            <h3>Thank you — your request was received.</h3>
            <p>
              We’ll review the details and reply with availability and a quote. Your ride is not
              booked until we confirm it with you.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="form-status form-status--error" role="alert">
            <h3>Your request could not be sent.</h3>
            <p>
              Something went wrong and the request did not reach us. Please try again, or copy the
              summary below and send it to us directly.
            </p>
            {summaryBlock}
          </div>
        )}
        {status === "summary" && (
          <div className="form-status" role="status">
            <h3>Your request summary is ready.</h3>
            <p>
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
