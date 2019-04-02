var express = require('express');
var router = express.Router();
var request = require('request');
var mail;
var Mail = require('../controllers/mail')
var tokenOriginal = "";


/* Vai para a página index */
router.get('/', function(req, res, next) {
  res.render('index');
});


/* Depois de clicar no botão, vai para a página do login (app autenticação) */
router.get('/toLogin',(req,res) =>{
  res.redirect('http://localhost:4000/')
});


/* Recebe o mail e o token pelo URL da primeira aplicação e faz a verificação dos tokens:
  -> Logout: Sai para pág inicial
  -> Alteração do token no url ou na caixa de texto: Sai para pág inicial
  -> Faz refresh á pag: continua */
router.get('/mail/:mail',(req, res) => {
  //VERIFICACÃOs EXTERNA (POR VARIAVEL GLOBAL)     
  console.log('Utilizador -> ' +req.params.mail)
  console.log('Token -> ' + req.query.token)    
  if(tokenOriginal == ""){
    mail = req.params.mail
    tokenOriginal = req.query.token
    res.render('mail',{
      mail:req.params.mail, 
      token:req.query.token
    }) 
  }else{
    if(tokenOriginal != req.query.token){
      tokenOriginal = ""
      console.log("2ªVerificação->token : " + tokenOriginal)
      //para "resetar" o token caso nao se verifique a comparação
      res.redirect('http://localhost:4000/logout/'+mail)
    }
  }
})


/*Faz "reset" ao token e redireciona para a app de autenticação */
router.get('/logout',(req,res) => {
  tokenOriginal = ""
  res.redirect('http://localhost:4000/logout/'+mail)
})

  

router.post('/enviaMail', function(req, res, next) {

  var tokenUser = req.body.token
  var emailOrigem = req.body.emailOrigem
  var emailDestino = req.body.emailDestino
  var assunto = req.body.assunto
  var mensagem_texto = req.body.mensagem_texto
  var ttoken = tokenOriginal



  var dadosMailSend = {sender: emailOrigem, 
                       receiver: emailDestino, 
                       assunt: assunto, 
                       message: mensagem_texto}

  

    Mail.sendEmail(dadosMailSend)
          .then( console.log("A enviar"))
          .catch(error => {
              res.status(500).send('Erro: '+ error)
          })
  });


module.exports = router;