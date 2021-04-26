const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

//router for /dishes/:id
router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);
//router for /dishes
router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

module.exports = router;
