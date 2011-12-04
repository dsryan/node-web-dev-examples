var util = require('util');
var url = require('url');
var express = require('express');
//var nmDbEngine = 'sqlite3';
var nmDbEngine = 'mongoose';
var notesdb = require('./notesdb-'+nmDbEngine);

var app = express.createServer();

app.use(express.logger());
//helps with parsing forms - the request.body will have all the values of the forms
app.use(express.bodyParser());
app.use(express.cookieParser());
app.register('.html', require('ejs'));

app.set('views', __dirname+'/views-'+nmDbEngine);
app.set('view engine', 'ejs');

var parseUrlParams = function(req, res, next) {
  req.urlP = url.parse(req.url, true);
  next();
}

var checkAccess = function(req, res, next) {
  if (!req.cookies 
      || !req.cookies.notesaccess
      || req.cookies.notesaccess !== 'AOK') {
    res.redirect('/login');
  } else
    next();
}

notesdb.connect(function(error) {
  if (error) throw error;
});

app.on('close', function(erron){
  notesdb.disconnect(function(err){});
});

// Routes
app.get('/', function(req,res){ res.redirect('/view'); });

app.get('/login', function(req, res){
  res.render('login.html', {title: 'Notes LOGIN ('+nmDbEngine+')' });
});

app.post('/login', function(req, res){
  //TBD check creds entered on form
  res.cookie('notesaccess', 'AOK');
  res.redirect('/view');
});

app.get('/view', checkAccess, function(req,res){
  notesdb.allNotes(function(err, notes) {
    if (err) {
      util.log('ERROR '+err);
      throw err;
    } else
      res.render('viewnotes.html', { title: 'Notes ('+nmDbEngine+')', notes: notes });
  });
});

app.get('/add', checkAccess, function(req, res) {
  res.render('addedit.html', {title: 'Notes ('+nmDbEngine+')', postpath: '/add', note: notesdb.emptyNote });
});

app.post('/add', checkAccess, function(req, res) {
  notesdb.add(req.body.author, req.body.note, function(err) {
    if (err) throw err;
    res.redirect('/view');
  });
});

app.get('/del', checkAccess, parseUrlParams, function(req, res) {
  /* Just for testing the 500 page
  // var notallowed = null;
  // noteallowed.delete();
  */
  notesdb.delete(req.urlP.query.id,
    function(err){
      if (err) throw err;
      res.redirect('/view');
    }
  );
});

app.get('/edit', checkAccess, parseUrlParams, function(req, res){
  notesdb.findNoteById(req.urlP.query.id, function(err, note) {
    if (err) throw err;
    res.render('addedit.html', {title: 'Notes ('+nmDbEngine+')', postpath: '/edit', note: note});
  });
});

app.post('/edit', checkAccess, function(req, res){
  notesdb.edit(req.body.id, req.body.author, req.body.note, function(err){
    if (err) throw err;
    res.redirect('/view');
  });
});

// one way to handle errors thrown to browser
// app.use(express.errorHandler({dumpExceptions: true}));

//a more user friendly way
app.error(function(err, req, res){
  res.render('500.html', {title: 'Notes ('+nmDbEngine+') ERROR', error: err});
});

app.listen(3001);