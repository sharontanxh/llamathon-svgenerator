import asyncio
import aiohttp
import json
import string
import os


async def llama(session, prompt):
    response = ""
    async with session.post(
            "https://MODEL_HERE.api.baseten.co/production/predict",
            headers={
                "Authorization":
                "API_KEY_HERE"
            },
            json={
                "prompt": prompt,
                "stream": False,
                "max_tokens": 4096
            }) as resp:
        async for chunk in resp.content.iter_any():
            content = chunk.decode("utf-8")
            response += content

        return json.loads(response)['text']


async def process_vibe(session, vibe, system_prompt, output_directory):
    query = vibe
    prompt = system_prompt + '\n\n' + query
    print(vibe)
    response = await llama(session, prompt)
    print(response)
    filename = query.translate(str.maketrans(
        '', '', string.punctuation)).replace(' ', '_') + '.svg'
    with open(os.path.join(output_directory, filename), "w") as f:
        f.write(response)


async def main():
    #     system_prompt = """
    #     You are an expert SVG creator.
    # - Create an SVG for whatever the user is asking you to create.
    # - Use meaningful ids for the svg elements and include comments to explain how the svg is structured and how it relates to the user's prompt.
    # - Only return the SVG code, nothing else. Do not include \`\`\`svg or anything like this

    # Here's an example outputs:"""

    #     with open("incontextexamples.txt", 'r') as f:
    #         in_context_examples = '\n' + f.read() + '\n\n'

    system_prompt = """
    You are an expert SVG creator.
    - Create an SVG for whatever the user is asking you to create.
    - Use meaningful ids for the svg elements and include comments to explain how the svg is structured and how it relates to the user's prompt.
    - Only return the SVG code, nothing else. Do not include \`\`\`svg or anything like this

    Here's an example output for the prompt "happy 8-bit crab":

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <!-- Body -->
      <rect x="16" y="24" width="32" height="24" fill="#FF4500"/>

      <!-- Eyes -->
      <rect x="20" y="28" width="8" height="8" fill="white"/>
      <rect x="36" y="28" width="8" height="8" fill="white"/>
      <rect x="22" y="30" width="4" height="4" fill="black"/>
      <rect x="38" y="30" width="4" height="4" fill="black"/>

      <!-- Smile -->
      <rect x="24" y="40" width="16" height="4" fill="white"/>
      <rect x="20" y="36" width="4" height="4" fill="white"/>
      <rect x="40" y="36" width="4" height="4" fill="white"/>

      <!-- Claws -->
      <rect x="8" y="32" width="8" height="8" fill="#FF4500"/>
      <rect x="48" y="32" width="8" height="8" fill="#FF4500"/>

      <!-- Legs -->
      <rect x="12" y="48" width="4" height="8" fill="#FF4500"/>
      <rect x="20" y="48" width="4" height="8" fill="#FF4500"/>
      <rect x="40" y="48" width="4" height="8" fill="#FF4500"/>
      <rect x="48" y="48" width="4" height="8" fill="#FF4500"/>
    </svg>
    """

    with open("emojiall.txt", 'r') as f:
        prompts = f.read().split('\n')

    output_directory = 'all_emojis'
    os.makedirs(output_directory, exist_ok=True)

    for i in range(0, len(prompts), 50):
        vibes = prompts[i:i + 50]
        async with aiohttp.ClientSession() as session:
            tasks = [
                process_vibe(session, vibe, system_prompt, output_directory)
                for vibe in vibes if vibe
            ]
            await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
