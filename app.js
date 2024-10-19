if(process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
  }
  
  const cloudinary = require("cloudinary").v2;
  const express = require("express");
  const app = express();
  
  const mongoose = require("mongoose");
  const path = require("path");
  const axios = require('axios');
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const User = require("./model/user.js");
  const CompanyProfile = require("./model/companyProfile.js");
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
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        console.error('Error extracting image:', error);
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
    touchAfter: 24*60*60,
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
  app.listen(port, ()=>{
    console.log("listening to the port: https://localhost:" + port);
  });
  
  
  app.get("/login", (req, res) => {
    res.render("login.ejs");
  })
  
  app.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        let {username, designation} = req.body;
        req.session.user = {username};
        req.flash("success", "Welcome to Placement Management System!");
        if(designation == "Student") {
            res.render("student.ejs")
        }else{
          res.render("faculty.ejs");
        }
    }
  );
  
 app.get("/signup", (req,res)=>{
    res.render("signup.ejs");
 })
  
  app.post("/signup", async (req, res) => {
    try {
        let { username, name, email, phone, designation, department, password } = req.body;
        req.session.user = { username, email, name, phone };
        const newUser = new User({ username, name, email, phone, designation, department});
  
        await User.register(newUser, password);
  
        await newUser.save();
        if(newUser.designation == "Student") {
            res.render("student.ejs")
        }
        else {
            res.render("faculty.ejs")
        }
    } catch (e) {
        res.redirect("/signup");
    }
  });
  
  app.get('/logout', function(req, res){
    
    req.logout(function(err) {
        if (err) {
            console.error("Error logging out:", err);
            return next(err);
        }

        res.redirect('/main'); 
    });
  });
  
  app.all("*",  (req, res, next) => {
    res.redirect("/index");
  });

app.get("/add-company", isLoggedIn, (req, res) => {
    res.render("add-company.ejs");
})

app.post("/add-company", isLoggedIn, async (req, res) => {
    let { name, base, cgpa, role } = req.body;
    let newCompany = new CompanyProfile({ name, base, cgpa, role });
    await newCompany.save();
    res.redirect("/main");
} )

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function quizGenerator(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `On the basis of ${topic}, Create a MCQ Quiz of 15 Questions.`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}



