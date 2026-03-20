type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
};

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
      {label}
      <input
        type={type}
        className={`rounded-xl border px-3 py-2 text-sm text-ink ${
          error ? "border-ember bg-ember/5" : "border-ink/10 bg-canvas"
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
      {error && <span className="text-[11px] tracking-normal text-ember">{error}</span>}
    </label>
  );
}
