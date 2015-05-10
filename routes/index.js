var express = require('express');
var router = express.Router();
var r = require("request");
var txUrl = "http://localhost:7474/db/data/transaction/commit";

function cypher(query, params, cb) {
  r.post({
      uri: txUrl,
      json: {
        statements: [{
          statement: query,
          parameters: params
        }]
      }
    },
    function(err, res) {
      cb(err, res.body)
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Get the Actor Page
router.get('/actor', function(req, res, next) {
  res.render('actor');
});


//Sample Query
router.get('/query/sample', function(req, res) {
  var query = "MATCH (n:Person) RETURN n, labels(n) as l LIMIT {limit}";
  var params = {
    limit: 10
  };
  var cb = function(err, data) {
    console.log(JSON.stringify(data));
    res.json(data);
  }
  cypher(query, params, cb);
});


//Actor Pair
router.post('/query/actorPair', function(req, res) {

  var nameActor = (req.body.nameActor);
  var limitRes  = (req.body.limitRes);

  var query = "MATCH (a:Actor)-[:ACTS_IN]->(m:Movie)<-[:ACTS_IN]-(s:Actor) where a.name={name} return a.name,s.name, count(m.title) as NoMovies ORDER BY NoMovies DESC LIMIT {limit}";
  var params = {
    name: nameActor,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});

//Actor for a specific genre
router.post('/query/actorGenre', function(req, res) {

  var movieGenre = (req.body.movieGenre);
  var limitRes  = (req.body.limitRes);

  var query = "match (a:Actor)-[:ACTS_IN]->(m:Movie) where m.genre={genre} return a.name as Actor1, count(m.title)as NumberOfMovies Order BY NumberOfMovies DESC LIMIT {limit}";
  var params = {
    genre: movieGenre,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});

//Actor And Genre
router.post('/query/actorGenrePair', function(req, res) {

  var nameActor = (req.body.nameActor);
  var movieGenre = (req.body.movieGenre);
  var limitRes  = (req.body.limitRes);

  var query = "match (a:Actor)-[:ACTS_IN]->(m:Movie)<- [r:RATED]- () where m.genre={genre} and a.name={name} return a.name as Actor1, count(m.title)as NumberOfMovies, avg(r.stars)as Rating Order BY NumberOfMovies DESC , Rating DESC LIMIT {limit}";
  var params = {
    name: nameActor,
    genre: movieGenre,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});

//Director Two Actors to pair with
router.post('/query/actorPair', function(req, res) {

  var nameActor = (req.body.nameActor);
  var nameActor2 = (req.body.nameActor2);
  var limitRes  = (req.body.limitRes);

  var query = "match (a:Actor)-[:ACTS_IN]->(m:Movie)<-[:ACTS_IN]-(s:Actor) where a.name={name} and s.name={name2} return a.name as Actor1,s.name as Actor2, count(m.title) as NoMovies ORDER BY NumberOfMovies DESC LIMIT {limit}";
  var params = {
    name: nameActor,
    name2: nameActor2,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});

//Director: Genre success for actor
router.post('/query/actorGenreSuccess', function(req, res) {

  var nameActor = (req.body.nameActor);
  var limitRes  = (req.body.limitRes);

  var query = "match (a:Actor)-[:ACTS_IN]->(m:Movie) where a.name= {name} return m.genre as MovieGenre, count(m.title)as NumberOfMovies ORDER BY NumberOfMovies DESC LIMIT {limit}";
  var params = {
    name: nameActor,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});

//Director pair
router.post('/query/actorDirectorPair', function(req, res) {

  var nameActor = (req.body.nameActor);
  var limitRes  = (req.body.limitRes);

  var query = "match (d:Director)-[:DIRECTED]->(m:Movie)<-[ACTS_IN]-(a:Actor)where a.name={name} return d.name as Director, count(m.title) as NumberOfMovies ORDER BY NumberOfMovies DESC LIMIT {limit}";
  var params = {
    name: nameActor,
    limit: 10
  };
  var cb = function(err, data) {
    res.json(data);
  };
  cypher(query, params, cb);
});


module.exports = router;
