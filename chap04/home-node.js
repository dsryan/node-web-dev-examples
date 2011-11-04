var htutil = require("./htutil");

exports.get = function(req, res) {
  res.writeHead(200, {"Content-Type":"text/html"});
  res.end(htutil.page("Math Tutor", htutil.navbar, "<p>Math Tutor</p>"));
}