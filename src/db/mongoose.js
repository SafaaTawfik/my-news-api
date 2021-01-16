const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/";
const dbName = "news-api";

//create connection
mongoose.connect(url + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
