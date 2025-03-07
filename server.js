//Dependecies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
//Import Fruit Model
const Fruit = require('./models/fruit');

//initialize the Express Application
const app = express();

//config code
dotenv.config();

//Initialize connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);
//Type of event listener listen for specific events related to connectiond in MongoDB
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', (error) => {
    console.log(`An error conenction to MongoDB has occured: ${error}`);
})
//Mount Middleware function here

//body parser middleware: this function reads the request body
//and decodes ut into req.body so we can acesss form data!
app.use(express.urlencoded({extended: false}));

//Routes

//Root path/route (homepage)
app.get('/', (req, res) => {
    res.render('index.ejs');
});

//Path to page with a fomr
app.get('/fruits/new', (req, res) => {
    //never add a trailing slash with render!
    res.render('fruits/new.ejs');
});

//Path used to recieve form submissions
app.post('/fruits', async (req, res) => {
    //conditional logic to handle the
    //default behavior of HTM form checkbox fields
    //we do this when we need a boolean instead of a string
    if(req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body); //writes changes to database
    //redirect tells the client to navigate to
    //a new url path/another page
    res.redirect('/fruits'); // <-- URL path
});

//Path used to show index of fruits- sends a page that lists all fruits
app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find({});
    res.render('fruits/index.ejs', {fruits: allFruits});
});



app.listen(3000, () => {
    console.log('Listening on port 3000');
});
