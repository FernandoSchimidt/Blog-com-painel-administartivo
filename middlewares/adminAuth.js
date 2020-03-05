function adminAuth(req, res, next) {
    if(req.session.user != undefined){
        next();//usuario logado
    }else{
        res.redirect('/login'); //não logado
    }
}

module.exports = adminAuth;