import { useState, type FormEvent } from "react";
import type { BasketView } from "../types";
import { InputField } from "./InputField";

type DeliveryFormProps = {
  basket: BasketView | null;
  onSubmit: (payload: {
    address: string;
    phone: string;
    email: string;
    paymentMethod: "card" | "cash" | "online";
  }) => void;
};

export function DeliveryForm({ basket, onSubmit }: DeliveryFormProps) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "online">(
    "card"
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!address.trim()) nextErrors.address = "Address is required.";
    if (!phone.trim()) nextErrors.phone = "Phone is required.";
    if (!/^[+()\d\s-]{7,}$/.test(phone)) nextErrors.phone = "Phone is invalid.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Email is invalid.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ address, phone, email, paymentMethod });
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} data-delivery>
      <InputField
        label="Delivery address"
        placeholder="12 Pizzeria St, Minsk"
        value={address}
        onChange={setAddress}
        error={fieldErrors.address}
      />
      <InputField
        label="Phone"
        placeholder="+375 29 111 22 33"
        value={phone}
        onChange={setPhone}
        error={fieldErrors.phone}
      />
      <InputField
        label="Email"
        placeholder="lena@example.com"
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
      />
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
        Payment
        <select
          className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as "card" | "cash" | "online")
          }
        >
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
      </label>
      <div className="rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm text-ink/70">
        <div className="flex items-center justify-between text-ink">
          <span>Total</span>
          <span>{basket ? `$${basket.total.toFixed(2)}` : "$0.00"}</span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-ink/50">
          Delivery in 40 minutes
        </p>
      </div>
      <button className="mt-2 rounded-full bg-ember px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110">
        Confirm delivery
      </button>
    </form>
  );
}
