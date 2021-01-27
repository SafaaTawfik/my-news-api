const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reporterSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can't contain word password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//the relation between the reporter and the news
reporterSchema.virtual("mynews", {
  ref: "news",
  localField: "_id",
  foreignField: "owner",
});
//used in login function
reporterSchema.statics.findByCredentials = async (email, password) => {
  const reporter = await Reporter.findOne({ email: email });
  console.log("reporter", reporter);
  if (!reporter) {
    throw new Error("Email is invalid");
  }
  const isvalidpass = await bcrypt.compare(password, reporter.password);
  if (!isvalidpass) {
    throw new Error("Password is invalid");
  }
  return reporter;
};

//hash the password before save into database
reporterSchema.pre("save", async function (next) {
  const reporter = this;
  if (reporter.isModified("password")) {
    reporter.password = await bcrypt.hash(reporter.password, 8);
  }
  next();
});

// Genrate token
reporterSchema.methods.generateToken = async function () {
  const reporter = this;
  const token = jwt.sign({ _id: reporter._id.toString() }, "news");
  reporter.tokens = reporter.tokens.concat({ token });
  await reporter.save();
  return token;
};

//delete passwoerd and token from the json object before return it in response
reporterSchema.methods.toJSON = function () {
  const reporterjsonobj = this.toObject();
  delete reporterjsonobj.tokens;
  delete reporterjsonobj.password;
  return reporterjsonobj;
};
const Reporter = mongoose.model("Reporter", reporterSchema);
module.exports = Reporter;
