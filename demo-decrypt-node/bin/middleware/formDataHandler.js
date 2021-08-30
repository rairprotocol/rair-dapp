module.exports = (req, res, next) => {
  try {
    const { offer } = req.body;

    req.body.offer = JSON.parse(offer);

    next();
  } catch (err) {
    return next(err);
  }
};
