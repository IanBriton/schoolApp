const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

//Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

//Setting the database
const dbURI =
  "mongodb+srv://Dantez:123Dan45@cluster0.kfxupxp.mongodb.net/school";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then((res) => app.listen(3000))
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("index", { title: "Home" }));
app.get("/donate", requireAuth, (req, res) =>
  res.render("donate", { title: "Donate" })
);

app.use(authRoutes);

app.use((req, res) => {
  res.status(400).render("404", { title: "404" });
});
