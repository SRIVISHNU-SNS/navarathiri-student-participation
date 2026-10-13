import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import NavarathiriWordmark from "@/components/NavarathiriWordmark";

type FormValues = {
  fullName: string;
  department: string;
  participation: string;
  participantType: "" | "Individual" | "Group";
  groupName: string;
  groupSize: string;
  groupMembers: string;
  rehearsal: string;
  query: string;
};

type SubmissionState = "idle" | "sending" | "success" | "error";

const participationOptions = [
  "Group Dance",
  "Solo Dance",
  "Classical Dance",
  "Singing / Vocal Performance",
  "Music / Instrumental Performance",
  "Drama / Skit",
  "Traditional Dress / Fashion Walk",
  "Anchoring / Hosting",
  "Rangoli / Creative Activities",
  "Decoration / Event Volunteers",
  "Other",
];
const rehearsalOptions = ["Yes", "No", "Depends on schedule"];
const emptyValues: FormValues = {
  fullName: "",
  department: "",
  participation: "",
  participantType: "",
  groupName: "",
  groupSize: "",
  groupMembers: "",
  rehearsal: "",
  query: "",
};

function DanceMark() {
  return (
    <img
      src="/artwork/navarathiri-seal.webp"
      className="brand-mark"
      alt=""
      aria-hidden="true"
      width="64"
      height="64"
      fetchPriority="high"
    />
  );
}

function FieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}
      {required && (
        <span className="required-mark" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

export default function Home() {
  const visibleForm = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [submission, setSubmission] = useState<SubmissionState>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "participantType" && value === "Individual"
        ? { groupName: "", groupSize: "", groupMembers: "" }
        : {}),
    }));
    if (submission === "error") setSubmission("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submission === "sending" || !visibleForm.current?.reportValidity()) return;

    setSubmission("sending");
    setSubmissionMessage("");
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(values),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        ok?: boolean;
      };
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Registration storage is available after the Render deployment is connected.");
      }
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Your response could not be saved. Please try again.");
      }
      setSubmission("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : "Your response could not be saved. Please check your connection and try again.",
      );
      setSubmission("error");
    }
  }

  function resetForAnotherResponse() {
    setSubmission("idle");
    setSubmissionMessage("");
    setValues(emptyValues);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Navarathiri at SNS">
          <DanceMark />
          <NavarathiriWordmark compact />
        </a>
        <div className="header-partners">
          <span>SNS College of Technology</span>
          <span>Coimbatore <b>×</b> NIAT</span>
        </div>
        <a className="top-link" href="#registration">
          Register <ArrowDown size={15} />
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="event-place">
            <span>SNS College of Technology</span>
            <span>Coimbatore <b>×</b> NIAT</span>
          </p>
          <h1 id="hero-title" className="hero-wordmark">
            <NavarathiriWordmark compact showEdition={false} />
          </h1>
          <p className="hero-intro">
            Dance, perform, create or help bring the celebration to life.
          </p>
          <a className="hero-cta" href="#registration">
            Register to take part <ArrowDown size={16} />
          </a>
        </div>
        <figure className="hero-art">
          <img
            src="/artwork/navarathiri-hero.webp"
            alt="Students celebrating Navarathiri with garba and dandiya"
            width="1440"
            height="960"
            fetchPriority="high"
          />
          <figcaption>Navarathiri at SNS College of Technology</figcaption>
        </figure>
      </section>

      <section className="art-strip" aria-label="Navarathiri dance, music, and rangoli illustrations">
        <figure className="art-tile tile-dance">
          <img
            src="/artwork/navarathiri-dancer.webp"
            alt="A hand-illustrated garba dancer with dandiya sticks"
            width="480"
            height="720"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Dance</figcaption>
        </figure>
        <figure className="art-tile tile-music">
          <img
            src="/artwork/navarathiri-dhol.webp"
            alt="A hand-illustrated dhol player"
            width="480"
            height="720"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Music</figcaption>
        </figure>
        <figure className="art-tile tile-rangoli">
          <img
            src="/artwork/navarathiri-rangoli.webp"
            alt="A hand-illustrated rangoli with a diya and dandiya"
            width="768"
            height="768"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Rangoli and crafts</figcaption>
        </figure>
      </section>

      <section className="registration" id="registration" aria-labelledby="form-title">
        <div className="form-heading">
          <div>
            <p className="section-kicker">STUDENT REGISTRATION</p>
            <h2 id="form-title">How will you take part?</h2>
          </div>
          <p className="required-note">
            Questions marked <span className="required-mark">*</span> are required.
          </p>
        </div>

        {submission === "success" ? (
          <div className="success-panel" role="status" aria-live="polite">
            <span className="success-illustration">
              <Check size={29} strokeWidth={1.8} />
            </span>
            <p className="section-kicker">RESPONSE SAVED</p>
            <h3>See you at Navarathiri.</h3>
            <p>Your registration has been saved for the event organisers.</p>
            <button className="text-button" type="button" onClick={resetForAnotherResponse}>
              Send another response <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <form ref={visibleForm} className="form-body" onSubmit={handleSubmit}>
            <section className="form-section" aria-labelledby="section-about">
              <div className="section-number number-coral">01</div>
              <div className="section-content">
                <h3 id="section-about">Your details</h3>
                <div className="field-grid">
                  <div className="field-group">
                    <FieldLabel htmlFor="full-name" required>Full Name</FieldLabel>
                    <input
                      id="full-name"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Full name"
                      required
                      maxLength={120}
                      value={values.fullName}
                      onChange={(event) => setField("fullName", event.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <FieldLabel htmlFor="department" required>Department/course</FieldLabel>
                    <input
                      id="department"
                      name="department"
                      autoComplete="organization-title"
                      placeholder="Department or course"
                      required
                      maxLength={180}
                      value={values.department}
                      onChange={(event) => setField("department", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="form-section" aria-labelledby="section-participation">
              <div className="section-number number-blue">02</div>
              <div className="section-content">
                <h3 id="section-participation">Your participation</h3>
                <fieldset className="choice-fieldset">
                  <legend className="field-label">
                    How would you like to participate?
                    <span className="required-mark" aria-label="required">*</span>
                  </legend>
                  <div className="activity-grid">
                    {participationOptions.map((option, index) => (
                      <label
                        className={`activity-option ${values.participation === option ? "is-selected" : ""}`}
                        key={option}
                      >
                        <input
                          type="radio"
                          name="participation"
                          value={option}
                          required={index === 0}
                          checked={values.participation === option}
                          onChange={(event) => setField("participation", event.target.value)}
                        />
                        <span className="radio-art" aria-hidden="true"><span /></span>
                        <span className="activity-label">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="choice-fieldset type-fieldset">
                  <legend className="field-label">
                    Are you participating individually or as a group?
                    <span className="required-mark" aria-label="required">*</span>
                  </legend>
                  <div className="type-options">
                    {(["Individual", "Group"] as const).map((option, index) => (
                      <label
                        className={`type-option ${values.participantType === option ? "is-selected" : ""}`}
                        key={option}
                      >
                        <input
                          type="radio"
                          name="participantType"
                          value={option}
                          required={index === 0}
                          checked={values.participantType === option}
                          onChange={(event) => setField("participantType", event.target.value as FormValues["participantType"])}
                        />
                        <span className="radio-art" aria-hidden="true"><span /></span>
                        <strong>{option}</strong>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {values.participantType === "Group" && (
                  <div className="group-details" aria-live="polite">
                    <div className="group-heading">
                      <h4>Group details</h4>
                      <span>Optional</span>
                    </div>
                    <div className="field-grid group-grid">
                      <div className="field-group">
                        <FieldLabel htmlFor="group-name">If group participation, what is your group name?</FieldLabel>
                        <input
                          id="group-name"
                          name="groupName"
                          placeholder="Group name"
                          maxLength={160}
                          value={values.groupName}
                          onChange={(event) => setField("groupName", event.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <FieldLabel htmlFor="group-size">How many students are in your group?</FieldLabel>
                        <input
                          id="group-size"
                          name="groupSize"
                          inputMode="numeric"
                          placeholder="Number of students"
                          maxLength={32}
                          value={values.groupSize}
                          onChange={(event) => setField("groupSize", event.target.value)}
                        />
                      </div>
                      <div className="field-group field-span">
                        <FieldLabel htmlFor="group-members">Names of other group members</FieldLabel>
                        <textarea
                          id="group-members"
                          name="groupMembers"
                          rows={2}
                          placeholder="Names of other group members"
                          maxLength={1500}
                          value={values.groupMembers}
                          onChange={(event) => setField("groupMembers", event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="form-section last-section" aria-labelledby="section-rehearsal">
              <div className="section-number number-green">03</div>
              <div className="section-content">
                <h3 id="section-rehearsal">Rehearsal and questions</h3>
                <fieldset className="choice-fieldset rehearsal-fieldset">
                  <legend className="field-label">
                    Are you available for the rehearsal?
                    <span className="required-mark" aria-label="required">*</span>
                  </legend>
                  <div className="rehearsal-options">
                    {rehearsalOptions.map((option, index) => (
                      <label
                        className={`rehearsal-option ${values.rehearsal === option ? "is-selected" : ""}`}
                        key={option}
                      >
                        <input
                          type="radio"
                          name="rehearsal"
                          value={option}
                          required={index === 0}
                          checked={values.rehearsal === option}
                          onChange={(event) => setField("rehearsal", event.target.value)}
                        />
                        <span className="radio-art" aria-hidden="true"><span /></span>
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="field-group query-group">
                  <FieldLabel htmlFor="query" required>Any other query?</FieldLabel>
                  <textarea
                    id="query"
                    name="query"
                    rows={3}
                    placeholder="Write a question or enter No"
                    required
                    maxLength={2000}
                    value={values.query}
                    aria-describedby="query-hint"
                    onChange={(event) => setField("query", event.target.value)}
                  />
                  <p className="field-hint" id="query-hint">If you have no question, enter “No”.</p>
                </div>
              </div>
            </section>

            {submission === "error" && (
              <div className="submit-error" role="alert">
                {submissionMessage || "Your response could not be saved. Please try again."}
              </div>
            )}
            <div className="submit-row">
              <button className="submit-button" type="submit" disabled={submission === "sending"}>
                {submission === "sending" ? "Saving response…" : "Submit registration"}
                {submission === "sending" ? (
                  <span className="button-spinner" aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      <footer className="footer">
        <a className="footer-brand" href="#top" aria-label="Navarathiri at SNS">
          <DanceMark />
          <NavarathiriWordmark compact />
        </a>
        <p>SNS College of Technology<br />Coimbatore <b>×</b> NIAT</p>
        <a href="/admin" className="back-top">Organiser access</a>
      </footer>
    </main>
  );
}
