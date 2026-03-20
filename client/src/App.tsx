import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { AppHeader } from "./components/AppHeader";
import { type Filters, initialFilters, type Route } from "./components/app-types";
import { BasketPage } from "./components/BasketPage";
import { DeliveryPage } from "./components/DeliveryPage";
import { MenuPage } from "./components/MenuPage";
import { MessageBanner } from "./components/MessageBanner";
import { RegisterPage } from "./components/RegisterPage";
import type { BasketView, Delivery, Product, User } from "./types";

function App() {
  const [route, setRoute] = useState<Route>(toRoute(window.location.pathname));
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketView | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messageDelayMs = 4000;

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return Array.from(unique);
  }, [products]);

  const availableCount = useMemo(
    () => products.filter((product) => product.available).length,
    [products]
  );

  const loadProducts = useCallback(async (nextFilters: Filters) => {
    const params = new URLSearchParams();
    if (nextFilters.search) params.set("search", nextFilters.search);
    if (nextFilters.sort) params.set("sort", nextFilters.sort);
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.availableOnly) params.set("available", "true");
    if (nextFilters.minPrice) params.set("minPrice", nextFilters.minPrice);
    if (nextFilters.maxPrice) params.set("maxPrice", nextFilters.maxPrice);
    const data = await api.get<Product[]>(`/products?${params.toString()}`);
    setProducts(data);
  }, []);

  const loadBasket = useCallback(async () => {
    try {
      const data = await api.get<BasketView>("/basket");
      setBasket(data);
    } catch {
      setBasket(null);
    }
  }, []);

  const loadDeliveries = useCallback(async () => {
    try {
      const data = await api.get<Delivery[]>("/delivery");
      setDeliveries(data);
    } catch {
      setDeliveries([]);
    }
  }, []);

  useEffect(() => {
    const handlePop = () => {
      setRoute(toRoute(window.location.pathname));
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    api
      .get<User>("/users/me")
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), messageDelayMs);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    loadProducts(filters);
  }, [filters, loadProducts]);

  useEffect(() => {
    if (!user) {
      setBasket(null);
      setDeliveries([]);
      return;
    }
    loadBasket();
    loadDeliveries();
  }, [user, loadBasket, loadDeliveries]);

  const navigate = (path: Route) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const handleAddToBasket = async (productId: number) => {
    if (!user) {
      setMessage("Sign in to add items to your basket.");
      navigate("/register");
      return;
    }

    const qty = quantities[productId] ?? 1;
    setLoading(true);
    try {
      const data = await api.post<BasketView>("/basket/items", {
        productId,
        quantity: qty,
      });
      setBasket(data);
      setMessage("Added to basket.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: number, next: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, next),
    }));
  };

  const handleBasketUpdate = async (productId: number, next: number) => {
    if (!user) return;
    const data = await api.patch<BasketView>(`/basket/items/${productId}`, {
      quantity: next,
    });
    setBasket(data);
  };

  const handleBasketRemove = async (productId: number) => {
    if (!user) return;
    const data = await api.delete<BasketView>(`/basket/items/${productId}`);
    setBasket(data);
  };

  const handleDeliverySubmit = async (payload: {
    address: string;
    phone: string;
    email: string;
    paymentMethod: "card" | "cash" | "online";
  }) => {
    if (!basket || basket.items.length === 0) {
      setMessage("Add items before delivery.");
      return;
    }

    try {
      await api.post<Delivery>("/delivery", payload);
      await loadBasket();
      await loadDeliveries();
      setMessage("Delivery created. Thank you!");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handleLogout = async () => {
    await api.post("/users/logout");
    setUser(null);
    setMessage("Signed out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <AppHeader
        route={route}
        userName={user?.name}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
      {message && <MessageBanner message={message} onDismiss={() => setMessage("")} />}

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
        {route === "/" && (
          <MenuPage
            availableCount={availableCount}
            categories={categories}
            filters={filters}
            products={products}
            quantities={quantities}
            loading={loading}
            formatPrice={formatPrice}
            onFiltersChange={setFilters}
            onQuantityChange={updateQuantity}
            onAddToBasket={handleAddToBasket}
          />
        )}

        {route === "/register" && (
          <RegisterPage
            onRegisterSuccess={(data) => {
              setUser(data);
              setMessage("Welcome to Forno Rosso!");
              navigate("/");
            }}
            onLoginSuccess={(data) => {
              setUser(data);
              setMessage("Welcome back!");
              navigate("/");
            }}
          />
        )}

        {route === "/basket" && (
          <BasketPage
            userSignedIn={Boolean(user)}
            basket={basket}
            formatPrice={formatPrice}
            onBasketUpdate={handleBasketUpdate}
            onBasketRemove={handleBasketRemove}
            onGoToDelivery={() => navigate("/delivery")}
          />
        )}

        {route === "/delivery" && (
          <DeliveryPage
            userSignedIn={Boolean(user)}
            basket={basket}
            deliveries={deliveries}
            formatPrice={formatPrice}
            onSubmit={handleDeliverySubmit}
          />
        )}
      </main>

      <footer className="border-t border-ink/10 py-6 text-center text-xs uppercase tracking-[0.3em] text-ink/40">
        Fire baked. Data driven. Pizza forward.
      </footer>
    </div>
  );
}

function toRoute(path: string): Route {
  if (path === "/register" || path === "/basket" || path === "/delivery") {
    return path;
  }
  return "/";
}

export default App;
