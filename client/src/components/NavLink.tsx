type NavLinkProps = {
  active: boolean;
  onClick: () => void;
  children: string;
};

export function NavLink({ active, onClick, children }: NavLinkProps) {
  return (
    <button
      className={`text-xs uppercase tracking-[0.3em] transition ${
        active ? "text-ember" : "text-ink/70 hover:text-ink"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
