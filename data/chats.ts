export type ChatThread = {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  unread?: number;
  avatar: string;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export const chatThreads: ChatThread[] = [
  {
    id: "thread-1",
    name: "Helpful Assistant",
    subtitle: "Hey Jack, how are you today",
    time: "Today",
    avatar: "/character-three.png",
  },
  {
    id: "thread-2",
    name: "Grumpy Cat",
    subtitle: "I hate Mondays, so hard to focus today…",
    time: "Tuesday",
    unread: 2,
    avatar: "/character-one.png",
  },
  {
    id: "thread-3",
    name: "Coding Guru",
    subtitle: "Did you fix the bug you mentioned?",
    time: "Tuesday",
    unread: 2,
    avatar: "/character-four.png",
  },
  {
    id: "thread-4",
    name: "Smarty Dog",
    subtitle: "Woof! The calculation is ready.",
    time: "Tuesday",
    unread: 2,
    avatar: "/character-two.png",
  },
];

export const chatMessagesByThread: Record<string, ChatMessage[]> = {
  "thread-1": [
    { id: "m1", from: "them", text: "Hello!", time: "00:08" },
    { id: "m2", from: "me", text: "Hi", time: "00:08" },
    { id: "m3", from: "them", text: "How’re you doing?", time: "00:08" },
    { id: "m4", from: "me", text: "I’m fine, and you?", time: "00:08" },
    {
      id: "m5",
      from: "them",
      text: "I’m cool too! Let’s go camping tomorrow? Everybody will be there!",
      time: "00:08",
    },
    { id: "m6", from: "me", text: "That’s would be nice!", time: "00:08" },
    { id: "m7", from: "me", text: "I’m in.", time: "00:08" },
  ],
  "thread-2": [
    { id: "m8", from: "them", text: "I hate Mondays.", time: "09:12" },
    { id: "m9", from: "me", text: "Coffee time?", time: "09:12" },
    { id: "m10", from: "them", text: "Make it two.", time: "09:13" },
  ],
  "thread-3": [
    { id: "m11", from: "them", text: "Did you fix the bug?", time: "14:20" },
    { id: "m12", from: "me", text: "Almost there.", time: "14:21" },
    { id: "m13", from: "them", text: "Ship tonight?", time: "14:21" },
    { id: "m14", from: "me", text: "Yes, QA first.", time: "14:22" },
  ],
  "thread-4": [
    { id: "m15", from: "them", text: "Woof! Result is ready.", time: "18:45" },
    { id: "m16", from: "me", text: "Share the numbers.", time: "18:45" },
    { id: "m17", from: "them", text: "42. Verified twice.", time: "18:46" },
  ],
};

