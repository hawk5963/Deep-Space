var path = require('path');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');

var app = express();
var port = 8006;

var db_filename = path.join(__dirname, 'db', 'user.sqlite3');
var public_dir = path.join(__dirname, 'proj_public');

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

app.get('/SignIn', (req, res) => {
    var req_url = url.parse(req.url);
    var query = decodeURI(req_url.query).split('/');
    var username = query[0];
    var password = query[1];
    db.get('SELECT * FROM user_data WHERE Username LIKE ?', username, (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
	    console.log("your results are " + JSON.stringify(rows));
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(rows));
            res.end();
        }
    });
});

app.use(express.static(public_dir));
var server = app.listen(port);
