const express = require('express');
const mongoose = require("mongoose")
const app = express();
const Async = require("./utils/Async")
const ExpressError = require("./utils/ExpressError")
const path = require('path');
const session = require("express-session")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const Blog = require("./models/blogs")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user");

//routes



const blogRoutes = require("./routes/blog")


const userRoutes = require("./routes/user")


//end

mongoose.connect("mongodb://127.0.0.1:27017/Blog").then(() => {
    console.log("MONGODB CONNECTED")
})
    .catch((e) => {
        console.log("Error ", e)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const sessionConfig = {
    secret: "password",
    resave: false,
    saveUninitialized: true,
    Cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
//flash
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.use(express.urlencoded({
    extended: true
}));
//method override
app.use(methodOverride('_method'))
// app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     // console.log(req)
//     next()
// })
//fake user
app.get("/fakeuser", async (req, res) => {
    const user = new User({ email: "email@email.com", username: "John Doe" })
    const registeredUser = await User.register(user, "password")
    res.send(registeredUser)
})

app.get("/", (req, res) => {
    res.render("index")
})
app.use("/", userRoutes)
app.use("/blogs", blogRoutes)


app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render("error", {
        err
    })
})
app.listen(3000, () => {
    console.log("SERVER RUNNING")
})