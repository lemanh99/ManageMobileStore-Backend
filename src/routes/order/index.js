const { requireSigninCustomer, requireSignin } = require("../../common-middleware");
const { addOrder,  getOrder, getOrders, getOrdersByCustomers, confirmDevivered, confirmCancel } = require("../../controllers/order");

const router = require("express").Router();


router.post("/addOrder", requireSigninCustomer, addOrder);
router.get("/order/:id", requireSigninCustomer, getOrdersByCustomers);
router.get("/order/all", requireSignin, getOrders);
router.post("/getOrder", requireSigninCustomer, getOrder);
router.post("/confirm-delivered/:id", requireSigninCustomer, confirmDevivered)
router.post("/confirm-canceled/:id", requireSigninCustomer, confirmCancel)

module.exports = router;