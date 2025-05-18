function buildPrompt(answers) {
  return `
You will receive a list of personality quiz responses as JSON objects in the following format:

${JSON.stringify(answers, null, 2)}

Based only on the user's selected answers, analyze their personality and return the following insights as a JSON object with these exact keys:

- briefDescription: a 100-word summary of the user's overall personality  
- corePersonalityArchetype  
- corePersonalityArchetypeDescription  
- element  
- elementDescription  
- pokemonName (only the lowercase name of the Pokémon, e.g., "pikachu")  
- pokemonDescription  
- country  
- countryDescription  
- aestheticStyle  
- aestheticStyleDescription  
- planet  
- planetDescription  
- timeOfDay  
- timeOfDayDescription  
- fictionalCharacter  
- fictionalCharacterDescription  
- zodiacAlignment  
- zodiacAlignmentDescription  
- roast

For each key (except pokemonName), also provide a **1-sentence** description explaining how it relates to the user's personality. Use emojis where appropriate to enhance the tone.

The **roast** must be a **10-sentence** clever, slightly savage, and sarcastic takedown of the user's character. It should exaggerate known flaws humorously, reflect deeper psychological insights, and mirror real-life behaviors with brutal honesty. Make it smart, edgy, and entertaining.

Respond with **only** the JSON object and nothing else.

RESPOND USING SIMPLE LANGUAGE ONLY, NO HIGH LEVEL VOCABULARY, NO COMPLEX SENTENCES, AND NO TECHNICAL TERMS.
  `;
}

export default buildPrompt;
