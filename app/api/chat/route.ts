import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore as unknown as Promise<ReadonlyRequestCookies>,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    } 

    const body = await req.json();
    const { threadId, messages } = body as {
      threadId: string;
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!threadId || !messages?.length) {
      return new Response("Invalid payload", { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Missing GROQ_API_KEY", { status: 500 });
    }

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages,
      }),
    });

    if (!groqRes.ok || !groqRes.body) {
      const text = await groqRes.text();
      return new Response(
        text || `LLM request failed with status ${groqRes.status}`,
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const reader = groqRes.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.replace("data: ", "").trim();
              if (payload === "[DONE]") {
                controller.close();
                return;
              }
              try {
                const json = JSON.parse(payload);
                const delta =
                  json?.choices?.[0]?.delta?.content ??
                  json?.choices?.[0]?.message?.content ??
                  "";
                if (delta) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error in /api/chat";
    return new Response(message, { status: 500 });
  }
}

