var math = require('./math');
var express = require('express');

var app = express.createServer(
  //express.logger()
);
app.configure(function() {
  app.use(app.router);
  app.use(express.errorHandler({
    dumpExceptions: true, showExceptions: true
  }));
});

app.get('/fibonacci/:n', function(req,res,next){
  math.fibonacciAsync(Math.floor(req.params.n), 
    function(val) {
      res.send({n:req.params.n, result: val});
    });
});

app.get('/factorial/:n', function(req,res,next){
  res.send({
    n: req.params.n, 
    result: math.factorial(Math.floor(req.params.n)) 
  });
});

app.get('/mult/:a/:b', function(req,res,next){
  res.send({
    a: req.params.a, b: req.params.b,
    result: req.params.a * req.params.b
  });
});

app.get('/square/:n', function(req,res,next){
  res.send({
    n: req.params.n,
    result: req.params.n * req.params.n
  })
});
app.listen(3002);
console.log("Server listening on http://localhost:3002");