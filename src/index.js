const express = require("express");
const newsRouter = require("./routers/newsRouter");
require("./db/mongoose");
const News = require("./models/news");

const port = 3000;
const app = express();
app.use(express.json());
app.use(newsRouter);

// const news = new News({
//   tittle: "news 1",
//   description: "hello news api ",
//   auther: "safaa",
// });
// news
//   .save()
//   .then(() => {
//     console.log("news created successful");
//   })
//   .catch((error) => {
//     console.log(error);
//   });
const news_api = app.listen(port, () => {
  console.log("Connection Successed");
});
