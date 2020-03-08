function adminAuth(req, res, next) {
    if(req.session.user != undefined){
        next();//usuario logado
        console.log(req.session.user.name);
    }else{
        res.redirect('/login'); //não logado
    }
}

module.exports = adminAuth;