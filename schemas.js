const Joi = require("joi")

module.exports.spotDefinition = Joi.object({
    blogs: Joi.object({

        title: Joi.string().required().max(20),
        body: Joi.string().required().max(100),


    }).required()
})



module.exports.blogSchema = Joi.object({
    blogs: Joi.object({
        title: Joi.string().max(20).required(),
        body: Joi.string().required()
    }).required()
})