import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
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
    required: true,
  }
});

const QuestionsModel = mongoose.model("QuestionsModel", questionsModelSchema);

export default QuestionsModel;
