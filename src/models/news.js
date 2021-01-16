const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema(
  {
    tittle: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    auther: { type: String, required: true },
    creationdate: {
      type: Date,
      default: () => {
        var now = new Date();
        now.setHours(now.getHours() + 2);
        return now;
      },
    },
  }
  // {
  //   timestamps: {
  //     currentTime: () => {
  //       var now = new Date();
  //       now.setHours(now.getHours() + 2);
  //       return now;
  //     },
  //   },
  //}
);

const news = mongoose.model("News", newsSchema);
module.exports = news;
