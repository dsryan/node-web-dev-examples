var htutil = require('./htutil');

exports.get = function(req, res) {
  var result = req.a * req.a;
  res.writeHead(200, {"Content-Type":"text/html"});
  res.end(
    htutil.page("Square", htutil.navbar, [
      (!isNaN(req.a) ?
        ("<p class='result'>{a}<sup>2</sup> = {result}</p>"
          .replace("{a}", req.a)
          .replace("{result}", result))
          : ""),
        "<p>Enter Number to Square</p>",
        "<form name='square' action='/square' method='get'>",
        "A: <input type='text' name='a' /><br/>",
        "<input type='submit' value='Submit' />",
        "</form>"
    ].join("\n"))
  );
}