const { requireSigninCustomer, requireSignin } = require("../../common-middleware");
const { addOrder,  getOrder, getOrders, getOrdersByCustomers, confirmDevivered, confirmCancel, confirmShiped } = require("../../controllers/order");

const router = require("express").Router();


router.get("/order/all", requireSignin, getOrders);
router.get("/order/:id", requireSigninCustomer, getOrdersByCustomers);
router.post("/addOrder", requireSigninCustomer, addOrder);
router.post("/getOrder", requireSigninCustomer, getOrder);
router.post("/confirm-delivered/:id", requireSigninCustomer, confirmDevivered)
router.post("/confirm-canceled-by-customer/:id", requireSigninCustomer, confirmCancel)
router.post("/confirm-canceled-by-admin/:id", requireSignin, confirmCancel)
router.post("/confirm-shiped/:id", requireSignin, confirmShiped)

module.exports = router;