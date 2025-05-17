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
import axios from "axios";
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



// Utility to validate Pokemon via PokeAPI


app.post("/api/:id/generate", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID from request:", id);

    if (!id) {
      return res.status(400).json({ error: "Missing ID parameter" });
    }

    const existing = await QuestionsModel.findOne({ customId: id });
    if (existing) {
      console.log("Returning existing question set from DB");
      return res.status(200).json({ questions: existing.questions });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(questionPrompt);
    const response = result.response;
    const text = response.text();
    const json = extractJsonFromMarkdown(text);
    console.log("AI response:", json);

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

app.post("/api/:id/result", async (req, res) => {
  console.log("🔵 [Start] Generating personality result for ID:", req.params.id);

  try {
    const userAnswers = req.body.answers;
    if (!Array.isArray(userAnswers)) {
      console.error("🟥 Invalid input: answers is not an array.");
      return res.status(400).json({ error: "Invalid input format: answers should be an array." });
    }

    console.log("🟢 Received user answers:", userAnswers);

    let questionPrompt;
    try {
      questionPrompt = buildPrompt(userAnswers);
      console.log("🟢 Built question prompt.");
    } catch (err) {
      console.error("🟥 Failed to build prompt:", err);
      return res.status(500).json({ error: "Failed to build question prompt." });
    }

    let text;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(questionPrompt);
      text = result.response?.text?.();
      if (!text) throw new Error("Empty AI response");
      console.log("🟢 Received AI response.");
    } catch (err) {
      console.error("🟥 Error generating content from model:", err);
      return res.status(500).json({ error: "AI model failed to generate content." });
    }

    let json;
    try {
      json = extractJsonFromMarkdown(text);
      console.log("🟢 Extracted JSON from AI response:", json);
    } catch (err) {
      console.error("🟥 Error extracting JSON from markdown:", err);
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    if (
      !json ||
      !json.briefDescription ||
      !json.pokemonName ||
      !json.pokemonDescription ||
      !json.roast
    ) {
      console.error("🟥 AI response missing required fields:", json);
      return res.status(500).json({ error: "Incomplete AI result. Missing one or more required fields." });
    }

    const lastAnswer = userAnswers[userAnswers.length - 1]?.selectedOption;
    if (!lastAnswer) {
      console.error("🟥 Missing last answer (animal).");
      return res.status(400).json({ error: "Missing final answer (animal)." });
    }

    let imageUrl;
    try {
      const rawPokemonName = json.pokemonName;
      const pokemonNameSlug = rawPokemonName.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
      imageUrl = `https://img.pokemondb.net/artwork/large/${pokemonNameSlug}.jpg`;
      console.log("🟢 Constructed initial image URL:", imageUrl);

      const exists = await checkImageExists(imageUrl);
      if (!exists) {
        console.warn("⚠️ Initial Pokémon image not found, trying fallback...");
        const validName = await validatePokemon(rawPokemonName);
        if (validName) {
          const safeName = validName.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
          imageUrl = `https://img.pokemondb.net/artwork/large/${safeName}.jpg`;
          console.log("🟢 Fallback image URL found:", imageUrl);
        } else {
          imageUrl = "https://img.pokemondb.net/artwork/large/missingno.jpg";
          console.warn("⚠️ Pokémon not valid, using missingno image.");
        }
      }
    } catch (err) {
      console.error("🟥 Error validating or constructing image URL:", err);
      return res.status(500).json({ error: "Failed to fetch Pokémon image." });
    }

    try {
      const saved = await personalityModel.findOneAndUpdate(
        { customId: req.params.id },
        {
          customId: req.params.id,
          ...json,
          pokemonImage: imageUrl,
          pokemonName: json.pokemonName.toLowerCase(),
        },
        { upsert: true, new: true, overwrite: true }
      );
      console.log("🟢 Saved personality result to DB:", saved);
    } catch (err) {
      console.error("🟥 Error saving personality result to DB:", err);
      return res.status(500).json({ error: "Failed to save result to database." });
    }

    res.json({
      message: "Personality result saved successfully.",
      personality: {
        ...json,
        pokemonImage: imageUrl,
        pokemonName: json.pokemonName.toLowerCase(),
      },
    });
  } catch (err) {
    console.error("🟥 Unexpected error in endpoint:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/api/:id/personality", async (req, res) => {
  try {
    console.log("Fetching personality result for ID:", req.params.id);
    const result = await personalityModel.findOne({ customId: req.params.id });
    if (!result) return res.status(404).json({ message: "Not found" });
    console.log("Result:", result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
