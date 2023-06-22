const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userName:{
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
    unique: true,
  },email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;