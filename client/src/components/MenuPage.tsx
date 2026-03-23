import type { Dispatch, SetStateAction } from "react";
import type { Product } from "../types";
import type { Filters } from "./app-types";

type MenuPageProps = {
  availableCount: number;
  categories: string[];
  filters: Filters;
  products: Product[];
  quantities: Record<number, number>;
  loading: boolean;
  formatPrice: (value: number) => string;
  onFiltersChange: Dispatch<SetStateAction<Filters>>;
  onQuantityChange: (productId: number, next: number) => void;
  onAddToBasket: (productId: number) => void;
};

export function MenuPage({
  availableCount,
  categories,
  filters,
  products,
  quantities,
  loading,
  formatPrice,
  onFiltersChange,
  onQuantityChange,
  onAddToBasket,
}: MenuPageProps) {
  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 rounded-3xl bg-ember/5 p-8 shadow-glow lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ember">
            Artisan pizzeria
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Fired in stone, finished with heat.
          </h1>
          <p className="text-sm text-ink/70 md:text-base">
            Build your basket from our seasonal pizzas, filter by spice or category,
            then head to delivery when you are ready.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-ink/60">
            <span>32cm stone pies</span>
            <span>Quick 15 min bake</span>
            <span>Fresh daily dough</span>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="h-56 w-56 rounded-full bg-[conic-gradient(from_90deg,theme(colors.ember),#ffb347,#ff8c42,#d1495b)] p-1 shadow-glow">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-canvas text-center">
              <span className="text-2xl font-semibold text-ink">{availableCount} pizzas</span>
              <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
                available today
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Filters</p>
            <h2 className="text-lg font-semibold text-ink">Shape your order</h2>
          </div>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
            Search
            <input
              className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
              placeholder="Margherita, basil..."
              value={filters.search}
              onChange={(event) =>
                onFiltersChange((prev) => ({ ...prev, search: event.target.value }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
            Category
            <select
              className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
              value={filters.category}
              onChange={(event) =>
                onFiltersChange((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
            Sort by
            <select
              className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
              value={filters.sort}
              onChange={(event) =>
                onFiltersChange((prev) => ({
                  ...prev,
                  sort: event.target.value as Filters["sort"],
                }))
              }
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink/60">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(event) =>
                onFiltersChange((prev) => ({
                  ...prev,
                  availableOnly: event.target.checked,
                }))
              }
            />
            Available only
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
              Min
              <input
                className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
                placeholder="7"
                value={filters.minPrice}
                onChange={(event) =>
                  onFiltersChange((prev) => ({ ...prev, minPrice: event.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ink/50">
              Max
              <input
                className="rounded-xl border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink"
                placeholder="12"
                value={filters.maxPrice}
                onChange={(event) =>
                  onFiltersChange((prev) => ({ ...prev, maxPrice: event.target.value }))
                }
              />
            </label>
          </div>
        </aside>

        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((product) => {
            const qty = quantities[product.id] ?? 1;
            return (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-ember/80">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-semibold text-ink" data-title>
                      {product.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-ink/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-ink/70">
                    {product.size}
                  </span>
                </div>
                <p className="text-sm text-ink/70">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-ink" data-price>
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-ink/50">Spice level: {product.spice}/3</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                      product.available ? "bg-ember/20 text-ember" : "bg-ink/5 text-ink/50"
                    }`}
                  >
                    {product.available ? "Ready" : "Out"}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-canvas px-3 py-2 text-sm text-ink">
                    <button type="button" onClick={() => onQuantityChange(product.id, qty - 1)}>
                      -
                    </button>
                    <span className="min-w-[24px] text-center">{qty}</span>
                    <button type="button" onClick={() => onQuantityChange(product.id, qty + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    className="rounded-full bg-ember px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 disabled:opacity-50"
                    onClick={() => onAddToBasket(product.id)}
                    disabled={!product.available || loading}
                  >
                    Add
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
