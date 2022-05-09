module.exports = (req, res, next) => {
  try {
    const { offer } = req.body;

    req.body.offer = JSON.parse(offer);

    return next();
  } catch (err) {
    return next(err);
  }
};
