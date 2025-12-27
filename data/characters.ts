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
      "Character text definition is gonna be here and it should give detailed information.",
    image: "/character-three.png",
  },
  {
    id: "garfieldo",
    name: "Garfieldo",
    role: "Grumpy Cat",
    description:
      "Character text definition is gonna be here and it should give detailed information.",
    image: "/character-one.png",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Coding Gru",
    description:
      "Character text definition is gonna be here and it should give detailed information.",
    image: "/character-four.png",
  },
  {
    id: "barkley",
    name: "Barkley",
    role: "Smarty Dog",
    description:
      "Character text definition is gonna be here and it should give detailed information.",
    image: "/character-two.png",
  },
];

