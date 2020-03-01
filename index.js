const express= require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');//carrega conaxao
//View engine
app.set('view engine','ejs');


//arquivos estaticos
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//database
connection.authenticate()
.then(()=>{
    //se sucesso na conexao
    console.log('connection success');
}).catch((error)=>{
    //senao
    console.log(error);
})

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(8080,()=>{
    console.log('Servidor rodando');
});