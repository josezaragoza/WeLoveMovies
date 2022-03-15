const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors")

router
  .route("/:reviewId")
  .delete(controller.delete)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/").get(cors(), controller.list).all(methodNotAllowed);

module.exports = router;
