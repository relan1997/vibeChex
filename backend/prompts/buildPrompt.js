function buildPrompt(answers) {
  return `
You will receive a list of personality quiz responses as JSON objects in the following format:

${JSON.stringify(answers, null, 2)}

Based only on the user's selected answers, analyze their personality and return the following insights as a JSON object with these exact keys:

- briefDescription: a 200-word summary of the user's overall personality  
- corePersonalityArchetype  
- element  
- pokemon (must be a real Pokémon available on PokéAPI)  
- pokemonName (give **only** the lowercase name of the Pokémon)  
- country  
- aestheticStyle  
- planet  
- timeOfDay  
- fictionalCharacter  
- zodiacAlignment  
- roast

STRICTLY also give 2-sentence descriptions for each of these keys, explaining how they relate to the user's personality.  
Include emojis where appropriate.  
The **roast** must be a 10 sentences of humorous and sarcastic jab at the user's character, based on the personality analysis and the Pokémon's known weaknesses, having a deeper hidden meaning with respect to real life.  
It should be clever, slightly savage and offensive. Feel free to creatively exaggerate.

Respond with **only** the JSON object and nothing else.
  `;
}

export default buildPrompt;
