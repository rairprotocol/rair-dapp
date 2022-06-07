exports.getContractById = (contractModel) => async (req, res, next) => {
  try {
    const contract = await contractModel.findById(req.params.contractId, {
      _id: 1,
      contractAddress: 1,
      title: 1,
      blockchain: 1,
    });

    res.json({ success: true, contract });
  } catch (e) {
    next(e);
  }
};
