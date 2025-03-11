//Dependecies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
//Import Fruit Model
const Fruit = require('./models/fruit');
const methodOverride = require('method-override');
const morgan = require('morgan');
const authController = require('./controllers/auth');

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

//method override reads the '_method' query param for 
//information about DELETE or PUT requests
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use('/auth', authController);

//Static asset middleware
//used to send static assests to the client(css, images, DOM manipulation JS)
app.use(express.static('public'));


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

//Path used to show individual fruit using its Id
app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/show.ejs', {fruit: foundFruit});
});

//Delete route- once matched by server.js sends an
//action to MongoDB to delete a document using it's id to find and delete it
app.delete('/fruits/:fruitId', async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits');
});

//Edit route used to send a page to the client with am edit form
//pre-filled out with fruit details
app.get('/fruits/:fruitId/edit', async (req, res) => {
    //1.look up fruit by its id
    const foundFruit = await Fruit.findById(req.params.fruitId);
    //2. respond with edit template with edit form
    res.render('fruits/edit.ejs', {fruit: foundFruit});
});

//Update Route- used to capture edit form submissions from the client
//and send updates to mongoDB
app.put('/fruits/:fruitId', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
    res.redirect(`/fruits/${req.params.fruitId}`);
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
