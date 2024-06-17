const express = require("express")
const router = express.Router()
const Blog = require("../models/blogs")
const ExpressError = require("../utils/ExpressError")
const Async = require("../utils/Async")
const { isLoggedIn } = require("../middleware")
const { isAuthor } = require("../middleware")

router.get('/', Async(async (req, res) => {
    const blogs = await Blog.find({}).populate("author")
    res.render('blogs/index', { blogs })
}));
router.get("/new", isLoggedIn, (req, res) => {
    res.render("blogs/new")
})

//post create new blog
router.post("/", isLoggedIn, Async(async (req, res) => {


    const blog = new Blog(req.body.blogs)
    blog.author = req.user._id
    await blog.save()
    res.redirect("/blogs")

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
    res.redirect(`/blogs/${blog._id}`)
}))
router.delete("/:id", isLoggedIn, isAuthor, Async(async (req, res) => {

    const { id } = req.params
    const blog = await Blog.findByIdAndDelete(id)
    res.redirect(`/blogs`)
}))

module.exports = router





