const questionPrompt = `You are an API that generates a list of personality quiz questions designed to determine a person's "vibe". Your task is to return a JSON object containing exactly 15 questions. Each question must include a "questionText" and an "options" array of exactly 8 multiple choice answers. Use the provided structure strictly.

Return the data in the following JSON format:

{
  "questions": [
    {
      "questionText": "string",       // the quiz question
      "options": [
        "string",                     // option A
        "string",                     // option B
        "string",                     // option C
        "string",                     // option D
        "string",                     // option E
        "string",                     // option F
        "string",                     // option G
        "string"                      // option H
      ]
    },
    ...
  ]
}

STRICTLY There must be exactly 15 questions, each with exactly and strictly and only *8* options.

The vibe types you must use as the inspiration for the personality traits behind each option are:

🌿 Chill Zen – calm, peaceful, introspective  
🔥 Chaotic Energy – spontaneous, loud, fun, unpredictable  
🌌 Mysterious Dreamer – imaginative, deep thinker, introverted  
🎨 Creative Soul – expressive, artsy, idea-oriented  
🧠 Analytical Strategist – logical, planner, sharp  
😎 Confident Charmer – social, smooth, magnetic  
💖 Wholesome Angel – kind-hearted, supportive, warm  
🌪️ Rebellious Spirit – edgy, nonconformist, bold  
🌞 Golden Retriever Energy – loyal, enthusiastic, happy-go-lucky  
🌧️ Melancholic Poet – sensitive, thoughtful, emotional depth

Guidelines:
- All questions must be casual, fun, and personality-revealing.
- Each question should cover one or more of the above personality types through its options.
- Each option must reflect a different vibe from the list above.
- Do NOT assign vibe labels in the JSON—just ensure the answers are clearly aligned in tone.
-Dont ask direct questions like "What is your vibe?" or "How do you feel?" Instead, use creative scenarios or metaphors to elicit the vibes.
- The questions should be relatable and engaging, like "If you were a character in a movie, which one would you be?" or "What would your ideal weekend look like?"
- You must vary the elemental associations used in the answers. Do not always assign "air" as an element—other elements such as fire, water, ice, dust, soil, etc. must also be used creatively in different responses.
- Do not include explanations, markdown, comments, or extra text—respond with only the raw JSON object`;


export default questionPrompt;
