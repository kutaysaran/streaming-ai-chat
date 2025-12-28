import { Send } from "lucide-react";

type Props = {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
};

export function Composer({ input, setInput, onSend, disabled }: Props) {
  return (
    <div className="border-t border-border px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2 shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-300 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
        />
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
          aria-label="Send message"
          onClick={onSend}
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

