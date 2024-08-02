import {
  getBaseTenStream,
  BaseTenStreamPayload,
  getBaseTenBackupStream,
} from "@/utils/BaseTenStream";
import { svg, html, animate } from "../../../utils/prompts";

export const maxDuration = 60;

export async function POST(req: Request) {
  let { messages, mode } = await req.json();

  const payload: BaseTenStreamPayload = {
    prompt: [
      {
        role: "system",
        content: mode === "animate" ? animate : mode === "html" ? html : svg,
      },
      ...messages,
    ],
    stream: true,
    max_tokens: 4096,
  };
  let stream = await getBaseTenStream(payload);

  if (!(stream instanceof ReadableStream)) {
    console.log("Falling back to backup 70B stream");
    stream = await getBaseTenBackupStream(payload);
  } else {
    console.log("Using 405B stream");
  }

  return new Response(stream, {
    status: 200,
    headers: new Headers({
      "Cache-Control": "no-cache",
    }),
  });
}
