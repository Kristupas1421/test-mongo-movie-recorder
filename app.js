'use strict';
const express = require('express'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    consolidate = require('consolidate'),
    test = require('assert');

var url = 'mongodb://localhost:27017/test';
var MongoClient = mongo.MongoClient;

var app = express();
app.engine('html', consolidate.nunjucks);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));

var errorLogger = function (req, res, next) {
    console.log("There was an error");
    next();
}

var errorHandler = function (err, req, res, next) {
    res.status(500).send('Error: ' + err.message);
}

MongoClient.connect(url, function (err, db) {
    test.equal(err, null);

    app.post('/addMovie', function (req, res) {
        console.log('Got a new movie entry!');

        let title = req.body.title;
        let year = req.body.year;
        let imdb_url = req.body.imdb_url;

        var films = db.collection('films')

        films.find({'title' : title, 'year' : year}).limit(1).toArray(function(err, docs){
            if(docs.length == 0){
                films.insertOne({ 'title': title, 'year': year, 'imdb_url': imdb_url }, function(err, records){
                    test.equal(err, null);
                    test.equal(records.insertedCount, 1);
                    res.send({ 'title': title, 'year': year, 'imdb_url': imdb_url });   
                });

            }else{
                res.send('There already is a film named ' + title + ' from year ' + year + '!!');
            }
        });
    });

    app.get('/', function (req, res) {
        res.render('index', {
            ip: req.connection.remoteAddress,
            params: [{ name: 'title', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'imdb_url', type: 'text' }]
        });
    });

    app.use(errorLogger);
    app.use(errorHandler);
    app.use(function (req, res, next) {
        res.status(404).send('Not found');
    });

    app.listen(3000, function () {
        console.log("Server is listening on port 3000");
    });
});

