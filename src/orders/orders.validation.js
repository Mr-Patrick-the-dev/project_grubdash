const path = require("path");

// Use the existing dishes data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//Verify deliverTo
function deliverToCheck(req, res, next){
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo) {
        return next();
    }
    next({
        status: 400,
        message: "Order must include a deliverTo"
    });
};

//Verify mobile number
function phoneNumCheck(req, res, next){
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber) {
        return next();
    }
    next({
        status: 400,
        message: "Order must include a mobileNumber"
    });
};

//Verify dishes is there and is an array and is not empty
function dishesCheck(req, res, next){
    const { data: { dishes } = {} } = req.body;

    //Make sure dishes exists
    if(dishes) {
        //Make sure dishes is an array that is not empty
        if(Array.isArray(dishes) && dishes.length > 0){
            return next()
        }
        next({
            status: 400,
            message: "Order must include at least one dish"
        });
    }
    next({
        status: 400,
        message: "Order must include a dish"
    });
};

//Verify each dish has a quantity
function dishQuantityCheck(req, res, next){
    const { data: { dishes } = {} } = req.body;

    
    for(let i =0; i < dishes.length; i++){
        const dish = dishes[i];
        if(!dish.quantity){
            next({
                status: 400,
                message: `Dish ${i} must have a quantity that is an integer greater than 0`
            });
        }
        if(!(Math.sign(dish.quantity) > 0)) {
            next({
                status: 400,
                message: `Dish ${i} must have a quantity that is an integer greater than 0`
            });
        }
        if(!(Number.isInteger(dish.quantity))) {
            next({
                status: 400,
                message: `Dish ${i} must have a quantity that is an integer greater than 0`
            });
        }
    }
    return next();
};

//Validate order ID
function orderIdCheck(req, res, next){
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id == Number(orderId));
    if(foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id does not exist: ${orderId}`
    });
};

//Validate orderId matches body ID of body id is present
function orderIdMatch(req, res, next){
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;

    if(id) {
        if(id == Number(orderId)) {
            next();
        }
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
        });
    }
    next();
};

//Array of acceptable statuses
const acceptedStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];

//Validate status property
function orderStatusCheck(req, res, next){
    const { data: { status } = {} } = req.body;
    //Check status exists
    if(status) {
        //Check status is an accepted value
        if(acceptedStatuses.includes(status)) {
            //Check status is not deliverd
            if(status !=="delivered") {
                return next();
            }
            next({
                status: 400,
                message: "A delivered order cannot be changed"
            });
        }
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
        });
    }
    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
    });
};

//Validate deleted order is not pending
function orderPendingCheck(req, res, next){
    const status = res.locals.order.status
    
    if(status !== "pending"){
        next({
            status: 400,
            message: "An order cannot be deleted unless it is pending"
        });
    } 
    return next();
};

module.exports = {
    deliverToCheck,
    phoneNumCheck,
    dishesCheck,
    dishQuantityCheck,
    orderIdCheck,
    orderIdMatch,
    orderStatusCheck,
    orderPendingCheck
}