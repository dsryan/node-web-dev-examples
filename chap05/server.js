var port = 4080;
var server = require('./basicserver').createServer();
server.useFavIcon("localhost", "./docroot/favicon.jpg");
server.addContainer(".*", "/l/(.*)$", require('./redirector'), {});
server.docroot("localhost", "/", "./docroot");

//two independent domains with separate content (need to edit /etc/hosts to route traffic to localhost to test)
server.useFavIcon("example.com","./example.com/favicon.png");
server.docroot("example.com", "/", "./example.com");

server.useFavIcon("example2.com","./example2.com/favicon.png");
server.docroot("example2.com", "/", "./example2.com");

//parking one domain name on another
server.useFavIcon("parked.com", "./example.com/favicon.png");
server.docroot("parked.com", "/", "./example.com");

require('./httpsniffer').sniffOn(server);
server.listen(port);