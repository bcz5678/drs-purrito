import { createFileRoute } from "@tanstack/react-router";

import { isAllowedReference } from "@/lib/purritoReference";

// Explicit quality/size keep cost and latency predictable; OpenAI's "auto" default
// usually picks high quality (~4x the price of medium). Override via env to experiment.
const MODEL = process.env["OPENAI_IMAGE_MODEL"] ?? "gpt-image-1.5";
const QUALITY = process.env["OPENAI_IMAGE_QUALITY"] ?? "medium";
const SIZE = "1024x1024";

export const Route = createFileRoute("/api/generate-purrito")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          prompt,
          reference,
          stream = true,
        } = (await request.json()) as {
          prompt: string;
          reference?: string;
          stream?: boolean;
        };
        const key = process.env["OPENAI_API_KEY"];
        if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });
        if (reference && !isAllowedReference(reference)) {
          return new Response("Unknown reference image", { status: 400 });
        }

        // partial_images is required by the Images API whenever stream: true.
        const streamParams = stream ? { stream: true, partial_images: 2 } : {};
        let upstream: Response;
        if (reference) {
          // With a reference image, use the edits endpoint so the model actually sees it.
          const refRes = await fetch(new URL(reference, request.url));
          if (!refRes.ok) return new Response("Could not load reference image", { status: 500 });
          const form = new FormData();
          form.append("image[]", await refRes.blob(), "reference.png");
          form.append("model", MODEL);
          form.append("prompt", prompt);
          form.append("quality", QUALITY);
          form.append("size", SIZE);
          for (const [name, value] of Object.entries(streamParams)) form.append(name, String(value));
          upstream = await fetch("https://api.openai.com/v1/images/edits", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: form,
          });
        } else {
          upstream = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: MODEL, prompt, quality: QUALITY, size: SIZE, ...streamParams }),
          });
        }
        if (!upstream.ok || !upstream.body) {
          return new Response(await upstream.text(), { status: upstream.status });
        }
        if (!stream) {
          return new Response(upstream.body, {
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
