//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin.js')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
// Configurações
    //Sessão
        app.use(session({
            secret: "12345",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    //Midleware
        app.use((req, res, next)=>{
            //variáveis globais
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    // body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main', 
        runtimeOptions:{
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.connect("mongodb://127.0.0.1:27017/blogApp").then(()=>{
            console.log("Conectado ao banco de dados com sucesso")
        }).catch((e)=>{
            console.log("Ocorreu um erro ao conectar: "+e)
        })
            
        

    // Public
        app.use(express.static(path.join(__dirname,"public")))
        
        
// Rotas
    app.get('/', (req, res)=>{
        res.send('Rota principal')
    })
    app.use('/admin', admin)

// Outros
const PORT = 3000
app.listen(PORT, ()=>{
    console.log('Servidor rodando na url: localhost:3000')
})