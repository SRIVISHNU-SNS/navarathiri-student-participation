import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";

const FORM_RESPONSE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc9mPw699KngtaJU1WjYf6kpCi0gVuWXanXNLzpW9kj1bOqjw/formResponse";
const SOURCE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc9mPw699KngtaJU1WjYf6kpCi0gVuWXanXNLzpW9kj1bOqjw/viewform";

const participationOptions = [
  { label: "Group Dance", value: "Group Dance" },
  { label: "Solo Dance", value: "[ ] Solo Dance" },
  { label: "Classical Dance", value: "[ ] Classical Dance" },
  { label: "Singing / Vocal Performance", value: "[ ] Singing / Vocal Performance" },
  { label: "Music / Instrumental Performance", value: "[ ] Music / Instrumental Performance" },
  { label: "Drama / Skit", value: "[ ] Drama / Skit" },
  { label: "Traditional Dress / Fashion Walk", value: "[ ] Traditional Dress / Fashion Walk" },
  { label: "Anchoring / Hosting", value: "[ ] Anchoring / Hosting" },
  { label: "Rangoli / Creative Activities", value: "[ ] Rangoli / Creative Activities" },
  { label: "Decoration / Event Volunteers", value: "[ ] Decoration / Event Volunteers" },
  { label: "Other", value: "[ ] Other" },
];
const rehearsalOptions = ["Yes", "No", "Depends on schedule"];

function DiyaMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 44 44" fill="none" className="brand-mark">
      <path d="M22 5.5c4.5 5.2 4.5 9.6 0 13.2-4.5-3.6-4.5-8 0-13.2Z" fill="currentColor" />
      <path d="M10 24.5c3-3.2 7-4.8 12-4.8s9 1.6 12 4.8l-2.8 8.1c-.5 1.4-1.8 2.4-3.4 2.4H16.2c-1.6 0-2.9-1-3.4-2.4L10 24.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 29.2h14M18 33.2h8M6.5 19.2l2.8 1.1M37.5 19.2l-2.8 1.1M12.2 12.2l2 2M31.8 12.2l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FieldLabel({ children, required = false, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}{required && <span className="required-mark" aria-label="required">*</span>}
    </label>
  );
}

