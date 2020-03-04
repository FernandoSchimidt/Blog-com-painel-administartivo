const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database'); //carrega conaxao

const categoriesController = require('./categories/CategoriesController'); // importando a rota
const articleController = require('./article/ArticleController');

const Article = require('./article/Article');
const Category = require('./categories/Category');

//View engine
app.set('view engine', 'ejs');


//arquivos estaticos
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//database
connection.authenticate()
    .then(() => {
        //se sucesso na conexao
        console.log('connection success');
    }).catch((error) => {
        //senao
        console.log(error);
    })

app.use('/', categoriesController);
app.use('/', articleController);

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit:4
    }).then(articles => {

        Category.findAll().then(categories => { //pega as categorias no banco
            res.render('index', {
                articles: articles,
                categories: categories
            });
        });
    });
});
app.get('/:slug', (req, res) => { //pesquisa pelo slug
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article !== undefined) {
            res.render('article', {
                article: article,
                categories: categories

            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if (category !== undefined) {
            Category.findAll().then(categories => {
                res.render('index', {
                    articles: category.articles,
                    categories: categories
                });
            })
        } else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
        console.log('Erro:'+err);
    });
});

app.listen(8080, () => {
    console.log('Servidor rodando');
});