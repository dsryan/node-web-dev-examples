var htutil = require('./htutil');
var math = require('./math');

exports.get = function(req, res) {
  res.writeHead(200, {"Content-Type":"text/html"});
  res.end(
    htutil.page("Factorial",htutil.navbar, [
      (!isNaN(req.a) ?
        ("<p class='result'>{a}! = {result}</p>"
          .replace("{a}", Math.floor(req.a))
          .replace("{result}", math.factorial(Math.floor(req.a))))
          : ""),
      "<p>Enter Number to compute factorial</p>",
      "<form name='factorial' action='/factorial' method='get'>",
      "A: <input type='text' name='a' />",
      "<input type='submit' value='Submit' />",
      "</form>"
    ].join("\n"))
  );
}