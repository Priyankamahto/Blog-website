const express = require('express')
const articleRouter = require("./routes/articles")
const Article = require('./models/article')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()


require('dotenv').config();

//Check MongoDB connection URI:
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MongoDB connection URI is not defined in the environment variables.");
    process.exit(1); // Exit the process if MongoDB URI is not defined
}

//Connect to MongoDB:
mongoose.connect(mongoURI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});
app.set("views", "./view")
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.get('/', async(req, res) => {
    const articles =await Article.find().sort({ createdAt:'desc'})
    res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

app.listen(3000)
