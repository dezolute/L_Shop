import type { User } from "../types";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";

type RegisterPageProps = {
  onRegisterSuccess: (user: User) => void;
  onLoginSuccess: (user: User) => void;
};

export function RegisterPage({
  onRegisterSuccess,
  onLoginSuccess,
}: RegisterPageProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Registration</p>
        <h2 className="text-2xl font-semibold text-ink">Create an account</h2>
        <RegistrationForm onSuccess={onRegisterSuccess} />
      </div>
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Login</p>
        <h2 className="text-2xl font-semibold text-ink">Sign back in</h2>
        <LoginForm onSuccess={onLoginSuccess} />
      </div>
    </section>
  );
}
