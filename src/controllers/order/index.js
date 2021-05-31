const Order = require("../../models/order");
const Category = require("../../models/category");
const Product = require("../../models/product");
// const Address = require("../models/address");
const updateQuantityProduct = async (id, quantity) => {
  if (id) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { quantity: quantity },
      {
        new: true,
      }
    );

    return true;
  } else {
    return false;
  }
};

exports.addOrder = async (req, res) => {
  try {
    req.body.customerId = req.customer._id;
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
        for (let product of order.productDetail) {
          Product.findOne({ _id: product.productId }).exec((error, prod) => {
            if (prod) {
              updateQuantityProduct(
                prod._id,
                prod.quantity - product.purchasedQty
              );
            }
          });
        }
        return res.status(201).json({ order });
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
exports.confirmShiped = async (req, res) => {
  const { id } = req.params;
  if (id) {
    orderStatus = [
      {
        type: "ordered",
        isCompleted: false,
      },
      {
        type: "packed",
        isCompleted: false,
      },
      {
        type: "shipped",
        date: new Date(),
        isCompleted: true,
      },
      {
        type: "delivered",
        isCompleted: false,
      },
    ];
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { orderStatus },
      {
        new: true,
      }
    );
    return res.status(201).json({ data: updatedOrder });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};

exports.confirmDevivered = async (req, res) => {
  const { id } = req.params;
  if (id) {
    orderStatus = [
      {
        type: "ordered",
        isCompleted: false,
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
        date: new Date(),
        isCompleted: true,
      },
    ];
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { paymentStatus: "completed", orderStatus },
      {
        new: true,
      }
    );
    return res.status(201).json({ data: updatedOrder });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};

exports.confirmCancel = async (req, res) => {
  const { id } = req.params;
  if (id) {
    orderStatus = [
      {
        type: "ordered",
        date: new Date(),
        isCompleted: false,
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
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { paymentStatus: "cancelled", orderStatus },
      {
        new: true,
      }
    );
    return res
      .status(201)
      .json({ data: updatedOrder, message: "Cancel completed" });
  } else {
    return res.status(400).json({ error: "No ID" });
  }
};

exports.getTopOrders = (req, res) => {
  try {
    let start = req.query.start;
    let end = req.query.end;
    Order.find({})
      .select(
        "_id codeBill paymentStatus paymentType orderStatus productDetail"
      )
      .populate(
        "productDetail.productId",
        "_id name price discount quantity productPictures"
      )
      .exec((error, orders) => {
        if (error) return res.status(400).json({ error });
        if (orders) {
          let listTop = [];
          for (let order of orders) {
            const status = order.orderStatus.find(
              (status) => status.isCompleted === true
            );
            if (status)
              if (status.type === "delivered") {
                for (let prod of order.productDetail) {
                  if (prod.productId === null) continue;
                  var index = listTop.findIndex(
                    (product) =>
                      String(product.product) === String(prod.productId)
                  );
                  if (index !== -1) {
                    listTop[index].sellQuantity =
                      listTop[index].sellQuantity + prod.purchasedQty;
                  } else {
                    var obj = {};
                    obj.product = prod.productId;
                    obj.sellQuantity = prod.purchasedQty;
                    listTop.push(obj);
                  }
                }
              }
          }
          const data = listTop
            .sort((a, b) => b.value - a.value)
            .slice(start, end);
          // console.log(data);
          res.status(200).json({ data: data });
        }
      });
  } catch (error) {
    if (error) return res.status(400).json({ error });
  }
};
