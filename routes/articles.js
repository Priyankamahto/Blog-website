
const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

//Passes an empty Article object to the new.ejs view.
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})
/*
Retrieves an article by ID and renders a form to edit it.
Passes the retrieved article object to the edit.ejs view.*/
router.get('/edit/:id', async(req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

//Retrieves an article by its slug and renders its details.
//Redirects to the homepage if the article is not found.
//Passes the retrieved article object to the show.ejs view.

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})

/*Middleware function (req.article = new Article()) creates a new Article instance and sets it to req.article.
Calls saveArticle('new') middleware function to save the new article*/
router.post('/', async (req, res,next) => {
    req.article=new Article()
    next()
},saveArticle('new'))

/*Calls saveArticle('edit') middleware function to update the article.*/
router.put('/:id', async (req, res,next) => {
    req.article=await Article.findById(req.params.id)
    next()
},saveArticle('edit'))


/*Deletes an article by its ID and redirects to the homepage.*/
router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticle(path){
    return async(req,res)=>{
    let article = req.article
        article.title= req.body.title
        article.description= req.body.description
        article.markdown= req.body.markdown
    
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e) {
        res.render(`articles/${path}`, { article: article })
    }
}}





module.exports = router
