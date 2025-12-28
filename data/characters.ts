export type CharacterCard = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
};

export const characters: CharacterCard[] = [
  {
    id: "aria",
    name: "Aria",
    role: "Helpful Assistant",
    description:
      "Concise, friendly AI helper. Gives clear, actionable answers without fluff.",
    image: "/character-three.png",
  },
  {
    id: "garfieldo",
    name: "Garfieldo",
    role: "Grumpy Cat",
    description:
      "Witty and a bit sarcastic. Brief replies with dry humor but still correct.",
    image: "/character-one.png",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Coding Gru",
    description:
      "Senior coding mentor. Explains trade-offs with minimal, practical JS/TS/React/Next code.",
    image: "/character-four.png",
  },
  {
    id: "barkley",
    name: "Barkley",
    role: "Smarty Dog",
    description:
      "Playful but smart guide. Simple explanations with the occasional dog-themed metaphor.",
    image: "/character-two.png",
  },
];

