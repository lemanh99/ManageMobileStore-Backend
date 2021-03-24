const { requireSigninCustomer, requireSignin } = require("../../common-middleware");
const { addOrder,  getOrder, getOrders, getOrdersByCustomers } = require("../../controllers/order");

const router = require("express").Router();

router.post("/addOrder", requireSigninCustomer, addOrder);
router.get("/getOrders", requireSigninCustomer, getOrdersByCustomers);
router.get("/order/all", requireSignin, getOrders);
router.post("/getOrder", requireSigninCustomer, getOrder);

module.exports = router;