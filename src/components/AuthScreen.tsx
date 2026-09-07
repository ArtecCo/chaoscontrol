import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;
    setError(""); setBusy(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch (err) {
      const code = err instanceof Error && "code" in err ? String((err as { code?: unknown }).code) : "";
      if (code.includes("invalid-credential") || code.includes("invalid-login-credentials")) setError("The email or password is incorrect.");
      else if (code.includes("too-many-requests")) setError("Too many attempts. Please wait a moment and try again.");
      else if (code.includes("user-disabled")) setError("This account has been disabled.");
      else setError("We could not sign you in. Please check your details and try again.");
    } finally { setBusy(false); }
  };

  return (
    <main className="auth-screen">
      <div className="auth-shell">
        <section className="auth-brand-panel">
          <div className="auth-brand-large"><div className="auth-brand-mark">C</div><div><strong>Chaos Control</strong><span>Work organized. Chaos contained.</span></div></div>
          <div className="auth-hero-copy">
            <span className="auth-kicker">PRIVATE WORKSPACE</span>
            <h1>Bring order to<br /><em>the chaos.</em></h1>
            <p>A focused workspace for turning everything on your mind into work you can actually move forward.</p>
          </div>
          <div className="auth-feature-list">
            <span><i /> Structured boards and workflows</span>
            <span><i /> Checklists, priorities and due dates</span>
            <span><i /> Secure cloud synchronization</span>
          </div>
          <div className="auth-brand-footer">CHAOS CONTROL <span>•</span> PERSONAL PRODUCTIVITY</div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-head">
            <div className="auth-mobile-mark">C</div>
            <div><span className="auth-eyebrow">Welcome back</span><h2>Sign in</h2><p>Enter your credentials to continue to your workspace.</p></div>
          </div>
          <form className="auth-form" onSubmit={submit}>
            <label><span>Email address</span><div className="auth-input"><Mail size={16} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></div></label>
            <label><span>Password</span><div className="auth-input"><LockKeyhole size={16} /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
            {error ? <div className="auth-error" role="alert">{error}</div> : null}
            <button className="auth-submit" type="submit" disabled={busy}><LogIn size={16} />{busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <div className="auth-secure-note"><ShieldCheck size={14} /><span>Your workspace is protected with Firebase Authentication.</span></div>
          <p className="auth-footer">Access is invitation-only. If you need an account, contact your workspace administrator.</p>
        </section>
      </div>
    </main>
  );
}
