type MessageBannerProps = {
  message: string;
  onDismiss: () => void;
};

export function MessageBanner({ message, onDismiss }: MessageBannerProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 border-b border-ember/30 bg-ember/10 px-6 py-2 text-sm text-ember">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span>{message}</span>
        <button
          className="text-xs uppercase tracking-[0.2em] text-ember/70 hover:text-ember"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
