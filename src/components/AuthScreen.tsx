import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, Eye, EyeOff, LogIn } from "lucide-react";
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
    setError("");
    setBusy(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = err instanceof Error && "code" in err ? String((err as { code?: unknown }).code) : "";
      if (code.includes("invalid-credential") || code.includes("invalid-login-credentials")) {
        setError("The email or password is incorrect.");
      } else if (code.includes("too-many-requests")) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else if (code.includes("user-disabled")) {
        setError("This account has been disabled.");
      } else {
        setError("We could not sign you in. Please check your details and try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-screen">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark">C</div>
          <div>
            <strong>Chaos Control</strong>
            <span>Personal productivity, under control.</span>
          </div>
        </div>

        <div className="auth-copy">
          <p className="auth-eyebrow">Welcome back</p>
          <h1>Sign in to your workspace</h1>
          <p>Use the email and password associated with your Chaos Control account.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>Email address</span>
            <div className="auth-input">
              <Mail size={17} />
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="auth-input">
              <LockKeyhole size={17} />
              <input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}

          <button className="auth-submit" type="submit" disabled={busy}>
            <LogIn size={17} />
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">Access is invitation-only. If you need an account, contact your workspace administrator.</p>
      </div>
    </main>
  );
}
