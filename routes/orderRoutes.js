const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/top-5-cheap")
  .get(orderController.aliasOrders, orderController.getAllOrders);

router.route("/order-stats").get(orderController.getOrderStats);
router.route("/monthly-plan/:year").get(orderController.getMonthlyPlan);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
