import type { BasketView } from "../types";

type BasketPageProps = {
  userSignedIn: boolean;
  basket: BasketView | null;
  formatPrice: (value: number) => string;
  onBasketUpdate: (productId: number, next: number) => void;
  onBasketRemove: (productId: number) => void;
  onGoToDelivery: () => void;
};

export function BasketPage({
  userSignedIn,
  basket,
  formatPrice,
  onBasketUpdate,
  onBasketRemove,
  onGoToDelivery,
}: BasketPageProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">Basket</h2>
        {!userSignedIn ? (
          <p className="mt-4 text-sm text-ink/70">Sign in to view your basket.</p>
        ) : basket && basket.items.length > 0 ? (
          <div className="mt-6 flex flex-col gap-4">
            {basket.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-canvas px-4 py-3"
              >
                <div>
                  <p className="text-lg font-semibold text-ink" data-title="basket">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-ink/60">
                    {item.product.size} - {item.product.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink">
                    <button
                      type="button"
                      onClick={() => onBasketUpdate(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onBasketUpdate(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-ink" data-price="basket">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button
                    className="text-xs uppercase tracking-[0.3em] text-ink/60 hover:text-ember"
                    onClick={() => onBasketRemove(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink/70">
            Basket is empty. Add some pizzas from the menu.
          </p>
        )}
      </div>
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">Summary</h3>
        <div className="mt-4 flex items-center justify-between text-ink/70">
          <span>Total</span>
          <span className="text-xl font-semibold text-ink">
            {formatPrice(basket?.total ?? 0)}
          </span>
        </div>
        <button
          className="mt-6 w-full rounded-full bg-ember px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110 disabled:opacity-50"
          onClick={onGoToDelivery}
          disabled={!basket || basket.items.length === 0}
        >
          Go to delivery
        </button>
      </div>
    </section>
  );
}
