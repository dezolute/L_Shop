import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { User } from "../types";
import { InputField } from "./InputField";

type LoginFormProps = {
  onSuccess: (user: User) => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = "Identifier is required.";
    if (!password.trim()) nextErrors.password = "Password is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    try {
      const data = await api.post<User>("/users/login", {
        identifier,
        password,
      });
      onSuccess(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
      <InputField
        label="Name / email / login / phone"
        placeholder="lena@example.com"
        value={identifier}
        onChange={setIdentifier}
        error={fieldErrors.identifier}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
      />
      {error && <p className="text-sm text-ember">{error}</p>}
      <button className="mt-2 rounded-full bg-ink/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition hover:bg-ink/20">
        Sign in
      </button>
    </form>
  );
}
