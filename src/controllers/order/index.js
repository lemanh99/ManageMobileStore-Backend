const Order = require("../../models/order");
const Category = require("../../models/category");
// const Address = require("../models/address");

exports.addOrder = (req, res) => {
  // Category.deleteOne({ user: req.user._id }).exec((error, result) => {
  // if (error) return res.status(400).json({ error });
  // if (result) {
  try {
    req.body.customerId = req.customer._id;
    console.log(req.body.customerId);
    req.body.orderStatus = [
      {
        type: "ordered",
        date: new Date(),
        isCompleted: true,
      },
      {
        type: "packed",
        isCompleted: false,
      },
      {
        type: "shipped",
        isCompleted: false,
      },
      {
        type: "delivered",
        isCompleted: false,
      },
    ];
    const order = new Order(req.body);
    order.save((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        res.status(201).json({ order });
      }
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  // }
  // });
};

exports.getOrders = (req, res) => {
  Order.find({}).exec((error, orders) => {
    if (error) return res.status(400).json({ error });
    if (orders) {
      res.status(200).json({ data: orders });
    }
  });
};

exports.getOrdersByCustomers = (req, res) => {
  const { id } = req.params;
  Order.find({ customerId: id })
    .select("_id codeBill paymentStatus paymentType orderStatus productDetail")
    .populate("productDetail.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
