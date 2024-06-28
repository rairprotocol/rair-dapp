const { Category } = require('../../models');
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
    createCategory: async (req, res, next) => {
        try {
            const { name } = req.body;
            const category = new Category({ name });
            await category.save();
            return res.json({ success: true, result: category });
        } catch (error) {
            return next(new AppError(error));
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await Category.findByIdAndUpdate(id, { $set: { name } });
            return res.json({ success: true, result: category });
        } catch (error) {
            return next(new AppError(error));
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            await Category.findByIdAndDelete(id);
            return res.json({ success: true });
        } catch (error) {
            return next(new AppError(error));
        }
    },
};
