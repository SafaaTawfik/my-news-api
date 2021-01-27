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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Reporter",
    },
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: {
      currentTime: () => {
        var now = new Date();
        now.setHours(now.getHours() + 2);
        return now;
      },
    },
  }
);

const news = mongoose.model("News", newsSchema);
module.exports = news;
