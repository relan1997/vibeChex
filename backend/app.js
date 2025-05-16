import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import QuestionsModel from "./models/questionModel.js";
import genAI from "./helpers/geminiClient.js";
import  extractJsonFromMarkdown  from "./helpers/extractJsonFromMarkdown.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());



const prompt=`You are an API that generates a list of personality quiz questions designed to determine a person's "vibe". Your task is to return a JSON object containing a customId and exactly 12 questions. Each question must include a "questionText" and an "options" array of exactly four multiple choice answers. Use the provided structure strictly.

Return the data in the following JSON format:

{
  "questions": [
    {
      "questionText": "string",       // the quiz question
      "options": [
        "string",                     // option A
        "string",                     // option B
        "string",                     // option C
        "string"                      // option D
      ]
    },
    ...
  ]
}

There must be exactly 12 questions, each with exactly 4 options.

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
- Do not include explanations, markdown, comments, or extra text—respond with only the raw JSON object.
`

app.post("/api/:id/generate", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID from request:", id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID parameter" });
    }

    // ✅ Check database for existing entry
    const existing = await QuestionsModel.findOne({ customId: id });
    if (existing) {
      console.log("Returning existing question set from DB");
      return res.status(200).json({ questions: existing.questions });
    }

    // 🧠 Call Gemini if no record found
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text =response.text();
    const json = extractJsonFromMarkdown(text); // Should return { questions: [...] }

    if (!json.questions || !Array.isArray(json.questions)) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    // 💾 Save new question set to DB
    const saved = new QuestionsModel({ customId: id, questions: json.questions });
    await saved.save();

    res.status(200).json({ questions: json.questions });
  } catch (error) {
    if (error.name === "TypeError") {
      return res.status(400).json({
        error: "Invalid request data",
        details: error.message,
      });
    }

    if (error.name === "ApiError") {
      return res.status(502).json({
        error: "AI service error",
        details: error.message,
      });
    }

    console.error("Error in generate endpoint:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
