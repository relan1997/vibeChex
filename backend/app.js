import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import QuestionsModel from "./models/questionModel.js";
import genAI from "./helpers/geminiClient.js";
import extractJsonFromMarkdown from "./helpers/extractJsonFromMarkdown.js";
import questionPrompt from "./helpers/questionPrompt.js";
import buildPrompt from "./helpers/buildPrompt.js";
import personalityModel from "./models/personalityModel.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

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
    const result = await model.generateContent(questionPrompt);
    const response = result.response;
    const text = response.text();
    const json = extractJsonFromMarkdown(text); // Should return { questions: [...] }

    if (!json.questions || !Array.isArray(json.questions)) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    // 💾 Save new question set to DB
    const saved = new QuestionsModel({
      customId: id,
      questions: json.questions,
    });
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

//const PersonalityResult = require("./models/PersonalityResult"); // import your mongoose model

app.post("/api/:id/result", async (req, res) => {
  try {
    const userAnswers = req.body.answers; // should be an array of questionText + selectedOption
    if (!Array.isArray(userAnswers)) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const questionPrompt = buildPrompt(userAnswers);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(questionPrompt);
    const response = result.response;
    const text = await response.text();

    const json = extractJsonFromMarkdown(text);

    if (!json) {
      return res
        .status(500)
        .json({ error: "Failed to parse personality result" });
    }

    // Use findOneAndUpdate with upsert:true to insert or replace the existing record
    await personalityModel.findOneAndUpdate(
      { customId: req.params.id },
      { customId: req.params.id, ...json },
      { upsert: true, new: true, overwrite: true }
    );

    res.json({ message: "Personality result saved successfully." });
  } catch (err) {
    console.error("Error generating or saving personality result:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/:id/personality', async (req, res) => {
  try {
    console.log('Fetching personality result for ID:', req.params.id);
    const result = await personalityModel.findOne({ customId: req.params.id });
    if (!result) return res.status(404).json({ message: 'Not found' });
    console.log('Result:', result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
