function buildPrompt(answers) {
  return `
You will receive a list of personality quiz responses as JSON objects in the following format:

${JSON.stringify(answers, null, 2)}

Based only on the user's selected answers, analyze their personality and return the following insights as a JSON object with these exact keys:

- briefDescription: a 200-word summary of the user's overall personality
- corePersonalityArchetype
- element
- pokemon
- country
- aestheticStyle
- planet
- timeOfDay
- fictionalCharacter
- zodiacAlignment
Also give 1-2 sentence descriptions for each of these keys, explaining how they relate to the user's personality.
Respond with **only** the JSON object and nothing else.
`;
}

export default buildPrompt;