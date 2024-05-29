module.exports = (req, res, next) => {
  try {
    const { offer } = req.body;

    if (offer) req.body.offer = JSON.parse(offer);

    return next();
  } catch (err) {
    return next(err);
  }
};
