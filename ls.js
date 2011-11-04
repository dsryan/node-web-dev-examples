var fs = require('fs');
var files = fs.readdirSync(process.argv[2]);
for (i in files) {
  console.log(files[i]);
}