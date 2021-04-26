const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Validation for names of dishes
function dishNameCheck(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a name"
    })
};


//Validation for description of dishes
function dishDescCheck(req, res, next) {
    const { data: { description } = {} } = req.body;
    if (description) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a description"
    })
};

//Validation for price of dishes
function dishPriceCheck(req, res, next){
    const { data: { price } = {} } = req.body;
    if(price){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a price"
    });
};

//Validate that price is an integer
function dishIsInteger(req, res, next){
    const { data: { price } = {} } = req.body;
    if(Number.isInteger(price)){
        return next();
    }
    return next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0"
    });
};

//Check that price is greater than 0
function dishPriceAmntCheck(req, res, next){
    const { data: { price } = {} } = req.body;
    if(Math.sign(price) > 0){
        return next();
    }
    next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0"
    });
}


//Validation for Image URL
function dishImageCheck(req, res, next){
    const { data: { image_url } = {} } = req.body;
    if(image_url){
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a image_url"
    });
};

//Validate dish ID
function dishIdCheck(req, res, next){
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id == Number(dishId));
    if(foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id does not exist: ${dishId}`
    })
}

//Validate matching dishId in body and params
function dishIdMatch(req, res, next){
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;

    if(id) {
        if(id == Number(dishId)) {
            next();
        }
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        });
    }
    next();
};

module.exports = {
    dishNameCheck,
    dishDescCheck,
    dishImageCheck,
    dishPriceCheck,
    dishPriceAmntCheck,
    dishIdCheck,
    dishIdMatch,
    dishIsInteger
};