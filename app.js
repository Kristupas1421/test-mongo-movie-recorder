var express = require('express'),
      mongo = require('mongodb'),
consolidate = require('consolidate');

var app = express();

app.get('/', function(req, res){
    res.send("Hello world");
});

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});