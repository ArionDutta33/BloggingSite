const express = require('express');
const mongoose = require("mongoose")
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Blog = require("./models/blogs")
mongoose.connect("mongodb://127.0.0.1:27017/Blog").then(() => {
    console.log("MONGODB CONNECTED")
})
    .catch((e) => {
        console.log("Error ", e)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}));
// app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//     // console.log(req)
//     next()
// })

app.get("/", (req, res) => {
    res.send("homepage")
})

app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({})
    res.render('blogs/index', { blogs })
});
app.get("/blogs/new", (req, res) => {
    res.send("form for new blog")
})

//post create new blog

//show the individual blog
app.get("/blogs/:id", (req, res) => {
    res.render("blogs/show")
})
app.listen(3000, () => {
    console.log("SERVER RUNNING")
})