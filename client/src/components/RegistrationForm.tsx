import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { User } from "../types";
import { InputField } from "./InputField";

type RegistrationFormProps = {
  onSuccess: (user: User) => void;
};

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    login: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Email is invalid.";
    if (!form.login.trim()) nextErrors.login = "Login is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!/^[+()\d\s-]{7,}$/.test(form.phone)) nextErrors.phone = "Phone is invalid.";
    if (!form.password.trim()) nextErrors.password = "Password is required.";
    if (form.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 chars.";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    try {
      const data = await api.post<User>("/users/register", form);
      onSuccess(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} data-registration>
      <InputField
        label="Full name"
        placeholder="Lena Moroz"
        value={form.name}
        onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
        error={fieldErrors.name}
      />
      <InputField
        label="Email"
        placeholder="lena@example.com"
        value={form.email}
        onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
        error={fieldErrors.email}
      />
      <InputField
        label="Login"
        placeholder="lenamoroz"
        value={form.login}
        onChange={(value) => setForm((prev) => ({ ...prev, login: value }))}
        error={fieldErrors.login}
      />
      <InputField
        label="Phone"
        placeholder="+375 29 111 22 33"
        value={form.phone}
        onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
        error={fieldErrors.phone}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        value={form.password}
        onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
        error={fieldErrors.password}
      />
      {error && <p className="text-sm text-ember">{error}</p>}
      <button className="mt-2 rounded-full bg-ember px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110">
        Create account
      </button>
    </form>
  );
}
