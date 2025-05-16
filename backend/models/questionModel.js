import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length === 4, 'Each question must have exactly 4 options'],
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
    validate: [arr => arr.length === 12, 'There must be exactly 12 questions'],
    required: true,
  }
});

const QuestionsModel = mongoose.model("QuestionsModel", questionsModelSchema);

export default QuestionsModel;
