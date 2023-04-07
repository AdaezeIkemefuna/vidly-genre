const Order = require("../models/orderModel");
const APIFeatures = require("../utils/apiFeatures");
//GET ALIAS ORDERS
exports.aliasOrders = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,price,ratingsAverage,summary,difficulty";
  next();
};

// GET ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Order.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allOrders = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: allOrders.length,
      data: {
        allOrders,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        newOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// GET ORDER
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// UPDATE ORDER
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    Order.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numOrders: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
      {
        $match: { _id: { $ne: "EASY" } },
      },
    ]);

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    console.log(year);
    const plan = await Order.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        //match according to given year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" }, //$month picks out the month in the year and assigns it numbers
          numOrderStats: { $sum: 1 },
          orders: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numOrderStats: -1 },
      },
    ]);

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
