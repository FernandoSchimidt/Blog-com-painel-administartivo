//express router
const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {
            categories: categories
        }); //pagina new

    })
});

//rota de busca na base
router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }] //join
    }).then(articles => { //busca todos artigos na base
        res.render('admin/articles/index', {
            articles: articles
        });
    });
});
//rota que grava o artigo
router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    if (title || body || category !== undefined) {
        //grava no modelo
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect('/admin/articles');
        });

    } else {
        res.redirect('/admin/articles');
    }

});
//rota para deletar um artigo
router.post('/articles/delete', (req, res) => {
    var id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) { //verifica se é um numero
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            })
        } else { //nao for numero
            res.redirect('/admin/articles');
        }
    } else { //for nulo
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => { //pesquisar uma categoria pelo id
        if (article !== undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {
                    categories: categories,
                    article: article
                });
            });

        } else {
            res.redirect('/');
        }

    }).catch(erro => {
        console.log(erro);
        res.redirect('/');
    });
});

//rota que edita o artigo
router.post('/articles/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title; //recebe via formulario
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title: title, //valor a ser atualizado
        body: body,
        vategoryId: category,
        slug: slugify(title)
    }, {
        where: {
            id: id //atualiza o artigo pelo id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(err => {
        res.redirect('');
    });
});

//limita os artigos por pagina
router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = parseInt(page) * 4;
    }

    Article.findAndCountAll({
        limit: 4, //4por pagina a partir do 0
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        var next;
        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true;
        }
        var result = {
            page:parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {
                result: result,
                categories: categories
            })
        });


    });
});

module.exports = router;