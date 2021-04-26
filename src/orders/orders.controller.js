const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//Require he validation functions
const validation = require("./orders.validation");

// TODO: Implement the /orders handlers needed to make the tests pass

//Create handler
function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    const newOrder = {
        "id": nextId(),
        "deliverTo": deliverTo,
        "mobileNumber": mobileNumber,
        "dishes": dishes
    };
    res.status(201).json({ data: newOrder })
};

//List handler
function list(req, res, next){
    res.send({ data: orders});
};

//Read handler
function read(req, res, next){
    res.json({ data: res.locals.order })
};

//Update handler
function update(req, res, next){
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } } = req.body;

    if(order.deliverTo !== deliverTo){
        order.deliverTo = deliverTo;
    };
    if(order.mobileNumber !== mobileNumber){
        order.mobileNumber = mobileNumber
    };
    if(order.status != status){
        order.status = status;
    };
    if(order.dishes !== dishes){
        order.dishes = dishes
    };
    return res.json({ data: order });
};

//Delete handler
function destroy(req, res, next){
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id == Number(orderId));

    const deletedFlips = orders.splice(index, 1);
    res.sendStatus(204);
}

module.exports = {
    list,
    create: [validation.deliverToCheck,
        validation.phoneNumCheck,
        validation.dishesCheck,
        validation.dishQuantityCheck,
        create],
    read: [validation.orderIdCheck, read],
    update: [validation.orderIdCheck,
        validation.deliverToCheck,
        validation.phoneNumCheck,
        validation.dishesCheck,
        validation.dishQuantityCheck,
        validation.orderStatusCheck,
        validation.orderIdMatch,
        update
    ],
    delete: [validation.orderIdCheck,
        validation.orderPendingCheck,
        destroy]
};