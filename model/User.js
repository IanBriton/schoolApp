const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    unique: [true, "Username taken"],
    lowercase: true,
    minlength: [5, "Minimum length for a name is 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exist"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    validate: [
      isStrongPassword,
      "Password must be 8 characters long, must be a combination of letters, numbers, and special characters such as @,_!",
    ],
  },
});

//Mongoose Hooks
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Creating a static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect Email");
};

const user = mongoose.model("user", userSchema);

module.exports = user;
