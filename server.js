if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT;
const session = require("express-session");
const mongoose = require("mongoose");
const url = process.env.URL;
const passport = require("passport");
const flash = require("express-flash");
const LocalStrategy = require("passport-local").Strategy;
const localUser = require("./src/models/localuser");
const bcrypt = require("bcrypt");
const path = require("path");
const { sleep } = require("./src/functions/functions");
var favicon = require("serve-favicon");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("ws");
const wss = new Server({
  server: server,
});
const { Api } = require("./load");

app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
// import the passport module
// import the config module
//connect to database

app.set("views", path.join(__dirname, "src/views"));

const api = new Api({}, "", server.app);
api.start();

require("./src/functions/passport-discord");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const users = [];

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// set up flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use("/favicon.ico", express.static("src/public/images/favicon.ico"));
app.use(express.static(path.join(__dirname, "src/public")));
const webRoutes = require("./src/routes/web");
app.use("/", webRoutes);

//const authRoutes = require('./src/routes/auth');
//app.use('/api/v1/auth', authRoutes);

const dashboardRoutes = require("./src/routes/dashboard");
app.use("/dashboard", dashboardRoutes);

const loginRoutes = require("./src/routes/login");

app.use("/login", loginRoutes);

wss.on("connection", ws => {
  ws.on("message", message => {
    console.log("Received Message" + message);
  });
});

app.listen(port, () => {
  if (process.env.DEV) {
    console.log("Server Started");
  }
});

app.all("/api/v1/*", (req, res) => {
  var method = req.method.toUpperCase();
  api.handler(req, res, method);
});

module.exports = {
  app: app,
  api: api,
};
