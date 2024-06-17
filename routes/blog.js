const express = require("express")
const router = express.Router()
const Blog = require("../models/blogs")
const ExpressError = require("../utils/ExpressError")
const Async = require("../utils/Async")
const { isLoggedIn } = require("../middleware")
const { isAuthor } = require("../middleware")
const { validateBlog } = require("../middleware")
const Joi = require("joi")
router.get('/', Async(async (req, res) => {
    const blogs = await Blog.find({}).populate("author")
    res.render('blogs/index', { blogs })
}));
router.get("/new", isLoggedIn, (req, res) => {
    res.render("blogs/new")
})

//middleware
//shifted




//post create new blog
router.post("/", isLoggedIn, validateBlog, Async(async (req, res) => {



    try {
        const blog = new Blog(req.body.blogs)
        blog.author = req.user._id
        await blog.save()
        req.flash("success", "New post added !!!")
        res.redirect("/blogs")

    } catch (e) {
        console.log("error", e)
    }
}))
//show the individual blog
router.get("/:id", Async(async (req, res) => {
    const { id } = req.params
    const blog = await Blog.findById(id)
    res.render("blogs/show", { blog })
}))
router.get("/:id/edit", isLoggedIn, isAuthor, Async(async (req, res) => {
    const { id } = req.params
    const blog = await Blog.findById(id)
    res.render("blogs/edit", { blog })
}))
router.put("/:id", isLoggedIn, isAuthor, Async(async (req, res) => {
    const { id } = req.params
    const blog = await Blog.findByIdAndUpdate(id, req.body.blogs)
    req.flash("success", "Successfully edited the article")
    res.redirect(`/blogs/${blog._id}`)
}))
router.delete("/:id", isLoggedIn, isAuthor, Async(async (req, res) => {

    const { id } = req.params
    const blog = await Blog.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted the article")
    res.redirect(`/blogs`)
}))

module.exports = router





