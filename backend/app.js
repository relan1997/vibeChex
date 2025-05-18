import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import QuestionsModel from "./models/questionModel.js";
import genAI from "./helpers/geminiClient.js";
import extractJsonFromMarkdown from "./helpers/extractJsonFromMarkdown.js";
import questionPrompt from "./prompts/questionPrompt.js";
import buildPrompt from "./prompts/buildPrompt.js";
import personalityModel from "./models/personalityModel.js";
import checkImageExists from "./helpers/checkImageExists.js";
import validatePokemon from "./helpers/validatePokemon.js";

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

    if (!id) {
      return res.status(400).json({ error: "Missing ID parameter" });
    }

    const existing = await QuestionsModel.findOne({ customId: id });
    if (existing) {
      return res.status(200).json({ questions: existing.questions });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(questionPrompt);
    const response = result.response;
    const text = response.text();
    const json = extractJsonFromMarkdown(text);

    if (!json.questions || !Array.isArray(json.questions)) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    const saved = new QuestionsModel({
      customId: id,
      questions: json.questions,
    });
    await saved.save();

    res.status(200).json({ questions: json.questions });
  } catch (error) {
    console.error("Error in /api/:id/generate:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/:id/result", async (req, res) => {
  try {
    const { id } = req.params;
    const userAnswers = req.body.answers;

    if (!Array.isArray(userAnswers)) {
      return res
        .status(400)
        .json({ error: "Invalid input: answers should be an array." });
    }

    const prompt = buildPrompt(userAnswers);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.();

    if (!text) {
      return res.status(500).json({ error: "AI returned an empty response." });
    }

    const json = extractJsonFromMarkdown(text);

    if (
      !json ||
      !json.briefDescription ||
      !json.pokemonName ||
      !json.pokemonDescription ||
      !json.roast
    ) {
      return res
        .status(500)
        .json({ error: "Incomplete AI result. Missing required fields." });
    }

    const lastAnswer = userAnswers[userAnswers.length - 1]?.selectedOption;
    if (!lastAnswer) {
      return res.status(400).json({ error: "Missing final answer (animal)." });
    }

    const rawPokemonName = json.pokemonName;
    let pokemonImage = `https://img.pokemondb.net/artwork/large/${rawPokemonName
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^a-z0-9-]/g, "")}.jpg`;

    const imageExists = await checkImageExists(pokemonImage);
    if (!imageExists) {
      const validName = await validatePokemon(rawPokemonName);
      pokemonImage = validName
        ? `https://img.pokemondb.net/artwork/large/${validName
            .toLowerCase()
            .replace(/\s/g, "-")
            .replace(/[^a-z0-9-]/g, "")}.jpg`
        : "https://img.pokemondb.net/artwork/large/missingno.jpg";
    }

    const saved = await personalityModel.findOneAndUpdate(
      { customId: id },
      {
        customId: id,
        ...json,
        pokemonImage,
        pokemonName: rawPokemonName.toLowerCase(),
      },
      { upsert: true, new: true, overwrite: true }
    );

    res.status(200).json({
      message: "Personality result saved successfully.",
      personality: {
        ...json,
        pokemonImage,
        pokemonName: rawPokemonName.toLowerCase(),
      },
    });
  } catch (error) {
    console.error("Error in /api/:id/result:", error);
    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.get("/api/:id/personality", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await personalityModel.findOne({ customId: id });
    if (!result) {
      return res.status(404).json({ error: "Personality result not found." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/:id/personality:", error);
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
