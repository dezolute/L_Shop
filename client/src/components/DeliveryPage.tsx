import type { BasketView, Delivery } from "../types";
import { DeliveryForm } from "./DeliveryForm";

type DeliveryPageProps = {
  userSignedIn: boolean;
  basket: BasketView | null;
  deliveries: Delivery[];
  formatPrice: (value: number) => string;
  onSubmit: (payload: {
    address: string;
    phone: string;
    email: string;
    paymentMethod: "card" | "cash" | "online";
  }) => void;
};

export function DeliveryPage({
  userSignedIn,
  basket,
  deliveries,
  formatPrice,
  onSubmit,
}: DeliveryPageProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">Delivery details</h2>
        {!userSignedIn ? (
          <p className="mt-4 text-sm text-ink/70">Sign in to complete delivery.</p>
        ) : (
          <DeliveryForm basket={basket} onSubmit={onSubmit} />
        )}
      </div>
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Recent deliveries</h3>
        {deliveries.length === 0 ? (
          <p className="mt-4 text-sm text-ink/70">No deliveries yet.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm text-ink/70"
              >
                <div className="flex items-center justify-between text-ink">
                  <span>Order #{delivery.id}</span>
                  <span>{formatPrice(delivery.total)}</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink/50">
                  {delivery.paymentMethod}
                </p>
                <p className="mt-1">{delivery.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
