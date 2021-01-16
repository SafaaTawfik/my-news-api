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
    // creationdate: { type: Date },
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

// newsSchema.pre("save", async function (next) {
//   only change the date at the creation of the object
//   i put this condition to avoid change the creation date while updating
//   if (!this.creationdate) {
//     this.creationdate = new Date();
//     this.creationdate.setHours(this.creationdate.getHours() + 2);
//   }
//   next();
// });

const news = mongoose.model("News", newsSchema);
module.exports = news;
