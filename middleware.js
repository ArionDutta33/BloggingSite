const Blog = require("./models/blogs")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line

        return res.redirect('/login');
    }
    next();
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    console.log("triggered")
    const { id } = req.params
    const blog = await Blog.findById(id)
    if (!blog.author.equals(req.user._id)) {
        return res.redirect(`/blogs/${blog._id}`)
    }
    next()
}