export default function Home() {
  const visibleForm = useRef<HTMLFormElement>(null);
  const googleForm = useRef<HTMLFormElement>(null);
  const submissionStarted = useRef(false);
  const [values, setValues] = useState({
    fullName: "", department: "", participation: "", participantType: "",
    groupName: "", groupSize: "", groupMembers: "", rehearsal: "", query: "",
  });
  const [submission, setSubmission] = useState<"idle" | "sending" | "success" | "error">("idle");

  const completion = useMemo(() => {
    const required = [values.fullName, values.department, values.participation, values.participantType, values.rehearsal, values.query];
    return Math.round((required.filter((value) => value.trim().length > 0).length / required.length) * 100);
  }, [values]);

  function setField(field: keyof typeof values, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "participantType" && value === "Individual"
        ? { groupName: "", groupSize: "", groupMembers: "" }
        : {}),
    }));
    if (submission === "error") setSubmission("idle");
  }

  function handleIframeLoad() {
    if (submissionStarted.current) {
      submissionStarted.current = false;
      setSubmission("success");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visibleForm.current?.reportValidity() || !googleForm.current) return;
    submissionStarted.current = true;
    setSubmission("sending");
    googleForm.current.requestSubmit();
    window.setTimeout(() => {
      if (submissionStarted.current) {
        submissionStarted.current = false;
        setSubmission("error");
      }
    }, 16000);
  }

  function resetForAnotherResponse() {
    setSubmission("idle");
    setValues({ fullName: "", department: "", participation: "", participantType: "", groupName: "", groupSize: "", groupMembers: "", rehearsal: "", query: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Navarathiri home"><DiyaMark /><span>Navarathiri</span></a>
        <a className="top-link" href="#registration">Student participation <ArrowDown size={14} strokeWidth={1.7} /></a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A CAMPUS CELEBRATION</p>
          <h1 id="hero-title">Bring your part<br />to the <em>celebration.</em></h1>
          <p className="hero-intro">Dance, music, making, welcoming—there’s a place for the way you want to take part.</p>
          <a className="hero-cta" href="#registration">Tell us how you’d like to join <ArrowDown size={15} /></a>
          <div className="hero-note"><span className="note-dot" /> A few details, then you’re on the programme.</div>
        </div>
        <figure className="hero-art">
          <img src="/manus-storage/async-images/UZG36l4ErOL0GTAS7lZ3Tr/image-1.webp" alt="Hand-drawn dancers celebrating together with dandiya sticks" fetchPriority="high" />
          <figcaption><span>MOVE TOGETHER</span><span>01 — NAVARATHIRI</span></figcaption>
          <span className="art-stamp" aria-hidden="true">N<span>·</span>9</span>
        </figure>
        <div className="hero-ornament" aria-hidden="true"><img src="/manus-storage/async-images/UZG36l4ErOL0GTAS7lZ3Tr/image-2.webp" alt="" /></div>
      </section>

      <section className="registration" id="registration" aria-labelledby="form-title">
        <div className="form-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> STUDENT PARTICIPATION</p>
            <h2 id="form-title">Your place in the festivities.</h2>
            <p className="form-intro">Tell us a little about yourself and how you’d like to be part of Navarathiri.</p>
          </div>
          <div className="progress-card" aria-label={`${completion}% of required fields completed`}>
            <div className="progress-label"><span>YOUR PROGRESS</span><span>{completion}%</span></div>
            <div className="progress-track" role="progressbar" aria-label="Required fields completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}><span style={{ width: `${completion}%` }} /></div>
            <span className="progress-caption">Fields marked <span className="required-mark">*</span> are required</span>
          </div>
        </div>

        {submission === "success" ? (
          <div className="success-panel" role="status" aria-live="polite">
            <div className="success-icon"><Check size={24} strokeWidth={1.7} /></div>
            <p className="eyebrow"><span className="eyebrow-line" /> RESPONSE SENT</p>
            <h3>You’re part of the celebration.</h3>
            <p>Your participation details have been sent. Thank you for bringing your energy to Navarathiri.</p>
            <button className="text-button" type="button" onClick={resetForAnotherResponse}>Send another response <ArrowUpRight size={15} /></button>
          </div>
        ) : (
          <form ref={visibleForm} className="form-body" onSubmit={handleSubmit} noValidate>
            <section className="form-section" aria-labelledby="section-about">
              <div className="section-index"><span>01</span><span className="section-rule" /></div>
              <div className="section-content">
                <div className="section-heading"><div><h3 id="section-about">First, the basics</h3><p>So we know who’s joining us.</p></div><Sparkles className="section-sparkle" size={17} strokeWidth={1.4} aria-hidden="true" /></div>
                <div className="field-grid">
                  <div className="field-group"><FieldLabel htmlFor="full-name" required>Full Name</FieldLabel><input id="full-name" name="fullName" autoComplete="name" placeholder="Your name as you’d like it listed" required value={values.fullName} onChange={(e) => setField("fullName", e.target.value)} /></div>
                  <div className="field-group"><FieldLabel htmlFor="department" required>Department/course</FieldLabel><input id="department" name="department" autoComplete="organization-title" placeholder="e.g. Computer Science, Year 2" required value={values.department} onChange={(e) => setField("department", e.target.value)} /></div>
                </div>
              </div>
            </section>

            <section className="form-section" aria-labelledby="section-participation">
              <div className="section-index"><span>02</span><span className="section-rule" /></div>
              <div className="section-content">
                <div className="section-heading"><div><h3 id="section-participation">How would you like to take part?</h3><p>Choose the one that feels most like you.</p></div></div>
                <fieldset className="choice-fieldset"><legend className="field-label">How would you like to participate?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="activity-grid">{participationOptions.map((option, index) => (
                    <label className={`activity-option ${values.participation === option.value ? "is-selected" : ""}`} key={option.value}>
                      <input type="radio" name="participation" value={option.value} required={index === 0} checked={values.participation === option.value} onChange={(e) => setField("participation", e.target.value)} />
                      <span className="activity-radio" aria-hidden="true"><span /></span><span className="activity-label">{option.label}</span>
                    </label>
                  ))}</div>
                </fieldset>
                <fieldset className="choice-fieldset type-fieldset"><legend className="field-label">Are you participating individually or as a group?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="type-options">{["Individual", "Group"].map((option, index) => (
                    <label className={`type-option ${values.participantType === option ? "is-selected" : ""}`} key={option}>
                      <input type="radio" name="participantType" value={option} required={index === 0} checked={values.participantType === option} onChange={(e) => setField("participantType", e.target.value)} />
                      <span className="type-indicator" aria-hidden="true"><span /></span><span><strong>{option}</strong><small>{option === "Group" ? "A shared performance or team" : "Just me, on my own"}</small></span>
                    </label>
                  ))}</div>
                </fieldset>
                {values.participantType === "Group" && <div className="group-details" aria-live="polite">
                  <div className="group-callout"><span className="group-flower" aria-hidden="true">✳</span><p><strong>A little about your group</strong><span>These details are optional, but help us plan.</span></p></div>
                  <div className="field-grid group-grid">
                    <div className="field-group"><FieldLabel htmlFor="group-name">If group participation, what is your group name?</FieldLabel><input id="group-name" name="groupName" placeholder="Your team or performance name" value={values.groupName} onChange={(e) => setField("groupName", e.target.value)} /></div>
                    <div className="field-group"><FieldLabel htmlFor="group-size">How many students are in your group?</FieldLabel><input id="group-size" name="groupSize" inputMode="numeric" placeholder="e.g. 6" value={values.groupSize} onChange={(e) => setField("groupSize", e.target.value)} /></div>
                    <div className="field-group field-span"><FieldLabel htmlFor="group-members">Names of other group members</FieldLabel><textarea id="group-members" name="groupMembers" rows={2} placeholder="One name per line, if you know them" value={values.groupMembers} onChange={(e) => setField("groupMembers", e.target.value)} /></div>
                  </div>
                </div>}
              </div>
            </section>

            <section className="form-section last-section" aria-labelledby="section-rehearsal">
              <div className="section-index"><span>03</span><span className="section-rule" /></div>
              <div className="section-content">
                <div className="section-heading"><div><h3 id="section-rehearsal">A couple more things</h3><p>Almost there. Help us get the details right.</p></div></div>
                <fieldset className="choice-fieldset rehearsal-fieldset"><legend className="field-label">Are you available for the rehearsal?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="rehearsal-options">{rehearsalOptions.map((option, index) => (
                    <label className={`rehearsal-option ${values.rehearsal === option ? "is-selected" : ""}`} key={option}>
                      <input type="radio" name="rehearsal" value={option} required={index === 0} checked={values.rehearsal === option} onChange={(e) => setField("rehearsal", e.target.value)} /><span className="rehearsal-indicator" aria-hidden="true"><span /></span>{option}
                    </label>
                  ))}</div>
                </fieldset>
                <div className="field-group query-group"><FieldLabel htmlFor="query" required>Any other query?</FieldLabel><textarea id="query" name="query" rows={3} placeholder="Anything you’d like the organisers to know…" required value={values.query} onChange={(e) => setField("query", e.target.value)} /></div>
              </div>
            </section>

            {submission === "error" && <div className="submit-error" role="alert">We couldn’t confirm the response. Please check your connection and try again, or <a href={SOURCE_FORM_URL} target="_blank" rel="noreferrer">open the original form</a>.</div>}
            <div className="submit-row"><p><span className="required-mark">*</span> Your answers go to the student event organisers.</p><button className="submit-button" type="submit" disabled={submission === "sending"}>{submission === "sending" ? "Sending your response…" : "Send my response"}{submission === "sending" ? <span className="button-spinner" aria-hidden="true" /> : <ArrowUpRight size={17} strokeWidth={1.8} />}</button></div>
            <p className="privacy-note">Your details are only used to coordinate Navarathiri participation.</p>
          </form>
        )}
      </section>

      <section className="closing-note" aria-label="Festival message"><img src="/manus-storage/async-images/UZG36l4ErOL0GTAS7lZ3Tr/image-2.webp" alt="" loading="lazy" /><div><span className="closing-kicker">MADE BETTER, TOGETHER</span><p>One campus. Many ways to celebrate.</p></div><span className="closing-mark" aria-hidden="true">✳</span></section>
      <footer className="footer"><a className="footer-brand" href="#top"><DiyaMark /><span>Navarathiri</span></a><span>STUDENT PARTICIPATION · MADE FOR THE CELEBRATION</span><a href="#top" className="back-top">Back to top ↑</a></footer>

      <iframe title="Google Forms submission response" name="navarathiri-response" className="submission-frame" onLoad={handleIframeLoad} />
      <form ref={googleForm} action={FORM_RESPONSE_URL} method="post" target="navarathiri-response" className="submission-frame-form" aria-hidden="true" tabIndex={-1}>
        <input type="hidden" name="entry.941419414" value={values.fullName} readOnly />
        <input type="hidden" name="entry.1913179975" value={values.department} readOnly />
        <input type="hidden" name="entry.1222232134" value={values.participation} readOnly />
        <input type="hidden" name="entry.1095210176" value={values.participantType} readOnly />
        <input type="hidden" name="entry.1233517186" value={values.participantType === "Group" ? values.groupName : ""} readOnly />
        <input type="hidden" name="entry.2142055540" value={values.participantType === "Group" ? values.groupSize : ""} readOnly />
        <input type="hidden" name="entry.249337187" value={values.participantType === "Group" ? values.groupMembers : ""} readOnly />
        <input type="hidden" name="entry.374927175" value={values.rehearsal} readOnly />
        <input type="hidden" name="entry.2103532593" value={values.query} readOnly />
        <input type="hidden" name="entry.1222232134_sentinel" value="" readOnly />
        <input type="hidden" name="entry.1095210176_sentinel" value="" readOnly />
        <input type="hidden" name="entry.374927175_sentinel" value="" readOnly />
        <input type="hidden" name="fvv" value="1" readOnly />
        <input type="hidden" name="partialResponse" value={'[null,null,"3618221304392008339"]'} readOnly />
        <input type="hidden" name="pageHistory" value="0" readOnly />
        <input type="hidden" name="fbzx" value="3618221304392008339" readOnly />
        <input type="hidden" name="submissionTimestamp" value="-1" readOnly />
      </form>
    </main>
  );
}
