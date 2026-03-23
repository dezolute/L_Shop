import type { Route } from "./app-types";
import { NavLink } from "./NavLink";

type AppHeaderProps = {
  route: Route;
  userName?: string;
  onNavigate: (path: Route) => void;
  onLogout: () => void;
};

export function AppHeader({
  route,
  userName,
  onNavigate,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          className="text-left text-xl font-semibold tracking-tight"
          onClick={() => onNavigate("/")}
        >
          Forno Rosso
          <span className="block text-xs font-medium uppercase tracking-[0.3em] text-ember">
            Pizzeria Lab
          </span>
        </button>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <NavLink active={route === "/"} onClick={() => onNavigate("/")}>
            Menu
          </NavLink>
          <NavLink active={route === "/basket"} onClick={() => onNavigate("/basket")}>
            Basket
          </NavLink>
          <NavLink active={route === "/delivery"} onClick={() => onNavigate("/delivery")}>
            Delivery
          </NavLink>
          {userName ? (
            <button
              className="rounded-full border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition hover:border-ember/70 hover:text-ember"
              onClick={onLogout}
            >
              Sign out
            </button>
          ) : (
            <button
              className="rounded-full border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition hover:border-ember/70 hover:text-ember"
              onClick={() => onNavigate("/register")}
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
