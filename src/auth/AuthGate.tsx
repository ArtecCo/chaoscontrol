import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, firebaseConfigured } from "../firebase";
import AuthScreen from "../components/AuthScreen";

interface Props {
  children: ReactNode;
}

export default function AuthGate({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setChecking(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setChecking(false);
    });
  }, []);

  if (!firebaseConfigured) return <>{children}</>;

  if (checking) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <div className="auth-brand-mark">C</div>
        <strong>Loading Chaos Control</strong>
        <span>Checking your session…</span>
      </div>
    );
  }

  return user ? <>{children}</> : <AuthScreen />;
}
