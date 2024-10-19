if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function quizGenerator(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Create an MCQ quiz on the topic of ${topic} with 15 questions. Each question should have four answer options labeled (a), (b), (c), and (d), and one correct answer. Output the quiz in JSON format, where each question is an object with the following structure:

{
  "question": "Your question here",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswer": "The correct option here"
}

The final JSON should include an array of 15 such objects, and the correct answers should be one of the provided options.
`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

quizGenerator("linkedList")
  .then((ans) => {
    console.log(ans);
  })
  .catch((err) => {
    console.error(err);
  });
