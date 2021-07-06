module.exports = (context) => async (req, res, next) => {
  try {
    const { adminNFT: author } = req.user;
    const reg = new RegExp(/^0x\w{40}:\w+$/);
    const fileData = await context.db.File.find({ _id: req.params.mediaId })

    if (!author || !reg.test(author) || author !== fileData.author) {
      return res.status(403).send({ success: false, message: 'You don\'t have permission to manage this file.' });
    }

    return next();
  } catch(err) {
    return next(err);
  }
}
