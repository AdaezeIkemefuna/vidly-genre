const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  client: {
    type: String,
    unique: true,
    required: [true, "Name required"],
  },
  ownerContact: {
    type: Number,
    required: [true, "contact required"],
  },
  package: {
    type: String,
    required: true,
  },
  receiver: {
    type: Number,
  },
  dropOff: String,
  status: String,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
