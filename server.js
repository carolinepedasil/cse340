const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);
app.use(flash());

const utilities = require("./utilities");
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch {
    res.locals.nav = "";
  }
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors" });
});

const inventoryRoute = require("./routes/inventoryRoute");
app.use("/inv", inventoryRoute);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const title = status === 404 ? "Page Not Found" : "Server Error";
  if (status >= 500) console.error(err);

  const nav = (typeof require("./utilities").getNav === "function")
    ? require("./utilities").getNav()
    : Promise.resolve("");

  Promise.resolve(nav).then((n) => {
    res.status(status).render("errors/error", {
      title,
      nav: n || "",
      message: err.message || "An unexpected error occurred.",
      status
    });
  }).catch(() => {
    res.status(status).send(`${status} - ${title}`);
  });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app listening on  ${port}`)
})
