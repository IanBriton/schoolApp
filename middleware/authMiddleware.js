const jwt = require("jsonwebtoken");
const User = require("../model/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //Check if the cookie exists first
  if (token) {
    jwt.verify(token, "dan the upcoming hacker", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

//Check the current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "dan the upcoming hacker", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
