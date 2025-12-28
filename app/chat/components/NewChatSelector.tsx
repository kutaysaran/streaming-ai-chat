import { Thread } from "../hooks/useThreads";

type Props = {
  availableCharacters: Thread[];
  newChatCharacterId: string;
  onChange: (id: string) => void;
  onStart: () => void;
  disabled: boolean;
};

export function NewChatSelector({
  availableCharacters,
  newChatCharacterId,
  onChange,
  onStart,
  disabled,
}: Props) {
  if (availableCharacters.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Start a new conversation
      </div>
      <div className="mt-2 flex gap-2">
        <select
          className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-emerald-500"
          value={newChatCharacterId}
          onChange={(e) => onChange(e.target.value)}
        >
          {availableCharacters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
          onClick={onStart}
          disabled={disabled}
        >
          Start
        </button>
      </div>
    </div>
  );
}

