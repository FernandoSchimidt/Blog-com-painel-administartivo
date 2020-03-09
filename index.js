const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database'); //carrega conaxao

const categoriesController = require('./categories/CategoriesController'); // importando a rota
const articleController = require('./article/ArticleController');
const userController = require('./users/UserController'); //importa as rotas


const Article = require('./article/Article');
const Category = require('./categories/Category');
const User = require('./users/User');
//View engine
app.set('view engine', 'ejs');


//Sessions

//Redis

app.use(session({
    secret: 'node',
    cookie: {
        maxAge: 30000000000000 //tempo de duração da sessao
    }
}));

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
app.use('/', userController);

// app.get('/session', (req, res) => {
//     req.session.treinamento = 'Formação nodejs'
//     req.session.ano = 2020;
//     req.session.email = 'fernando@fer.com'
//     req.session.user = {
//         username: 'fernando',
//         email: 'fer',
//         id: 10
//     }
//     res.send('Sessão gerada'); //toda seção tem que mandar uma respostaobrigatóriamente
// });

// app.get('/leitura', (req, res) => {
//     res.json({
//         treinamento: req.session.treinamento,
//         amo: req.session.ano,
//         email: req.session.email,
//         user: req.session.user

//     })
// });

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
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
        if (article != undefined) {
            console.error('bateu no if');
            res.render('article', {
                article: article

            });
        } else {
            console.error('bateu no else');
            res.redirect('/');
        }
    }).catch(err => {
        console.error('Bateu no erro')
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
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
        console.log('Erro:' + err);
    });
});

umbler
 app.listen(3000, () => {
    console.log('Servidor rodando');
 });
// app.listen(8080, () => {
//     console.log('Servidor rodando');
// });