let quiz;
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const cloudinary = require("cloudinary").v2;
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("./model/clogin.js");
const CompanyProfile = require("./model/companyProfile.js");
const StudentProfile = require("./model/student.js");
// const Profile = require("./model/profile.js");

const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware.js");
const multer = require("multer");

const dbUrl = process.env.ATLASDB_URL;
// const { storage } = require("./cloudConfig.js");

async function extractImage(url) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Error extracting image:", error);
    throw error;
  }
}

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (error) => {
  console.log("Error in MONGO SESSION STORE: ", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("public/images/", express.static("./public/images"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.json());

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connection Succeeded");
  })
  .catch((err) => console.log(err));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

let port = 8080;
app.listen(port, () => {
  console.log("listening to the port: https://localhost:" + port);
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    let { username } = req.body;
    let profile = req.body;
    req.session.user = { username };
    console.log(req.session.user);
    let user = await User.findOne({username: username});
    req.flash("success", "Welcome to Placement Management System!");
    if (user.designation == "student") {
      res.render("studentdash.ejs", {user, profile});
    } else {
      res.render("faculty.ejs");
    }
  }
);

app.post("/studentdash", async (req, res) => {
  let {course, year, cgpa, backlog, resume} = req.body;
  let profile = req.body;
  console.log(req.session)
  let user = await User.findOne({username: req.session.username});
  let student = new StudentProfile({
    user: user._id,
    course: course,
    year: year,
    cgpa: cgpa,
    backlog: backlog,
    resume: resume
  });
  await student.save();
  res.render("studentdash.ejs", {profile});
})

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    let { username, name, email, phone, designation, department, password } =
      req.body;
    req.session.user = { username, email, name, designation };
    const newUser = new User({
      username,
      name,
      email,
      phone,
      designation,
      department,
    });

    await User.register(newUser, password);

    await newUser.save();
    if (newUser.designation == "Student") {
      res.render("studentdash.ejs");
    } else {
      // res.render("faculty.ejs");
      res.redirect("/login");
    }
  } catch (e) {
    res.redirect("/login");
  }
});

// app.get("/logout", function (req, res) {
//   req.logout(function (err) {
//     if (err) {
//       console.error("Error logging out:", err);
//       return next(err);
//     }

//     res.redirect("/main");
//   });
// });

// app.all("*", (req, res, next) => {
//   res.redirect("/index");
// });

// app.get("/add-company", isLoggedIn, (req, res) => {
//   res.render("add-company.ejs");
// });

// app.post("/add-company", isLoggedIn, async (req, res) => {
//   let { name, base, cgpa, role } = req.body;
//   let newCompany = new CompanyProfile({ name, base, cgpa, role });
//   await newCompany.save();
//   res.redirect("/main");
// });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function quizGenerator(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Based on the topic of ${topic} in the context of Engineering, create a multiple-choice quiz with 5 questions. Please format the response in JSON with the following structure:
{
  "title": "MCQ Quiz on ${topic}",
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct answer text here"
    },
    {
      "question": "Next question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct answer text here"
    }
    // Repeat for all 5 questions
  ]
}
Make sure that:
- Strictly Do not include any preamble.
- Each question has 4 answer options.
- Provide the correct answer for each question under "correctAnswer".
`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}



app.get("/practice", (req, res) => {
  res.render("practice.ejs");

})


app.post("/practice", async (req, res) => {
  try {
    const { topic } = req.body;
    const generatedQuiz = await quizGenerator(topic);
   // Log the raw generated quiz

    // Attempt to parse the generated quiz string into an object
    const quiz = JSON.parse(generatedQuiz);
    req.session.quiz = quiz; // Store the generated quiz in the session
    
    res.render("quiz.ejs", { quiz }); // Render the quiz page with the generated quiz
  } catch (err) {
    console.error("Error generating quiz:", err);
    res.status(500).send("Error generating quiz. Please try again.");
  }
});


app.post("/submit-quiz", (req, res) => {
  // console.log("Received quiz submission");
  // console.log("Request body:", req.body);
  // console.log("Session:", req.session);

  const userAnswers = req.body.userAnswers;
  const quiz = req.session.quiz;

  if (!quiz) {
    console.error("Quiz not found in session");
    return res.status(400).json({ error: "Quiz not found in session." });
  }



  let correctCount = 0;
  const results = quiz.questions.map((question, index) => {
    const correctAnswer = question.correctAnswer;
    const userAnswer = userAnswers[`q${index}`];
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) correctCount++;
    return {
      question: question.question,
      userAnswer,
      correctAnswer,
      isCorrect
    };
  });

 
  res.json({ 
    correctCount, 
    totalQuestions: quiz.questions.length,
    results
  });
});

