// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =============================================================
    var Todo = mongoose.model('Todo', {
      text : String
    });

    //routes ===================================================================

    // telling the app to get all todos
    app.get('/api/todos', function(req, res) {
      // use mongoose to get all the todos in the database
      Todo.find(function(err, todos) {
        // error handling
        if (err)
          res.send(err)
        // telling the app to retunr all the todos as JSON
        res.json(todos);
      });
    });

    //create a todo and send back all todos, once created
    app.post('/api/todos', function(req, res) {

      //create a todo - info will come form AJAX requet form Angular
      Todo.create({
        text : req.body.text,
        done : flase
      }, function(err, todo) {
        if (err)
          res.send(err)
        //this will return all the todos after create
        Todo.find(function(err, todos) {
          if (err)
            res.send(err)
          res.json(todos);
        });
      });
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
      Todo.remove({
        _id : req.params.todo_id
      }, function(err, todo) {
        if (err)
          res.send(err);

        Todo.find(function(err, todos) {
          if (err)
            res.send(err)

          res.json(todos);
        });
      });
    });

    // listen (start app with node server.js) ======================================
    app.listen(3000);
    console.log("App listening on port 3000");
