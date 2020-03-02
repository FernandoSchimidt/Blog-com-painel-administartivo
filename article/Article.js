const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category'); //qual classe vai se relacionar

const Article = connection.define('articles',{
   title:{
       type:Sequelize.STRING,
       allowNull:false
   },slug:{
       type:Sequelize.STRING,
       allowNull:false
   },
   body:{
       type:Sequelize.TEXT,
       allowNull:false
   }
});
//Relacionamentos
Category.hasMany(Article); //Uma categoria tem muitos artigos(realcionamento 1:N)
Article.belongsTo(Category);//Um artigo pertence a uma categoria(realcionamento 1:1)

//Atualizar a tabela do banco
//Article.sync({force:true});

module.exports = Article;