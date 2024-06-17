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
        author: "666fd7c56959cd574c9c1152",
        body: "Will AI severely impact the tech industry?"
    })
    await blog.save()
}
seedDB()