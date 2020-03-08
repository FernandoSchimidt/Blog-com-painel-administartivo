const Sequelize = require('sequelize');
//informação para conexao
//const connection = new Sequelize('blogfernandoschi','fernandoschimidt','F3rn4nd0',{
//const connection = new Sequelize('guiapress','root','F3rn@nd0',{ //trampo
const connection = new Sequelize('guiapress', 'root', '172203', {
//host:'mysql669.umbler.com',
//dialect:'mysql',
//timezone:'-03:00'  
 host: 'localhost',
     dialect: 'mysql',
     timezone:'-03:00'//ajusta a hora do brazil
});

module.exports = connection;