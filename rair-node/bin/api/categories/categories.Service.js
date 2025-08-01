const { Category, File } = require('../../models');
const AppError = require('../../utils/errors/AppError');

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const list = await Category.aggregate([{
                $lookup: {
                    from: 'File',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'files',
                },
            }, {
                $project: {
                  _id: 1,
                  name: 1,
                  files: {
                    $size: '$files',
                  },
                },
              }]);
            return res.json({ result: list, success: true });
        } catch (error) {
            return next(new AppError(error));
        }
    },
    updateCategories: async (req, res, next) => {
        try {
            const currentList = await Category.find().lean();
            const { list } = req.body;
            // eslint-disable-next-line no-restricted-syntax
            for await (const category of list) {
                const exists = currentList.find(
                    (item) => item.name === category.name,
                );
                if (!exists) {
                    await (new Category(
                        { name: category.name },
                    )).save();
                }
            }
            // eslint-disable-next-line no-restricted-syntax
            for await (const category of currentList) {
                const exists = list.find(
                    (item) => item.name === category.name,
                );
                if (!exists) {
                    const usingCategory = await File.findOne({
                        category: category._id,
                    });
                    if (!usingCategory) {
                        await Category.findByIdAndDelete(category._id);
                    }
                }
            }
            return next();
        } catch (error) {
            return next(new AppError(error));
        }
    },
};
