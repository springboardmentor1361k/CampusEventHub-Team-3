const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Registration = require("./models/Registration.js");
const User = require("./models/User.js");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    const regs = await Registration.find({}).populate("user_id", "name email college");
    console.log(JSON.stringify(regs, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
