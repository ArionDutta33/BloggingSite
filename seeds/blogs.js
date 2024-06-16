const { default: mongoose } = require("mongoose");
const Blog = require("../models/blogs")
mongoose.connect("mongodb://127.0.0.1:27017/Blog").then(() => {
    console.log("MONGODB CONNECTED")
}).catch((e) => {
    console.log(e, "Error from mongodb")
})
const seedDB = async () => {
    const blog = new Blog({
        title: "AI and future of Tech",
        author: "John Doe",
        body: "Will AI severely impact the tech industry?"
    })
    await blog.save()
}
seedDB()