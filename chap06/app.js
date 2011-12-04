var util = require('util');
var url = require('url');
var express = require('express');
//var nmDbEngine = 'sqlite3';
var nmDbEngine = 'mongoose';
var notesdb = require('./notesdb-'+nmDbEngine);

var app = express.createServer();

app.use(express.logger());
app.use(express.bodyParser());
app.register('.html', require('ejs'));

app.set('views', __dirname+'/views-'+nmDbEngine);
app.set('view engine', 'ejs');

var parseUrlParams = function(req, res, next) {
  req.urlP = url.parse(req.url, true);
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

app.get('/view', function(req,res){
  notesdb.allNotes(function(err, notes) {
    if (err) {
      util.log('ERROR '+err);
      throw err;
    } else
      res.render('viewnotes.html', { title: 'Notes ('+nmDbEngine+')', notes: notes });
  });
});

app.get('/add', function(req, res) {
  res.render('addedit.html', {title: 'Notes ('+nmDbEngine+')', postpath: '/add', note: notesdb.emptyNote });
});

app.post('/add', function(req, res) {
  notesdb.add(req.body.author, req.body.note, function(err) {
    if (err) throw err;
    res.redirect('/view');
  });
});

app.get('/del', parseUrlParams, function(req, res) {
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

app.get('/edit', parseUrlParams, function(req, res){
  notesdb.findNoteById(req.urlP.query.id, function(err, note) {
    if (err) throw err;
    res.render('addedit.html', {title: 'Notes ('+nmDbEngine+')', postpath: '/edit', note: note});
  });
});

app.post('/edit', function(req, res){
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