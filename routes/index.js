var express = require('express');
var router = express.Router();
var r=require("request");
var txUrl = "http://localhost:7474/db/data/transaction/commit";

function cypher(query,params,cb) {
  r.post({uri:txUrl,
          json:{statements:[{statement:query,parameters:params}]}},
         function(err,res) { cb(err,res.body)});
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query/sample', function(req, res){
  var query="MATCH (n:Person) RETURN n, labels(n) as l LIMIT {limit}";
  var params={limit: 10};
  var cb=function(err,data) { console.log(JSON.stringify(data));
  res.json(data); }
  cypher(query,params,cb);
});






module.exports = router;
