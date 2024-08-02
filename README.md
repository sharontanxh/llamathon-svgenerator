<div align="center" style="display: flex; align-items: center; justify-content: center;">
  <img alt="Llamination" src="./public/llamination_logo.svg" width="50" style="margin-right: 10px;">
  <h1 style="margin: 0;">Llamination</h1>
</div>

<p align="center">
  Generating SVGs, powered by Llama 405B. Check out our <a href='https://www.youtube.com/watch?v=KBni-8VXi1I'>demo video!</a>
  
</p>

<p align="center"></p>

<div align="center" style="display: flex; align-items: center; justify-content: center;">
<a href='https://www.youtube.com/watch?v=KBni-8VXi1I'><img src="./memphis-milano.png" alt="yawning_face" style="height: 400px;"/></a>
</div>

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

# LLaMojis

## Emoji set recreated with LLaMa
![LLaMoji_food](./LLaMojis/LLaMoji_food.png)
Food emojis. See the full set [here](https://llamathon-svgenerator.onrender.com/LLaMojis.html) 

LLaMojis uses LLaMa 3.1 405B to generate an SVG for each emoji in the emoji set.  

## LLaMoji guessing game 
Guess which prompt we used to create the LLaMoji! Try it out at [llamoji.replit.app](https://llamoji.replit.app/) 
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img src="./LLaMojis/LLaMoji_guessing_game_UI_2.png" alt="llamoji_guessing_UI_2" style="height: 200px;"/>
    <img src="./LLaMojis/LLaMoji_guessing_game_UI.png" alt="llamoji_guessing_UI)" style="height: 200px;"/>
</div>


## Twemoji animated with LLaMa
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/woman_getting_massage_animated.svg" alt="anxious_face_with_sweat" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/skier_animated.svg" alt="anxious_face_with_sweat" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/anxious_face_with_sweat_animated.svg" alt="anxious_face_with_sweat" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/astonished_face_animated.svg" alt="astonished_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/backhand_index_pointing_left_animated.svg" alt="backhand_index_pointing_left" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/call_me_hand_animated.svg" alt="call_me_hand" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/confounded_face_animated.svg" alt="confounded_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/disappointed_face_animated.svg" alt="disappointed_face" style="width: 100px; height: 100px;"/>
<!--     <img src="./LLaMojis/Twemoji_animated_with_LLaMa/exploding_head_animated.svg" alt="exploding_head" style="width: 100px; height: 100px;"/> -->
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/face_blowing_a_kiss_animated.svg" alt="face_blowing_a_kiss" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/face_holding_back_tears_animated.svg" alt="face_holding_back_tears" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/face_screaming_in_fear_animated.svg" alt="face_screaming_in_fear" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/face_with_diagonal_mouth_animated.svg" alt="face_with_diagonal_mouth" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/face_with_peeking_eye_animated.svg" alt="face_with_peeking_eye" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/folded_hands_animated.svg" alt="folded_hands" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/grimacing_face_animated.svg" alt="grimacing_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/grinning_face_with_smiling_eyes_animated.svg" alt="grinning_face_with_smiling_eyes" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/heart_decoration_animated.svg" alt="heart_decoration" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/hot_face_animated.svg" alt="hot_face" style="width: 100px; height: 100px;"/>
<!--     <img src="./LLaMojis/Twemoji_animated_with_LLaMa/nail_polish_animated.svg" alt="nail_polish" style="width: 100px; height: 100px;"/> -->
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/nauseated_face_animated.svg" alt="nauseated_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/sleeping_face_animated.svg" alt="sleeping_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/smiling_face_with_hearteyes_animated.svg" alt="smiling_face_with_hearteyes" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/thinking_face_animated.svg" alt="thinking_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/unamused_face_animated.svg" alt="unamused_face" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/waving_hand_animated.svg" alt="waving_hand" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_LLaMa/yawning_face_animated.svg" alt="yawning_face" style="width: 100px; height: 100px;"/>
</div>

## Twemoji animated with Claude
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img src="./LLaMojis/Twemoji_animated_with_Claude/animated-camera-svg.svg" alt="animated camera" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_Claude/animated-scissors-svg.svg" alt="animated scissors" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_Claude/animated-shower-svg.svg" alt="animated shower" style="width: 100px; height: 100px;"/>
    <img src="./LLaMojis/Twemoji_animated_with_Claude/animated-swords-svg.svg" alt="animated swords" style="width: 100px; height: 100px;"/>
</div>
