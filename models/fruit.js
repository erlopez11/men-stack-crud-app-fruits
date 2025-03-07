const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
//this module exports the fruit model
//the fruit model provides us with full-CRUD
//functionality over our fruits collection
//in the fruits-app database