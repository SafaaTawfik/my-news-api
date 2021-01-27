const express = require("express");
const { aggregate } = require("../models/reporter");
const Reporter = require("../models/reporter");
const reporterRouter = new express.Router();
const auth = require("../middleware/auth");

//Add new Reporter // signup
reporterRouter.post("/reporters", async (req, res) => {
  const reporter = new Reporter(req.body);
  try {
    await reporter.save();
    const token = await reporter.generateToken();
    res.status(200).send({ reporter, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Get all reporters
reporterRouter.get("/reporters", (req, res) => {
  Reporter.find({})
    .then((reporter) => {
      res.status(200).send(reporter);
    })
    .catch((e) => {
      res.status(500).send("Inetrnal server error");
    });
});

//login
reporterRouter.post("/login", async (req, res) => {
  try {
    const reporter = await Reporter.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await reporter.generateToken();
    res.status(200).send({ reporter, token });
  } catch (e) {
    console.log(e);
    res.status(400).send("Invalid Email or Password");
  }
});

//Logout
reporterRouter.post("/logout", auth, async (req, res) => {
  try {
    console.log("logout");
    console.log(req.token);
    req.reporter.tokens = req.reporter.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.reporter.save();
    res.send("Logout successfully");
  } catch (e) {
    res.status(500).send("please log in");
  }
});

//logout
reporterRouter.post("/logoutAll", auth, async (req, res) => {
  try {
    req.reporter.tokens = [];
    await req.reporter.save();
    res.send("Logout all was done successfully");
  } catch (e) {
    res.status(500).send("Please login");
  }
});

module.exports = reporterRouter;
