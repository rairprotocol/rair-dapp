/* eslint-disable implicit-arrow-linebreak */
const _ = require('lodash');
const AppError = require('./appError');
const APIFeatures = require('./apiFeatures');

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model, additionalFields = {}) =>
  catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(_.assign(
      req.body,
      _.reduce(additionalFields, (r, v, k) => {
        // eslint-disable-next-line no-param-reassign
        r[k] = _.get(req, v, null);
        return r;
      }, {}),
    ));

    res.status(201).json({
      status: 'success',
      data: {
        doc: newdoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) {
      Model.findById(req.params.id).populate(populateOptions);
    }
    const doc = await query;
    // Tour.findOne({ _id: req.params.id })

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const filterOptions = options.filter
      ? _.reduce(options.filter, (r, v, k) => {
        // eslint-disable-next-line no-param-reassign
        r[k] = _.get(req, v, v);
        return r;
      }, {})
      : undefined;
    let features;

    if (options.populateOptions) {
      features = new APIFeatures(
        Model.find().populate(options.populateOptions),
        req.query,
      )
        .filter(
          filterOptions,
          options.populateOptions,
        )
        .sort(options.hardcodedSorting ? options.hardcodedSorting : undefined)
        .limitFields(
          options.hardcodedProjection ? options.hardcodedProjection : undefined,
        )
        .paginate();
    } else {
      features = new APIFeatures(Model.find(), req.query)
        .filter(filterOptions)
        .sort(options.hardcodedSorting ? options.hardcodedSorting : undefined)
        .limitFields(
          options.hardcodedProjection ? options.hardcodedProjection : undefined,
        )
        .paginate();
    }

    const doc = await features.query.find();
    if (!doc) {
      return next(new AppError('No doc found', 404));
    }
    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
