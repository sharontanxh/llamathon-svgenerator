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

        print(response)

        return json.loads(response)['text']


async def process_vibe(session, query, system_prompt, output_directory):
    static_svg_filename = query.translate(
        str.maketrans('', '', string.punctuation)).replace(' ', '_') + '.svg'
    with open(os.path.join('all_emojis', static_svg_filename)) as f:
        svg_content = f.read()
    prompt = system_prompt + '\n\n' + 'animate the ' + query + '\n' + svg_content
    print(query)
    # print(prompt)

    response = await llama(session, prompt)

    print(response)

    animated_svg_filename = query.translate(
        str.maketrans('', '', string.punctuation)).replace(
            ' ', '_') + '_animated.svg'

    with open(os.path.join(output_directory, animated_svg_filename), "w") as f:
        f.write(response)


async def main():
    # can also try telling it not to remove or edit paths
    # can ask it to just do style tag
    # can ask it to do style tag after paths
    system_prompt = """
    You are an expert SVG animator.
    - Animate the SVG using CSS within a <style> tag inside the SVG
    - Use meaningful ids for the animations  and include comments to explain how the animation relates the SVG content
    - Create an animation which is consistent and meaningful for the thing being animated
    - Only return the SVG code, nothing else. Do not include \`\`\`svg or anything like this

    Here's an example output for the prompt "animate the pair of scissors
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      <g id="upper-blade">
        <path fill="#DD2E44" d="M16.806 10.675c-.92-2.047-2.003-4.066-3.026-6.26-.028-.068-.051-.138-.082-.206-.064-.142-.137-.277-.208-.413l-.052-.111-.002.003C11.798.698 8.343-.674 5.46.621 2.414 1.988 1.164 5.813 2.67 9.163c1.505 3.351 5.194 4.957 8.24 3.589.106-.047.205-.105.306-.159 1.935.438 1.994 1.877 1.994 1.877s4.618-1.521 3.596-3.795zM4.876 8.173c-.958-2.133-.252-4.527 1.575-5.347 1.826-.822 4.084.242 5.042 2.374.958 2.132.253 4.526-1.573 5.346-1.828.821-4.087-.241-5.044-2.373z"/>
        <path fill="#99AAB5" d="M26.978 34.868c1.163-.657 2.187-2.474 1.529-3.638L16.754 10.559c-1.103.496-2.938 2.313-3.544 3.912l13.768 20.397z"/>
      </g>
      <g id="lower-blade">
        <path fill="#DD2E44" d="M30.54.62c-2.882-1.295-6.338.077-7.976 3.067l-.003-.003-.053.112c-.071.135-.145.27-.208.412-.03.068-.053.137-.081.206-1.023 2.194-2.107 4.213-3.026 6.26-1.021 2.274 3.597 3.796 3.597 3.796s.059-1.439 1.993-1.877c.102.054.2.111.307.159 3.045 1.368 6.733-.238 8.24-3.589 1.505-3.35.255-7.175-2.79-8.543zm.584 7.553c-.959 2.132-3.216 3.194-5.044 2.373-1.826-.82-2.531-3.214-1.572-5.346.956-2.132 3.214-3.195 5.041-2.374 1.827.82 2.532 3.214 1.575 5.347z"/>
        <path fill="#CCD6DD" d="M9.022 34.868c-1.163-.657-2.187-2.474-1.529-3.638l11.753-20.671c1.103.496 2.938 2.313 3.544 3.912L9.022 34.868z"/>
      </g>
      <path fill="#99AAB5" d="M19.562 17.396c0 .863-.701 1.562-1.562 1.562-.863 0-1.562-.699-1.562-1.562 0-.863.699-1.562 1.562-1.562.862 0 1.562.699 1.562 1.562z"/>
    </svg>":

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <style>
    @keyframes scissor-open {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(20deg); }
    }
    @keyframes scissor-close {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-20deg); }
    }
    #upper-blade {
      transform-origin: 18px 18px;
      animation: scissor-open 2s ease-in-out infinite;
    }
    #lower-blade {
      transform-origin: 18px 18px;
      animation: scissor-close 2s ease-in-out infinite;
    }
  </style>
  <g id="upper-blade">
    <path fill="#DD2E44" d="M16.806 10.675c-.92-2.047-2.003-4.066-3.026-6.26-.028-.068-.051-.138-.082-.206-.064-.142-.137-.277-.208-.413l-.052-.111-.002.003C11.798.698 8.343-.674 5.46.621 2.414 1.988 1.164 5.813 2.67 9.163c1.505 3.351 5.194 4.957 8.24 3.589.106-.047.205-.105.306-.159 1.935.438 1.994 1.877 1.994 1.877s4.618-1.521 3.596-3.795zM4.876 8.173c-.958-2.133-.252-4.527 1.575-5.347 1.826-.822 4.084.242 5.042 2.374.958 2.132.253 4.526-1.573 5.346-1.828.821-4.087-.241-5.044-2.373z"/>
    <path fill="#99AAB5" d="M26.978 34.868c1.163-.657 2.187-2.474 1.529-3.638L16.754 10.559c-1.103.496-2.938 2.313-3.544 3.912l13.768 20.397z"/>
  </g>
  <g id="lower-blade">
    <path fill="#DD2E44" d="M30.54.62c-2.882-1.295-6.338.077-7.976 3.067l-.003-.003-.053.112c-.071.135-.145.27-.208.412-.03.068-.053.137-.081.206-1.023 2.194-2.107 4.213-3.026 6.26-1.021 2.274 3.597 3.796 3.597 3.796s.059-1.439 1.993-1.877c.102.054.2.111.307.159 3.045 1.368 6.733-.238 8.24-3.589 1.505-3.35.255-7.175-2.79-8.543zm.584 7.553c-.959 2.132-3.216 3.194-5.044 2.373-1.826-.82-2.531-3.214-1.572-5.346.956-2.132 3.214-3.195 5.041-2.374 1.827.82 2.532 3.214 1.575 5.347z"/>
    <path fill="#CCD6DD" d="M9.022 34.868c-1.163-.657-2.187-2.474-1.529-3.638l11.753-20.671c1.103.496 2.938 2.313 3.544 3.912L9.022 34.868z"/>
  </g>
  <path fill="#99AAB5" d="M19.562 17.396c0 .863-.701 1.562-1.562 1.562-.863 0-1.562-.699-1.562-1.562 0-.863.699-1.562 1.562-1.562.862 0 1.562.699 1.562 1.562z"/>
</svg>
    """

    with open("emojiall.txt", 'r') as f:
        prompts = f.read().split('\n')

    output_directory = 'all_emojis_animated'
    os.makedirs(output_directory, exist_ok=True)

    print(len(prompts))

    # can increase the amount of requests happening at once
    skip = 25
    for i in range(100, len(prompts), skip):
        vibes = prompts[i:i + skip]
        async with aiohttp.ClientSession() as session:
            tasks = [
                process_vibe(session, vibe, system_prompt, output_directory)
                for vibe in vibes if vibe
            ]
            await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
