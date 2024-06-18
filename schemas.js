const BaseJoi = require("joi")
const sanitizeHtml=require("sanitize-html")
const { validate } = require("./models/blogs")
const { sanitizeFilter } = require("mongoose")

// module.exports.spotDefinition = Joi.object({
//     blogs: Joi.object({

//         title: Joi.string().required().max(20),
//         body: Joi.string().required().max(100),


//     }).required()
// })

const extension=(joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML': '{{label}} must not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean!==value) return helpers.error('string.escapeHTML',{value})
                    return clean;
            }
        }
    }
})

const Joi=BaseJoi.extend(extension)


module.exports.blogSchema = Joi.object({
    blogs: Joi.object({
        title: Joi.string().max(20).required().escapeHTML(),
        body: Joi.string().required().escapeHTML()
    }).required()
})