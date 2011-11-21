var fs = require('fs');
var mime = require('mime');
var sys = require('sys');
exports.handle = function(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(404, {'Content-Type':'text/plain'});
    res.end("invalid method "+req.method);
  } else {
    
  }
}