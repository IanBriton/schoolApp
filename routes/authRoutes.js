const { Router } = require("express");
const authControllers = require("../controller/authController");

const route = Router();

//Routes for logging in and signing up
route.get("/login", authControllers.login_get);
route.get("/signup", authControllers.signup_get);
route.post("/signup", authControllers.signup_post);
route.post("/login", authControllers.login_post);
route.get("/logout", authControllers.logout_get);

module.exports = route;
