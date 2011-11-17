var http = require('http');
var url = require('url');

exports.createServer = function() {
  var htserver = http.createServer(function(req,res){
    req.basicServer = {
      urlparsed: url.parse(req.url, true)
    };
    processHeaders(req, res);
    dispatchToContainer(htserver, req, res);
  });
  htserver.basicServer = { containers: [] };
  htserver.addContainer = function(host, path, module, options) {
    if (lookupContainer(htserver, host, path) !== undefined) {
      throw new Error("Already mapped "+host+"/"+path);
    }
    htserver.basicServer.containers.push({
      host: host, path: path, module: module, options: options
    });
    return this;
  }
  htserver.useFavIcon = function(host, path) {
    return this.addContainer(host, "/favicon.ico", require('./faviconHandler'), { iconPath: path });
  }
  htserver.docroot = function(host, path, rootPath) {
    return this.addContainer(host, path, require('./staticHandler'), {docroot: rootPath});
  }
  return htserver;
}