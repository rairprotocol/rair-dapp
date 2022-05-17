module.exports = (req, res, next) => {
  try {
    const { adminRights, publicAddress } = req.user;

    if (!adminRights) {
      return next(new Error(`User ${publicAddress} don't have admin rights.`));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
