const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users',adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {
            users: users
        });
    });
});

router.get('/admin/users/create', adminAuth,(req, res) => {
    res.render('admin/users/create')
});

router.post('/users/create',adminAuth, (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                nome:nome,
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch((err) => {
                console.log(err);
                res.redirect('/')
            });

            //  res.json({email,password}); teste para verificar se os dados estao vindo
        } else {
            res.redirect('/admin/users/create');
        }
    });
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {//Se exite o usuario na base
            var corret = bcrypt.compareSync(password,user.password);

            if(corret){//se tiver esta sessao consegui logar
                req.session.user={
                id: user.id,
                email: user.email
                } 
                res.redirect('/admin/articles');
            }else{
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });

});


//Logout
router.get('/logout',(req,res)=>{
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;