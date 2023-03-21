const User = require("../model/User");
const jwt = require("jsonwebtoken");

//Handling errors
const handleError = (err) => {
  const errors = {
    name: "",
    email: "",
    password: "",
  };

  //Incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "Email not registered";
  }

  //Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "Incorrect password";
  }
  if (err.code === 11000) {
    if (err.keyPattern.name) {
      errors.name = "Username already registered";
      return errors;
    }
    if (err.keyPattern.email) {
      errors.email = "Email already registered";
      return errors;
    }
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "dan the upcoming hacker", { expiresIn: maxAge });
};

//Defining different routes
const signup_get = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

const login_get = (req, res) => {
  res.render("login", { title: "Login" });
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
};
