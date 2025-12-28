# ChatAPP

Production-ready AI chat built with Next.js 16 (App Router), TypeScript, Supabase, Groq streaming, Tailwind + shadcn/ui, and Framer Motion foundations.

## Features
- Supabase auth (email/password + Google OAuth), session persistence
- Predefined AI characters with unique prompts, avatars, and per-thread chat history
- Streaming chat responses (Groq) with markdown rendering (GFM, code blocks)
- Optimistic user messages, saved to Supabase; history loads on revisit
- Responsive, mobile-first UI; skeletons and toasts for feedback
- Functional mobile nav (hamburger), contextual chat starter dropdown

## Stack
- Framework: Next.js 16 (App Router), TypeScript
- Backend/Auth: Supabase (auth + DB, RLS)
- AI: Groq chat completions (streaming)
- UI: Tailwind CSS, shadcn/ui, lucide-react
- Markdown: react-markdown + remark-gfm
- Animations: Framer Motion (ready for page transitions)

## Getting Started
```bash
npm install
npm run dev
# env: copy .env.example -> .env.local and set SUPABASE_* and GROQ_API_KEY
```
Open http://localhost:3000

## Architectural notes
- Data flow: client chat page → `/api/chat` → Groq streaming → progressive UI update → Supabase persistence.
- Profile guard ensures user/profile rows exist before thread ops.
- Message rendering uses markdown (GFM) with code block styling and safe layout (no pre-in-p nesting).

## Testing
- Add unit tests with Jest/Vitest (e.g., message formatting/markdown sanitizer).

## Deployment
- Vercel recommended. Ensure env vars are set and Supabase RLS policies allow per-user access to profiles/threads/messages.
