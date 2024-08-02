<div align="center" style="display: flex; align-items: center; justify-content: center;">
  <img alt="Llamination" src="./public/llamination_logo.svg" width="50" style="margin-right: 10px;">
  <h1 style="margin: 0;">Llamination</h1>
</div>

<p align="center">
   Generating SVGs, powered by Llama 405B.
</p>

## Fun artifacts
- Check out a gallery of LLamojis [here](https://llamathon-svgenerator.onrender.com/LLaMojis.html)

## Tech stack

- [LlamaCoder](https://github.com/nutlope/llamacoder) by Nutlope
- [Llama 3.1 405B](https://ai.meta.com/blog/meta-llama-3-1/) from Meta for the LLM
- [Baseten](https://www.baseten.co/) for LLM inference
- Next.js app router with Tailwind

## Cloning & running

1. Clone the repo: `git clone https://github.com/sharontanxh/llamathon-svgenerator`
2. Prerequisites: `npm` is installed with version `v18.17` and up
3. Create a `.env` file and load in minimally `BASETEN-405B_API_KEY` and `BASETEN_70B_API_KEY`. NOTE: These model instances were made available temporarily for the purposes of the SPC-Meta hackathon from 8/2-8/4/2024, and you will likely have to replace the model endpoints as these are taken down. Adjust the endpoints in `utils/BaseTenStream.ts` as required.
4. Run `npm install` and `npm run dev` to install dependencies and run locally

## Future Tasks

- [ ] Finetune Llama 3.1 405B on SVG generation
- [ ] Add multiple generations for users to select best one / desired components
