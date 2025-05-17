import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length === 8, 'Each question must have exactly 8 options'],
    required: true,
  }
});

const questionsModelSchema = new mongoose.Schema({
  customId: {
    type: String,
    required: true,
    unique: true, // Ensures you don't insert duplicates
  },
  questions: {
    type: [questionSchema],
    validate: [arr => arr.length === 15, 'There must be exactly 12 questions'],
    required: true,
  }
});

const QuestionsModel = mongoose.model("QuestionsModel", questionsModelSchema);

export default QuestionsModel;
