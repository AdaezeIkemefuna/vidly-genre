const tours = [
  {
    name: 'The Hiker',
    price: 300,
    duration: 15,
    id: 1,
  },
  {
    name: 'The Adventurer',
    price: 300,
    duration: 15,
    id: 2,
  },
];
exports.checkId = (req, res, next) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Tour must contain a name and a price',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    tours,
  });
};

exports.createTour = (req, res) => {
  const id = Math.floor(Math.random() * 10);
  req.body.id = id;
  res.status(201).json({
    requestedAt: req.requestTime,
    results: req.body.length,
    data: req.body,
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === Number(req.params.id));
  res.status(201).json({
    requestedAt: req.requestTime,
    results: tour.length,
    data: tour,
  });
};

exports.updateTour = (req, res) => {
  const tour = tours.find((el) => el.id === Number(req.params.id));
  res.status(201).json({
    requestedAt: req.requestTime,
    results: tour.length,
    data: tour,
  });
};

exports.deleteTour = (req, res) => {
  const tour = tours.find((el) => el.id === Number(req.params.id));
  res.status(201).json({
    requestedAt: req.requestTime,
    results: tour.length,
    data: tour,
  });
};
