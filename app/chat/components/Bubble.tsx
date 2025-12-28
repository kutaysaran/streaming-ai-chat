type Props = {
  text: string;
  from: "me" | "them";
};

export function Bubble({ text, from }: Props) {
  const isMe = from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${
          isMe ? "bg-emerald-100 text-foreground" : "bg-emerald-600 text-white"
        }`}
      >
        <div>{text}</div>
      </div>
    </div>
  );
}

