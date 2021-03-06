var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Publicacao = require('../models').Publicacao;

/* ROTA QUE RECUPERA CRIA UMA PUBLICAÇÃO */
router.post('/publicar/:idUsuario/:tagAtual',function(req, res, next) {
    console.log("Iniciando Publicação...")

	let idUsuario = req.params.idUsuario;
    // let tagAtual = req.params.sessionStorage.getItem('tag_atual_meuapp');
    let tagAtual = req.params.tagAtual;
    console.log(idUsuario, tagAtual)

    Publicacao.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        URL: req.body.url,
        fkTag: tagAtual,
        fkUsuario: idUsuario
    }).then(resultado => {
        console.log("USUÁRIO CADASTRADO COM SUCESSO!");
        res.send(resultado);
    }).catch(erro => {
        console.log('DEU UM ERRINHO')
        console.error(erro);
        res.status(500).send(erro.message);
    })
})

/* ROTA QUE RECUPERA TODAS AS PUBLICAÇÕES */
router.get('/:tagAtual', function(req, res, next) {
    let tagAtual = req.params.tagAtual;
	console.log('Recuperando todas as publicações');
	
    let instrucaoSql = `SELECT 
    usuario.nomeUsuario,
    publicacao.idPublicacao,
    publicacao.titulo,
    publicacao.URL,
    publicacao.descricao
    FROM publicacao
    INNER JOIN usuario
    ON Publicacao.fkUsuario = Usuario.idUsuario
    WHERE fkTag = ${tagAtual}
    ORDER BY publicacao.idPublicacao DESC`;

	sequelize.query(instrucaoSql, {
		model: Publicacao,
		mapToModel: true 
	})
	.then(resultado => {
		console.log(`Encontrados: ${resultado.length}`);
		res.json(resultado);
	}).catch(erro => {
		console.error(erro);
		res.status(500).send(erro.message);
	});
});


/* ROTA QUE RECUPERA AS PUBLICAÇÕES DE UM USUÁRIO PELO ID */
router.get('/:idUsuario', function(req, res, next) {
	console.log('Recuperando todas as publicações');
	
	var idUsuario = req.params.idUsuario;

    let instrucaoSql = `SELECT 
    usuario.nomeUsuario,
    publicacao.idPublicacao,
    publicacao.titulo,
    publicacao.URL,
    publicacao.descricao
    FROM publicacao
    INNER JOIN usuario
    ON Publicacao.fkUsuario = Usuario.idUsuario
    WHERE fkUsuario = ${idUsuario}
    ORDER BY publicacao.idPublicacao DESC`;

	sequelize.query(instrucaoSql, {
		model: Publicacao,
		mapToModel: true 
	})
	.then(resultado => {
		console.log(`Encontrados: ${resultado.length}`);
		res.json(resultado);
	}).catch(erro => {
		console.error(erro);
		res.status(500).send(erro.message);
	});
});

module.exports = router;
