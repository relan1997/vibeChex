import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import QuestionsModel from "./models/questionModel.js";
import genAI from "./geminiClient.js";
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Explain how AI works in a few words");
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      message: "AI response",
      boardId: id,
      data: text,
    });
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
