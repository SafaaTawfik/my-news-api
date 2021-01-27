require("./db/mongoose");
const express = require("express");
const newsRouter = require("./routers/newsRouter");
const reporterRouter = require("./routers/reporterRouter");
const News = require("./models/news");
const Reporter = require("./models/reporter");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  next();
});
app.use(newsRouter);
app.use(reporterRouter);
app.listen(3000, () => console.log("Server is running"));
