var express = require('express'),
 bodyParser = require('body-parser'), 
      mongo = require('mongodb'),
consolidate = require('consolidate');

var app = express();
app.engine('html', consolidate.nunjucks);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){  
    res.render('index', {ip : req.connection.remoteAddress,
                         params : [ {name: 'Title', type: 'text' },
                                    {name: 'Year', type: 'number' },
                                    {name: 'imdb url', type: 'text' }]  
                        });
});

app.post('/addMovie', function(req, res, next){
    console.log('got post data');
    res.send();
});

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});

app.use(function(req, res){
       res.send(404);
});