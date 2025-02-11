const express = require('express');
const path = require('path');
// const chalk = require('chalk');
// const debug = require('debug')('app');
// const morgan = require('morgan');
// const AppRouter = require('./src/routes/AppRoutes.js');
// const router = require('./src/routes/AppRoutes.js');
const app = express();
app.use(express.static('public'));
// const port = process.env.PORT || PORT;
// const mongoose = require('mongoose');
// const db = mongoose.connection;



// mongoose.connect('mongodb+srv://jontypeter88:5lGMakjB32XisPSs@karoo-safari.cef3r3t.mongodb.net/?retryWrites=true&w=majority&appName=Karoo-Safari')
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function (){
//   console.log("connected to MongoDB");
// });


app.set('views', './src/views');
app.set('view engine', 'ejs');

// app.use('/App.Routes', router)


// app.use(express.static(path.join(__dirname, '/public')));
// app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
// app.use('/', AppRouter);
// app.use(express.json());

// const feedRouter = require('./src/routes/feed.js');


// app.use('/feed', feedRouter);


// app.use(morgan('tiny'));
app.get('/', function(req, res){
    
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// app.listen(port, function(){
//     debug(`Listening on port ${chalk.green(port)}`);
// });

app.listen(3001, function(){
    console.log('Server started on port 3000');
});