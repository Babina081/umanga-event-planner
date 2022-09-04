class ApiFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  //function for searching
  search() {
    //ternary operation used
    const keyword = this.queryStr.keyword
      ? {
          name: {
            //mongodb operator
            $regex: this.queryStr.keyword,

            //case sensitive
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  //function for filtering
  filter() {
    //spread operator
    const queryCopy = { ...this.queryStr };

    //Removing some fields for category
    const removeFields = ['keyword', 'page', 'limit'];

    removeFields.forEach((key) => delete queryCopy[key]);

    //filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //function for pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

//exporting ApiFeatures
module.exports = ApiFeatures;
