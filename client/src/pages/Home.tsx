import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";

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

function DanceMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" className="brand-mark">
      <path d="M30 7c4.4-2 8.1 1.1 7.6 5-.4 3.8-5.3 5.2-8.1 2.7-2.5-2.2-1.7-6.2.5-7.7Z" fill="#E54376" stroke="#25265B" strokeWidth="1.35" />
      <path d="m31 17 1.6 9.1-8.8 7.8m8.8-7.8 8.7 7.2m-9-7.1 7.5-7.8m-7.7 7.8-8-7.6" stroke="#25265B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m24.2 18.3-6.8-8.6m23.4 9.6 7.7-8.2" stroke="#2455C7" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 34c4.8-3.4 11.6-3.6 17.3.1l5.3 8.8c.7 1.2 0 2.5-1.5 2.7L31 48.1l-13.2-3.4c-1.2-.3-1.7-1.7-.9-2.8l7.1-7.9Z" fill="#F2AE29" stroke="#25265B" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M23.1 37.7c4.5 2.4 12.9 2.8 19.7.1M21.6 42c6.1 2.5 13.7 2.7 21.2.2" stroke="#E54376" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14.3 51.1c4.4-3.1 10.1-4.1 16.7-3.1 7.6 1.2 13.2 1.1 19.2-1.4" stroke="#18866F" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 27.5c1.6-1.8 3.6-2.4 6.1-1.7m27-1.1c2.4-.3 4.4.5 5.8 2.4m-38 9.2 2.3-1m36.1 2.5 2 1.4" stroke="#D87A23" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m15.3 17.5 1.2 1.3m34.4 14.1 1.1 1.7m-41.8 4.3 1.6.4m39.3-22.2 1.7-.5" stroke="#E54376" strokeWidth="2" strokeLinecap="round" />
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
        <a className="wordmark" href="#top" aria-label="Navarathiri home"><DanceMark /><span>Navarathiri</span></a>
        <div className="header-partners"><span>SNS College of Technology</span><span>Coimbatore <b>×</b> NIAT</span></div>
        <a className="top-link" href="#registration">Register <ArrowDown size={15} /></a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="event-place"><span>SNS College of Technology</span><span>Coimbatore <b>×</b> NIAT</span></p>
          <h1 id="hero-title">Navarathiri</h1>
          <p className="hero-intro">Dance, perform, create or help bring the celebration to life.</p>
          <a className="hero-cta" href="#registration">Register to take part <ArrowDown size={16} /></a>
        </div>
        <figure className="hero-art">
          <img src="/manus-storage/async-images/rLFafWYbhXQtywfwx31kCO/image-1.webp" alt="A hand-drawn group of friends celebrating Navarathiri with garba and dandiya" fetchPriority="high" />
          <figcaption>Navarathiri at SNS College of Technology</figcaption>
        </figure>
      </section>

      <section className="art-strip" aria-label="Hand-drawn Navarathiri illustrations">
        <figure className="art-tile tile-dance"><img src="/manus-storage/async-images/rLFafWYbhXQtywfwx31kCO/image-2.webp" alt="A hand-drawn dancer holding dandiya sticks" loading="lazy" /><figcaption>Dance</figcaption></figure>
        <figure className="art-tile tile-music"><img src="/manus-storage/async-images/rLFafWYbhXQtywfwx31kCO/image-3.webp" alt="A hand-drawn dhol player" loading="lazy" /><figcaption>Music</figcaption></figure>
        <figure className="art-tile tile-rangoli"><img src="/manus-storage/async-images/rLFafWYbhXQtywfwx31kCO/image-4.webp" alt="A hand-drawn Navarathiri rangoli with diya and dandiya" loading="lazy" /><figcaption>Rangoli and crafts</figcaption></figure>
      </section>

      <section className="registration" id="registration" aria-labelledby="form-title">
        <div className="form-heading">
          <div><p className="section-kicker">STUDENT REGISTRATION</p><h2 id="form-title">How will you take part?</h2></div>
          <p className="required-note">Questions marked <span className="required-mark">*</span> are required.</p>
        </div>

        {submission === "success" ? (
          <div className="success-panel" role="status" aria-live="polite">
            <span className="success-illustration"><Check size={29} strokeWidth={1.8} /></span>
            <p className="section-kicker">RESPONSE SENT</p>
            <h3>See you at Navarathiri.</h3>
            <p>Your participation details have been sent to the event organisers.</p>
            <button className="text-button" type="button" onClick={resetForAnotherResponse}>Send another response <ArrowUpRight size={16} /></button>
          </div>
        ) : (
          <form ref={visibleForm} className="form-body" onSubmit={handleSubmit} noValidate>
            <section className="form-section" aria-labelledby="section-about">
              <div className="section-number number-coral">01</div>
              <div className="section-content">
                <h3 id="section-about">Your details</h3>
                <div className="field-grid">
                  <div className="field-group"><FieldLabel htmlFor="full-name" required>Full Name</FieldLabel><input id="full-name" name="fullName" autoComplete="name" placeholder="Full name" required value={values.fullName} onChange={(e) => setField("fullName", e.target.value)} /></div>
                  <div className="field-group"><FieldLabel htmlFor="department" required>Department/course</FieldLabel><input id="department" name="department" autoComplete="organization-title" placeholder="Department or course" required value={values.department} onChange={(e) => setField("department", e.target.value)} /></div>
                </div>
              </div>
            </section>

            <section className="form-section" aria-labelledby="section-participation">
              <div className="section-number number-blue">02</div>
              <div className="section-content">
                <h3 id="section-participation">Your participation</h3>
                <fieldset className="choice-fieldset"><legend className="field-label">How would you like to participate?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="activity-grid">{participationOptions.map((option, index) => (
                    <label className={`activity-option ${values.participation === option.value ? "is-selected" : ""}`} key={option.value}>
                      <input type="radio" name="participation" value={option.value} required={index === 0} checked={values.participation === option.value} onChange={(e) => setField("participation", e.target.value)} />
                      <span className="radio-art" aria-hidden="true"><span /></span><span className="activity-label">{option.label}</span>
                    </label>
                  ))}</div>
                </fieldset>
                <fieldset className="choice-fieldset type-fieldset"><legend className="field-label">Are you participating individually or as a group?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="type-options">{["Individual", "Group"].map((option, index) => (
                    <label className={`type-option ${values.participantType === option ? "is-selected" : ""}`} key={option}>
                      <input type="radio" name="participantType" value={option} required={index === 0} checked={values.participantType === option} onChange={(e) => setField("participantType", e.target.value)} />
                      <span className="radio-art" aria-hidden="true"><span /></span><strong>{option}</strong>
                    </label>
                  ))}</div>
                </fieldset>
                {values.participantType === "Group" && <div className="group-details" aria-live="polite">
                  <div className="group-heading"><h4>Group details</h4><span>Optional</span></div>
                  <div className="field-grid group-grid">
                    <div className="field-group"><FieldLabel htmlFor="group-name">If group participation, what is your group name?</FieldLabel><input id="group-name" name="groupName" placeholder="Group name" value={values.groupName} onChange={(e) => setField("groupName", e.target.value)} /></div>
                    <div className="field-group"><FieldLabel htmlFor="group-size">How many students are in your group?</FieldLabel><input id="group-size" name="groupSize" inputMode="numeric" placeholder="Number of students" value={values.groupSize} onChange={(e) => setField("groupSize", e.target.value)} /></div>
                    <div className="field-group field-span"><FieldLabel htmlFor="group-members">Names of other group members</FieldLabel><textarea id="group-members" name="groupMembers" rows={2} placeholder="Names of other group members" value={values.groupMembers} onChange={(e) => setField("groupMembers", e.target.value)} /></div>
                  </div>
                </div>}
              </div>
            </section>

            <section className="form-section last-section" aria-labelledby="section-rehearsal">
              <div className="section-number number-green">03</div>
              <div className="section-content">
                <h3 id="section-rehearsal">Rehearsal and questions</h3>
                <fieldset className="choice-fieldset rehearsal-fieldset"><legend className="field-label">Are you available for the rehearsal?<span className="required-mark" aria-label="required">*</span></legend>
                  <div className="rehearsal-options">{rehearsalOptions.map((option, index) => (
                    <label className={`rehearsal-option ${values.rehearsal === option ? "is-selected" : ""}`} key={option}>
                      <input type="radio" name="rehearsal" value={option} required={index === 0} checked={values.rehearsal === option} onChange={(e) => setField("rehearsal", e.target.value)} /><span className="radio-art" aria-hidden="true"><span /></span>{option}
                    </label>
                  ))}</div>
                </fieldset>
                <div className="field-group query-group"><FieldLabel htmlFor="query" required>Any other query?</FieldLabel><textarea id="query" name="query" rows={3} placeholder="Any other query?" required value={values.query} onChange={(e) => setField("query", e.target.value)} /></div>
              </div>
            </section>

            {submission === "error" && <div className="submit-error" role="alert">We couldn’t confirm that your response was sent. Please try again or <a href={SOURCE_FORM_URL} target="_blank" rel="noreferrer">open the original form</a>.</div>}
            <div className="submit-row"><button className="submit-button" type="submit" disabled={submission === "sending"}>{submission === "sending" ? "Sending response…" : "Submit registration"}{submission === "sending" ? <span className="button-spinner" aria-hidden="true" /> : <ArrowUpRight size={18} />}</button></div>
          </form>
        )}
      </section>

      <footer className="footer"><a className="footer-brand" href="#top"><DanceMark /><span>Navarathiri</span></a><p>SNS College of Technology<br />Coimbatore <b>×</b> NIAT</p><a href="#top" className="back-top">Back to top ↑</a></footer>

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
