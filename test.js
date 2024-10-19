if(process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
  }
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


async function quizGenerator(topic) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on the topic of ${topic}, create a multiple-choice quiz with 15 questions. Please format the response in JSON with the following structure:
{
  'title': 'MCQ Quiz on ${topic}',
  'questions': [
    {
      'question': 'Question text here',
      'options': ['Option A', 'Option B', 'Option C', 'Option D'],
      'correctAnswer': 'Correct answer text here'
    },
    {
      'question': 'Next question text here',
      'options': ['Option A', 'Option B', 'Option C', 'Option D'],
      'correctAnswer': 'Correct answer text here'
    },
    // Repeat for all 15 questions
  ]
}
Make sure that:
- Each question has 4 answer options.
- Provide the correct answer for each question under 'correctAnswer'.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

quizGenerator("linkedList").then(ans => {
    console.log(ans);
}).catch(err => {
    console.error(err);
});


 