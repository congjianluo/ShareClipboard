/**
 * Created by luo on 17-12-29.
 */


var express = require('express');
var path = require('path');
var bodyParser =  require('body-parser');
var session = require('express-session');
var hash = require('pbkdf2-password')();
var filter = require('filter');
var app = express();


var data = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));
app.set('views',path.join(__dirname , 'views') );
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});


function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', restrict,function (req, res) {
  res.render('index',{data:data});
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function (req, res) {
  if(req.body.code == "luo")
    req.session.user = true;
  res.redirect('/');
});

app.get('/hello', restrict,function (req, res) {
  res.send('Hello World!');
});

app.post('/data',function (req, res) {
  data = req.body.data;
  console.log("修改缓存："+data);
  res.send('success');
});

app.post('/get_data',function (req, res) {
  res.send(data);
});


const hostname = '0.0.0.0';
const port = 80;

app.listen(port, hostname,function () {
  console.log('Example app listening on http://' + hostname + ':' + port);
});



