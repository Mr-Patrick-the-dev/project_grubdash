const { response } = require("express");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Get validation middleware
const validation = require("./dishes.validation");

// TODO: Implement the /dishes handlers needed to make the tests pass


//List handler
function list(req, res, next) {
    res.json({ data: dishes})
};

//Create handler
function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        "id": nextId(),
        "name": name,
        "description": description,
        "price": price,
        "image_url": image_url
    };
    res.status(201).json({ data: newDish })
};

//Read handler
function read(req, res, next){
    res.json({ data: res.locals.dish });
};

//Update handler
function update(req, res, next){
    const dish = res.locals.dish;
    const { data: { name, description, image_url, price } } = req.body;

    if(dish.name !== name){
        dish.name = name;
    };
    if(dish.description !== description){
        dish.description = description;
    };
    if(dish.image_url != image_url){
        dish.image_url = image_url;
    };
    if(dish.price !== price){
        dish.price = price;
    };
    return res.json({ data: dish });
};
    

module.exports = {
    list,
    create: [validation.dishNameCheck, 
        validation.dishDescCheck, 
        validation.dishImageCheck, 
        validation.dishPriceCheck, 
        validation.dishPriceAmntCheck, 
        create],
    read :[validation.dishIdCheck, read],
    update: [validation.dishIdCheck, 
        validation.dishIdMatch,
        validation.dishNameCheck,
        validation.dishDescCheck,
        validation.dishImageCheck, 
        validation.dishPriceCheck,
        validation.dishIsInteger, 
        validation.dishPriceAmntCheck,
        update], 
    

}