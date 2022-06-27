exports.globalSearch = (models, allFlag) => async (req, res, next) => {
  try {
    const { User, Product, MintedToken } = models;
    // User search
    const limit = allFlag ? 200 : 4;
    const users = await User.search(
      req.params.textParam,
      User.defaultProjection,
      limit,
    );
    const products = await Product.search(
      req.params.textParam,
      Product.defaultProjection,
      limit,
    );
    const tokens = await MintedToken.search(
      req.params.textParam,
      MintedToken.defaultProjection,
      limit,
    );
    if (users.length === 0 && products.length === 0 && tokens.length === 0) {
      return res.json({ success: false, message: 'Nothing found...' });
    }
    const data = { users, products, tokens };
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
