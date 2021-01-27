const express = require("express");
const newsRouter = new express.Router();
const News = require("../models/news");
const auth = require("../middleware/auth");
const multer = require("multer");
const reporterRouter = require("./reporterRouter");

//get all news
newsRouter.get("/news", auth, (req, resp) => {
  News.find({})
    .then((allnews) => {
      resp.status(200).send(allnews);
    })
    .catch((e) => {
      resp.status(500).send("error");
    });
});

//Get report by ID
newsRouter.get("/news/:id", auth, (req, resp) => {
  const _id = req.params.id;
  News.findById(_id)
    .then((report) => {
      if (!report) {
        resp.status(400).send("unable to find report with this id");
      }
      resp.status(200).send(report);
    })
    .catch((error) => {
      console.log(error);
      resp.status(500).send(error);
    });
});

//update report by ID

newsRouter.put("/news/:id", auth, async (req, res) => {
  const updatesparam = Object.keys(req.body);
  const allowedupdates = ["tittle", "description"];
  const isvalid = updatesparam.every((updatename) =>
    allowedupdates.includes(updatename)
  );
  if (!isvalid) {
    return res.status(400).send("Cant be updated");
  }
  const _id = req.params.id;
  try {
    const article = await News.findById(_id);
    if (!article) {
      return res.send("No article is found with this id");
    }
    updatesparam.forEach((update) => {
      article[update] = req.body[update];
    });
    await article.save();
    res.status(200).send(article);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error has occurred");
  }
});

//Delete by ID
newsRouter.delete("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const article = await News.findByIdAndDelete(_id);
    if (!article) {
      return res.send("No article is found with this ID");
    }
    res.status(200).send(article);
  } catch (e) {
    res.status(400).send("Error has occurred");
  }
});

//Add new Article

newsRouter.post("/news/", auth, (req, resp) => {
  const newarticleparam = Object.keys(req.body);
  const allowedparams = ["tittle", "description"];
  const isvalid = newarticleparam.every((param) =>
    allowedparams.includes(param)
  );
  if (!isvalid) {
    return resp
      .status(400)
      .send(
        "There are Some invalid Params,please use tittle,description and auther only"
      );
  }
  const article = new News({
    ...req.body,
    owner: req.reporter._id,
  });
  article
    .save()
    .then(() => {
      resp.status(200).send(article);
    })
    .catch((error) => {
      resp.status(400).send(error);
    });
});

const uploads = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

reporterRouter.post(
  "/news/upload/:id",
  auth,
  uploads.single("image"),
  async (req, res) => {
    const _id = req.params.id;
    try {
      const article = await News.findById(_id);
      if (!article) {
        return res.send("No article is found with this id");
      }
      article.image = req.file.buffer;
      await article.save();
      res.status(200).send(article);
    } catch (e) {
      res.send(e);
    }
  }
);

module.exports = newsRouter;
