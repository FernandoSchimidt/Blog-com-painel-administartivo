//express router
const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new'); //pagina new
});

router.post('/categories/save', (req, res) => {
    var title = req.body.title;
    if (title !== undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories'); //redireciona para a pagina de categorias
        })

    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res) => {

    Category.findAll().then(categories => {
        res.render('admin/categories/index', {
            categories: categories
        });

    });
});

//rota para deletar uma categoria
router.post('/categories/delete', (req, res) => {
    var id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) { //verifica se é um numero
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            })
        } else { //nao for numero
            res.redirect('/admin/categories');
        }
    } else { //for nulo
        res.redirect('/admin/categories');
    }
});
router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) { //se o id nao for uma numero redireciona  a pagina para 
        res.redirect('/admin/categories');
    }
    Category.findByPk(id).then(category => { //pesquisar uma categoria pelo id
        if (category !== undefined) {

            res.render('admin/categories/edit', {
                category: category //pasando os dados da categoria
            });

        } else {
            res.redirect('/admin/categories');
        }

    }).catch(erro => {
        res.redirect('/admin/categories');
    });
});

//rota que edita a categoria
router.post('/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title; //recebe via formulario
    

    Category.update({
        title: title ,//valor a ser atualizado
        slug:slugify(title)//atualiza o slug 
    }, {
        where: {
            id: id //atualiza a categoria pelo aid
        }
    }).then(() => {
        res.redirect('/admin/categories');
    })
});
module.exports = router;