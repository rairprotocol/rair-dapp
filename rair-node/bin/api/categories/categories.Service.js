const { Category, File } = require('../../models');
const AppError = require('../../utils/errors/AppError');

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const list = await Category.find();
            return res.json({ result: list, success: true });
        } catch (error) {
            return next(new AppError(error));
        }
    },
    updateCategories: async (req, res, next) => {
        try {
            const currentList = await Category.find().lean();
            const { list } = req.body;
            console.info({ currentList, list });
            // eslint-disable-next-line no-restricted-syntax
            for await (const category of currentList) {
                const update = list.find((item) => item?._id === category._id.toString());
                console.info({ update });
                if (update) {
                    await Category.findByIdAndUpdate(update._id, { $set: { name: update.name } });
                } else {
                    const usingCategory = await File.findOne({
                        category: category._id,
                    });
                    console.info('cannot delete', !!usingCategory);
                    if (!usingCategory) {
                        await Category.findByIdAndDelete(category._id);
                    }
                }
            }
            // eslint-disable-next-line no-restricted-syntax
            for await (const category of list) {
                if (category._id) {
                    // eslint-disable-next-line no-continue
                    continue;
                } else {
                    console.info('creating new', category.name);
                    const newCat = new Category({
                        name: category.name,
                    });
                    await newCat.save();
                }
            }
            return next();
        } catch (error) {
            return next(new AppError(error));
        }
    },
};
