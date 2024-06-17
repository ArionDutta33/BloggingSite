const Blog = require("./models/blogs")
const ExpressError = require("./utils/ExpressError")
const { blogSchema } = require("./schemas")
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



module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    } else {
        next()
    }
}