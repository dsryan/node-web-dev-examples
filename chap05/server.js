var port = 4080;
var server = require('./basicserver').createServer();
//server.useFavIcon("localhost", "./docroot/favicon.jpg");
//server.docroot("localhost", "/", "./docroot");
require('./httpsniffer').sniffOn(server);
server.listen(port);