//interact with MongoDB databases, and perform CRUD operations.
const mongoose=require('mongoose')
//Markdown strings to HTML, which is useful for rendering formatted text in web applications.
const { marked } = require('marked')
// generate slugs from strings, ensuring that they are suitable for use in URLs without special characters.
const slugify = require('slugify')
//create a dompurify instance by passing it a JSDOM window object, which allows you to sanitize HTML content to make it safe for rendering in web applications.
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const dompurify = createDomPurify(new JSDOM().window)




/*title: The title of the article, a required string.
description: A brief description of the article, an optional string.
markdown: The main content of the article in Markdown format, a required string.
createdAt: The date the article was created, defaults to the current date and time.
slug: A URL-friendly version of the title, a required and unique string.
sanitizedHTML: The HTML version of the Markdown content, sanitized to prevent XSS, a required string.*/
const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML:{
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next){
    /*if title is not empty we are clallig slugify with title and 
    with options lower: true: Converts the resulting slug to lowercase. and 
    strict: true: Removes special characters and converts spaces and other punctuation to hyphens, ensuring the slug is URL-friendly.*/
    if(this.title){
        this.slug = slugify(this.title,{lower:true, strict: true})
    }
    /*Then, dompurify.sanitize will clean this HTML to ensure it is safe for rendering. */
    if(this.markdown){
        this.sanitizedHTML= dompurify.sanitize(marked(this.markdown))
    }

    next()

 
})

//defines a Mongoose model named 'Article' based on the articleSchema. AND model available for use in other parts of your application.
module.exports = mongoose.model('Article',articleSchema)
