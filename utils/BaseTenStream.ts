
export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface BaseTenStreamPayload {
  prompt: ChatGPTMessage[];
  stream: boolean;
  max_tokens: number;
}

export async function getBaseTenStream(payload: BaseTenStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(
    "https://model-7wlxp82w.api.baseten.co/production/predict",
    {
      headers: {
        Authorization: `Api-Key ${process.env.BASETEN_405B_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const readableStream = new ReadableStream({
    async start(controller) {
      // optimistic error handling
      if (res.status !== 200) {
        const data = {
          status: res.status,
          statusText: res.statusText,
          body: await res.text(),
        };
        console.log(
          `Error: received non-200 status code, ${JSON.stringify(data)}`,
        );
        controller.close();
        return;
      }
      for await (const chunk of res.body as any) {
        const data = decoder.decode(chunk);
        controller.enqueue(encoder.encode(data));
      }
      console.log("readable - closed");
      controller.close();
    },
  });

  let counter = 0;
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const data = decoder.decode(chunk);
      try {
        const text = data;
        const payload = { text: text };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
        counter++;
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return readableStream.pipeThrough(transformStream);
}

export async function getBaseTenBackupStream(payload: BaseTenStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch(
    "https://model-jwd78r4w.api.baseten.co/production/predict",
    {
      headers: {
        Authorization: `Api-Key ${process.env.BASETEN_70B_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const readableStream = new ReadableStream({
    async start(controller) {
      // optimistic error handling
      if (res.status !== 200) {
        const data = {
          status: res.status,
          statusText: res.statusText,
          body: await res.text(),
        };
        console.log(
          `Error: received non-200 status code, ${JSON.stringify(data)}`,
        );
        controller.close();
        return;
      }

      for await (const chunk of res.body as any) {
        const data = decoder.decode(chunk);
        controller.enqueue(encoder.encode(data));
      }
      console.log("readable - closed");
      controller.close();
    },
  });

  let counter = 0;
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const data = decoder.decode(chunk);
      try {
        const text = data;
        const payload = { text: text };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
        counter++;
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return readableStream.pipeThrough(transformStream);
}
