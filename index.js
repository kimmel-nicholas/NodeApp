// import fetch from 'node-fetch';
// for this import, I kept getting a SyntaxError saying: Cannot use import statement outside a module. I couldn't figure out where it wanted me to put it

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose')
let path = require('path')
const ToDo = require('./models/todo.model')
// const fetch = require('node-fetch')

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended : true} ))

//Connection to mongo
const mongoDB = 'mongodb+srv://admin:admin@cluster0.6lrd2.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:    '))


app.get('/zip', function(req, res){
    res.render('zip');
});

app.post('/zip', function(req, res){
    fetch('api.zippopotam.us/')
        .then(res => res.json())
        .then(data => console.log(res));{
        // set the response to your global variable here
        res.render('zip');
    }
});

// app.get('/zip', function(request, response){

// });


app.get('/', function(request, response){
    ToDo.find(function(err, todo){
        if(err){
            console.log(err);
        } else {
            tasks = [];
            completed = [];
            for(i = 0; i < todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i]);
                } else {
                    tasks.push(todo[i]);
                }
            }
            response.render('index', {tasks: tasks, completed: completed});
        }
    });
});

app.post('/addToDo', function(req, res){
    let newtodo = new ToDo({
        item: req.body.newtodo,
        done: false
    })

    newtodo.save(function(err, todo){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

app.post('/removeToDo', function(req, res){
    const remove = req.body.check;
    if(typeof remove === 'string'){
        ToDo.updateOne({_id:remove},{done:true}, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
    }else if (typeof remove === "object"){
        for( var i = 0; i<remove.length; i++){
            ToDo.updateOne({_id:remove[i]},{done:true}, function(err){
                if(err){
                    console.log(err);
                }
            })
        }
        res.redirect('/');
    }
    
})

app.post('/deleteToDo', function(req, res){
    const deleteTask = req.body.delete;
    console.log(typeof deleteTask);
    if(typeof deleteTask === 'string'){
        ToDo.deleteOne({_id: deleteTask}, function(err){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        })
    }else if (typeof deleteTask === "object"){
        for( var i = 0; i<deleteTask.length; i++){
            ToDo.deleteOne({_id: deleteTask[i]}, function(err){
                if(err){
                    console.log(err);
                }
            })
        }
        res.redirect('/');
    }
})

app.listen(3000, function(){
    console.log('App is running on port 3000')
})