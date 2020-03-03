const Sequelize = require('sequelize');
//informação para conexao
//const connection = new Sequelize('guiapress','root','F3rn@nd0',{ //trampo
const connection = new Sequelize('guiapress', 'root', '172203', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;