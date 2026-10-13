import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowDownToLine, ArrowLeft, LoaderCircle, LogOut, RefreshCw } from "lucide-react";
import NavarathiriWordmark from "@/components/NavarathiriWordmark";

type Registration = {
  id: string;
  fullName: string;
  department: string;
  participation: string;
  participantType: "Individual" | "Group";
  groupName: string;
  groupSize: string;
  groupMembers: string;
  rehearsal: string;
  query: string;
  createdAt: string;
};

type DashboardState = "checking" | "locked" | "ready";

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

function submittedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? ""
    : new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function Admin() {
  const [state, setState] = useState<DashboardState>("checking");
  const [pin, setPin] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [entries, setEntries] = useState<Registration[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [message, setMessage] = useState("");

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/registrations", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Registration storage is available after the Render deployment is connected.");
      }
      const data = await responseJson(response);
      if (response.status === 401) {
        setEntries([]);
        setState("locked");
        setMessage("Your access session has expired. Enter the organiser code again.");
        return;
      }
      if (!response.ok || !Array.isArray(data.entries)) {
        throw new Error("Could not load registrations. Try again.");
      }
      setEntries(data.entries as Registration[]);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load registrations. Try again.");
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!active) return;
        if (!response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Organiser access is available after the Render deployment is connected.");
        }
        if (response.ok) {
          setState("ready");
          await loadEntries();
        } else {
          setState("locked");
        }
      } catch (error) {
        if (active) {
          setState("locked");
          setMessage(error instanceof Error ? error.message : "The organiser dashboard is not reachable right now.");
        }
      }
    }
    void checkSession();
    return () => {
      active = false;
    };
  }, [loadEntries]);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pinBusy || !/^\d{6}$/.test(pin)) {
      setMessage("Enter the six-digit organiser code.");
      return;
    }
    setPinBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pin }),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Organiser access is available after the Render deployment is connected.");
      }
      const data = await responseJson(response);
      if (!response.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Code not accepted.");
      }
      setPin("");
      setState("ready");
      await loadEntries();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Code not accepted. Try again.");
    } finally {
      setPinBusy(false);
    }
  }

  async function logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
    } catch {
      // Clear the local view even if the network has already dropped.
    } finally {
      setEntries([]);
      setPin("");
      setState("locked");
      setMessage("");
    }
  }

  return (
    <main className="site-shell admin-shell">
      <header className="admin-topbar">
        <a className="wordmark" href="/" aria-label="Navarathiri home">
          <img
            src="/artwork/navarathiri-seal.webp"
            className="brand-mark"
            alt=""
            aria-hidden="true"
            width="64"
            height="64"
          />
          <NavarathiriWordmark compact />
        </a>
        <a className="admin-back" href="/"><ArrowLeft size={15} /> Public registration</a>
      </header>

      <section className="admin-main" aria-labelledby="admin-title" aria-busy={state === "checking"}>
        {state === "checking" ? (
          <div className="admin-lock-panel" role="status">
            <LoaderCircle size={22} className="admin-spinner" />
            <p>Checking organiser access…</p>
          </div>
        ) : state === "locked" ? (
          <div className="admin-lock-panel">
            <p className="section-kicker">SNS × NIAT</p>
            <h1 id="admin-title">Organiser access</h1>
            <p className="admin-description">Enter the organiser code to view registrations.</p>
            <form className="admin-pin-form" onSubmit={handleUnlock}>
              <label htmlFor="admin-code" className="field-label">Six-digit code</label>
              <input
                id="admin-code"
                name="code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                autoComplete="current-password"
                autoFocus
                required
                value={pin}
                onChange={(event) => {
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setMessage("");
                }}
                aria-describedby={message ? "admin-message" : undefined}
              />
              {message && <p id="admin-message" className="admin-message" role="alert">{message}</p>}
              <button className="submit-button admin-unlock" type="submit" disabled={pinBusy}>
                {pinBusy ? "Checking…" : "Unlock registrations"}
                {pinBusy ? <LoaderCircle size={17} className="admin-spinner" /> : <ArrowDownToLine size={17} />}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="admin-heading">
              <div>
                <p className="section-kicker">ORGANISER DASHBOARD</p>
                <h1 id="admin-title">Registrations</h1>
              </div>
              <div className="admin-actions">
                <button className="admin-action" type="button" onClick={() => void loadEntries()} disabled={loadingEntries}>
                  <RefreshCw size={15} className={loadingEntries ? "admin-spinner" : ""} /> Refresh
                </button>
                <a className={`admin-action ${entries.length === 0 ? "is-disabled" : ""}`} href={entries.length ? "/api/admin/export.csv" : undefined} aria-disabled={entries.length === 0}>
                  <ArrowDownToLine size={15} /> CSV
                </a>
                <button className="admin-action" type="button" onClick={() => void logout()}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </div>

            <p className="admin-retention">Free Render database: export registrations before the 30-day expiry.</p>
            {message && <p className="admin-message" role="alert">{message}</p>}
            <section className="admin-table-card" aria-label="Registration list">
              <div className="admin-table-heading">
                <strong>{entries.length}</strong>
                <span>{entries.length === 1 ? "registration" : "registrations"}</span>
              </div>
              {entries.length === 0 ? (
                <div className="admin-empty">
                  {loadingEntries ? (
                    <LoaderCircle size={21} className="admin-spinner" />
                  ) : (
                    <p>{message ? "Registration list unavailable." : "No registrations yet."}</p>
                  )}
                </div>
              ) : (
                <div className="admin-table-scroll" role="region" aria-label="All submitted registration details" tabIndex={0}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Submitted</th>
                        <th>Full name</th>
                        <th>Department/course</th>
                        <th>Participation</th>
                        <th>Individual or group</th>
                        <th>Group name</th>
                        <th>Group size</th>
                        <th>Other group members</th>
                        <th>Rehearsal</th>
                        <th>Any other query?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{submittedAt(entry.createdAt)}</td>
                          <td>{entry.fullName}</td>
                          <td>{entry.department}</td>
                          <td>{entry.participation}</td>
                          <td>{entry.participantType}</td>
                          <td>{entry.groupName || "—"}</td>
                          <td>{entry.groupSize || "—"}</td>
                          <td>{entry.groupMembers || "—"}</td>
                          <td>{entry.rehearsal}</td>
                          <td className="admin-query-cell">{entry.query}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </section>
      <footer className="admin-footer">
        <span>SNS College of Technology</span>
        <span>Coimbatore × NIAT</span>
      </footer>
    </main>
  );
}
