
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , db = require("mongojs").connect('backbone_tasks', ['tasks'])
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.get('/', function(req, res){
  db.tasks.find().sort({ $natural: -1 }, function(err, tasks) {
    res.render('index.jade', { 
      tasks: JSON.stringify(tasks),
      layout: false
    });
  });
});

app.get('/api/tasks', function(req, res){
  db.tasks.find().sort({ $natural: -1 }, function(err, tasks) {
    res.json(tasks);
  });
});

app.get('/api/tasks/:id', function(req, res){
  db.tasks.findOne( { _id: db.ObjectId(req.params.id) } , function(err, task) {
    res.json(task);
  });
});

app.post('/api/tasks', function(req, res){
  db.tasks.save(req.body, function(err, task) {
    res.json(task, 201);
  });
});

app.put('/api/tasks/:id', function(req, res){
  db.tasks.update( { _id: db.ObjectId(req.params.id) }, { $set: { title: req.body.title } }, function(err, task) {
    res.json(200);
  });
});

app.del('/api/tasks/:id', function(req, res){
  db.tasks.remove( { _id: db.ObjectId(req.params.id) }, function(err) {
    res.send();
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
