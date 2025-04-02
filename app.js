const express = require('express');
const path = require('path');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const AppRouter = require('./src/routes/AppRoutes.js');
const app = express();
app.use(express.static('public'));
const port = process.env.PORT || PORT;
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://jontypeter88:lekkerjonty@golfclubs.dyucj.mongodb.net/GolfClubs?retryWrites=true&w=majority&appName=GolfClubs');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("connected to MongoDB");
});
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.use('/', AppRouter);
app.use(express.json());


app.use(morgan('tiny'));
app.get('/', function(req, res){
        res.render(path.join(__dirname + '/src/views/index.ejs'));
});

app.listen(port, function(){
    debug(`Listening on port ${chalk.green(port)}`);
});
