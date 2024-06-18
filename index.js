if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}

const express = require('express');
const mongoose = require("mongoose")
const app = express();
const Async = require("./utils/Async")
const ExpressError = require("./utils/ExpressError")
const path = require('path');
const session = require("express-session")
const flash = require('connect-flash');

const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const Blog = require("./models/blogs")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require("helmet")
const db_url =process.env.DB_URL|| "mongodb://127.0.0.1:27017/Blog"
// process.env.DB_URL

const MongoDBStrore=require("connect-mongo")(session)
//routes


const blogRoutes = require("./routes/blog")


const userRoutes = require("./routes/user");
const { object, func } = require('joi');
const { strict } = require("assert");


//end

mongoose.connect(db_url).then(() => {
    console.log("MONGODB CONNECTED")
})
    .catch((e) => {
        console.log("Error ", e)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
const secret = process.env.SECRET || "password"
const store=new MongoDBStrore({
    url:db_url,
    secret,
    touchAfter:24*60*60
})
store.on("error",function(e){
    console.log("Session error",e)
})

const sessionConfig = {
    store,
    name:"session",
    secret ,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        httpOnly: true,
        secure:true,//cookies are accessible through https
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet( ))

// const scriptSrcUrls = [
//     "'self'",
//     "'unsafe-inline'",
//     "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
//     "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
//     "https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.2/tinymce.min.js",
//     "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7/tinymce.min.js",
//     "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/themes/silver/theme.min.js" // Add this line
// ];
// const styleSrcUrls = [
//     "'self'",
//     "'unsafe-inline'",
//     "https://fonts.googleapis.com",
//     "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css", // Example for Font Awesome
// ];
// const fontSrcUrls = [
//     "'self'",
//     "https://fonts.googleapis.com",
//     "https://fonts.gstatic.com",
//     "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/", // Example for Font Awesome
// ];
// const workerSrcUrls = [
//     "'self'",
//     "blob:",
//     // Add other worker sources if required by Tinymce
// ];

// const imgSrcUrls = [
//     "'self'",
//     "blob:",
//     "data:",
//     "https://unsplash.com/",
//     "https://images.unsplash.com/",
//    " https://sp.tinymce.com"
//     // Add other image sources if required by Tinymce
// ];

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://sp.tinymce.com",
                "https://cdn.tiny.cloud",
                "'unsafe-inline'",
                "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/plugins/*", // Add this line
            ],
            styleSrc: [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com",
                "'unsafe-inline'",
                "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/themes/silver/theme.min.css", // Add this line
                "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/skins/ui/oxide/skin.min.css", // Add this line
                "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/skins/content/default/content.min.css", // Add this line
            ],
            fontSrc: [
                "'self'",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com",
            ],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://unsplash.com",
                "https://images.unsplash.com",
                "https://sp.tinymce.com",
            ],
            connectSrc: [
                "'self'",
                "https://sp.tinymce.com",
                "https://cdn.tiny.cloud/1/gajuheuruiqplk071bg268yxvuipk6aj30mbrf5912k1ghax/tinymce/7.1.2-65/cdn-init", // Add this line
            ],
        },
    },
}));



app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use(express.urlencoded({
    extended: true
}));
//method override
app.use(methodOverride('_method'))
// app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())
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


const port=process.env.PORT||3000
app.listen(port, () => {
    console.log("SERVER RUNNING")
})