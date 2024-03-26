const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Post')
const bodyParser = require('body-parser')
const Categoria = mongoose.model("Categorias")
const Postagem = mongoose.model("posts")

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/postagens', (req, res) => {
    Postagem.find().populate('categoria').sort({date: 'desc'}).then((postagens)=>{
        res.render('admin/postagens', {
            postagens: postagens
        })
    })
    
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categoria) => {
        res.render('admin/addPostagens', {
            categoria: categoria
        })
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })

})

router.post('/postagens/add', (req, res) => {
    var erros = []

    if (req.body.categoria == "0") {
        erros.push({ texto: 'Categoria inválida. Cadastre uma categoria!' })
    }

    if (erros.length > 0) {
        res.render('admin/addPostagens', {
            erros: erros
        })


    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch(()=>{
            req.flash('error_msg', 'Houve um erro ao criar a postagem')
            res.redirect('/admin/postagens')
        })
    }


})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {


        res.render('admin/categorias', {
            cat: categorias,
        })

    }).catch((e) => {
        console.log('ocorreu um erro: ' + e)
    })

})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addCategoria')
})

router.post('/categorias/nova', (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }
    if (!req.body.nome || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "slug inválido" })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: "nome muito pequeno" })
    }

    if (erros.length > 0) {
        res.render('admin/addCategoria', {
            erros: erros
        })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(
            () => {
                req.flash("success_msg", "Categoria criada com sucesso")
                res.redirect("/admin/categorias")
            }
        ).catch((e) => {
            req.flash('error_msg', 'ocorreu um erro ao criar a categoria. Tente novamente!')
            res.send("Ocorreu um erro: " + e)
        })
    }

})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((cat) => {
        res.render("admin/editCategorias", {
            categoria: cat
        })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect('admin/categorias')
    })


})

router.post('/categorias/save', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }

    if (erros.length > 0) {
        res.render('admin/editCategorias', {
            erros: erros
        })

    } else {
        Categoria.findOne({ _id: req.body.id }).then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria atualizada com sucesso")
                res.redirect('/admin/categorias')
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar a edição")
            })


        })


    }

})

router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar categoria')
        res.redirect('/admin/categorias/')
    })
})

router.get('/postagens/edit/:id', (req, res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/editPostagem', {
                postagem: postagem,
                categorias: categorias

            })
        })

    })

})

router.post('/postagens/edit', (req, res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagens)=>{
        
        postagens.titulo = req.body.titulo
        postagens.slug = req.body.slug
        postagens.descricao = req.body.descricao
        postagens.conteudo = req.body.conteudo
        postagens.categoria = req.body.categoria

        postagens.save().then(()=>{
            req.flash('success_msg', 'Postagem atualizada com sucesso')
            res.redirect('/admin/postagens')
        }).catch(()=>{
            req.flash('error_msg', 'Postagem não atualizada. Houve um erro ao editar a postagem.')
            res.redirect('/admin/postagens')
        })
    })
})

module.exports = router