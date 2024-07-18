import { Query } from "mongoose";
import { IAPIFeatures } from "../Interfaces/utils/utils.interfaces";

class APIFeatures implements IAPIFeatures {
  constructor(
    query: Query<any, any>,
    queryString: { [index: string]: string }
  ) {
    this.query = query;
    this.queryString = queryString;
  }
  query: Query<any, any, {}, any>;
  queryString: { [index: string]: string };

  filter() {
    const queryObj: { [index: string]: any } = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (queryObj.rating === "valid") {
      queryObj.rating = { $exists: true, $ne: null };
    }

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) * 1 || 1;
    const limit = parseInt(this.queryString.limit) * 1 || 10000;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default APIFeatures;
