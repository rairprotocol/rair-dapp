class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(hardcodedFilter) {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`,
    );
    if (!hardcodedFilter) {
      this.query = this.query.find(JSON.parse(queryStr));
    } else {
      this.query = this.query.find(hardcodedFilter);
    }
    return this;
  }

  sort(hardcodedSorting = '-createdAt') {
    if (this.queryString.sort && hardcodedSorting === '-createdAt') {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(hardcodedSorting);
    }
    return this;
  }

  limitFields(hardcodedProjection = '-__v') {
    if (this.queryString.fields && hardcodedProjection === '-__v') {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(hardcodedProjection);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit =
      this.queryString.limit === undefined ||
      Number(this.queryString.limit) > 100 ||
      Number(this.queryString.limit) <= 0
        ? 36
        : Number(this.queryString.limit);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
