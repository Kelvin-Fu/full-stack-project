(() => {
  const express = require("express");
  const util = require("../models/util.js");
  const homeController = express.Router();

  homeController.get("/", util.logRequest, async (req, res, next) => {
    res.redirect("/login");
  });

  homeController.get("/login", (request, response) => {
    response.redirect("/login.html");
  });
  homeController.get("/register", (request, response) => {
    response.redirect("/login.html");
  });

  module.exports = homeController;
})();
