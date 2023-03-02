const allOrders = [
  {
    id: "1",
    date: "2nd April, 2022",
    client: "Adaeze",
    ownerContact: "07082836846",
    package: "Egusi",
    receiver: "07069910818",
    dropOff: "Abakpa",
    status: "in-transit",
  },
  {
    id: "2",
    date: "3rd Dec, 2022",
    client: "Hamsa",
    ownerContact: "07082836847",
    package: "Beef",
    receiver: "07069910819",
    dropOff: "Abakpa-nike",
    status: "delayed",
  },
  {
    id: "3",
    date: "4th September, 2022",
    client: "Gift",
    ownerContact: "07082836848",
    package: "Corned Beef",
    receiver: "07069910810",
    dropOff: "UNEC",
    status: "delivered",
  },
];

// GET ORDERS
exports.getAllOrders = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      allOrders,
    },
  });
};

// CREATE ORDER
exports.createOrder = (req, res) => {
  const newId = +allOrders[allOrders.length - 1].id + 1;
  const newOrder = Object.assign({ id: newId }, req.body);

  allOrders.push(newOrder);

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      newOrder,
    },
  });
};

// GET ORDER
exports.getOrder = (req, res) => {
  const id = req.params.id * 1;

  const order = allOrders.find((el) => +el.id === +id);

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};

// UPDATE ORDER
exports.updateOrder = (req, res) => {
  const order = allOrders.find((el) => +el.id === +req.params.id);

  order.client = req.body.client;

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};

// DELETE ORDER
exports.deleteOrder = (req, res) => {
  const order = allOrders.find((el) => +el.id === +req.params.id);

  const index = allOrders.indexOf(order);
  allOrders.splice(index, 1);

  res.status(200).json({
    status: "success",
    data: {
      allOrders,
    },
  });
};
