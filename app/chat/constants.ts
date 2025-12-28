export type Character = {
  id: string;
  title: string | null;
  avatar?: string;
};

export const defaultCharacters: Character[] = [
  { id: "character-aria", title: "Helpful Assistant", avatar: "/character-three.png" },
  { id: "character-grumpy", title: "Grumpy Cat", avatar: "/character-one.png" },
  { id: "character-guru", title: "Coding Guru", avatar: "/character-four.png" },
  { id: "character-dog", title: "Smarty Dog", avatar: "/character-two.png" },
];

export const avatarForTitle = (title?: string | null) => {
  const found = defaultCharacters.find(
    (c) => c.title?.toLowerCase() === title?.toLowerCase()
  );
  return found?.avatar ?? "/character-three.png";
};

