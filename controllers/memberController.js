(() => {
  const util = require("../models/util.js");
  const config = require("../server/config/config");
  const postEvent = require("../models/postEvent");
  const postCheckList = require("../models/postCheckList");
  const client = util.getMongoClient(); // (false) for non local database
  const user = require(`${__dirname}/../models/user.js`);
  const bcrypt = require("bcrypt");
  const session = require("express-session");
  const express = require("express");
  const memberController = express.Router();
  const axios = require("axios");

  const getJSONData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log("\t|Something went wrong while fetching JSON data!");
    }
  };
  //Handle index authentication
  //Check session, if authenticate go next
  memberController.get("/index.html", util.logRequest, async (req, res, next) => {
    console.info("Inside index.html");
    const userId = req.session.userId;
    console.log("Inside member controller get index");
    if (req.session.role == "admin") {
      res.redirect("/admin.html");
    }
    if (userId) {
      // console.log("User authenticated!!!");
      next();
    } else {
      // console.log("User is not authenticated!!");
      res.redirect("/login");
    }
  });
  memberController.get("/admin.html", util.logRequest, async (req, res, next) => {
    console.info("Inside index.html");
    const userId = req.session.userId;

    if (userId && req.session.role == "admin") {
      // console.log("User authenticated!!!");
      next();
    } else {
      // console.log("User is not authenticated!!");
      res.redirect("/login");
    }
  });

  memberController.get("/calendar.html", util.logRequest, async (req, res, next) => {
    console.info("Inside calendar.html");
    const userId = req.session.userId;
    console.log("Inside member controller get index");

    if (userId) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  memberController.get("/finance.html", util.logRequest, async (req, res, next) => {
    console.info("Inside finance.html");
    const userId = req.session.userId;
    console.log("Inside member controller get index");

    if (userId) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  //Handle signin request
  //Check DB if password match
  //Yes: send success msg
  //No: send error msg
  memberController.post("/signin", util.logRequest, async (req, res) => {
    console.log("\t|Inside signin");
    const { email, password } = req.body;

    //Specify db collention
    let collection = client.db().collection("Users");
    //Find if email exists in db
    let member = await util.find(collection, { email });
    if (member.length === 0) {
      res.status(200).json({ error: { email: email, message: "Incorrect email address. Please try again" } });
    } else {
      //check password
      const passwordMatch = await bcrypt.compare(password, member[0].hashedPassword);
      if (!passwordMatch) {
        res.status(200).json({ error: { email: email, message: "The password you entered is incorrect. Please try again" } });
      } else {
        const userId = member[0]._id.toString();
        req.session.userId = userId;

        req.session.role = member[0].role;
        res.status(200).json({ success: { email: email, message: "Log in successful" } });
      }
    }
  });

  memberController.post("/guestSignin", util.logRequest, async (req, res) => {
    console.log("\t|Inside guest signin");
    const { email, password } = req.body;

    //Specify db collention
    let collection = client.db().collection("Users");
    console.log(email);
    //Find if email exists in db
    let member = await util.find(collection, { email });
    if (member.length === 0) {
      res.status(200).json({ error: { email: email, message: "Incorrect email address. Please try again" } });
    } else {
      //check password
      const passwordMatch = await bcrypt.compare(password, member[0].hashedPassword);
      console.log(passwordMatch);
      if (!passwordMatch) {
        res.status(200).json({ error: { email: email, message: "The password you entered is incorrect. Please try again" } });
      } else {
        const userId = member[0]._id.toString();
        req.session.userId = userId;
        req.session.role = member[0].role;
        res.status(200).json({ success: { email: email, message: "Log in successful" } });
      }
    }
  });

  memberController.post("/signup", util.logRequest, async (req, res) => {
    console.log("\t|Inside signup");
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
    const member = user(email, hashedPassword);

    //Specify db collention
    let collection = client.db().collection("Users");
    //Find if email exists in db
    let checkUser = await util.find(collection, { email });
    if (checkUser.length === 0) {
      await util.insertOne(collection, member);
      let user = await util.find(collection, { email });
      const userId = user[0]._id.toString();
      req.session.userId = userId;
      req.session.role = user[0].role;
      res.status(200).json({ success: { email: email, message: "Register successful" } });
    } else {
      res.status(200).json({ error: { email: email, message: "Email already registered. Please try again" } });
    }
  });

  memberController.get("/logOut", (req, res) => {
    // Clear the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.status(200).json({ success: "Logout successful" });
      }
    });
  });

  memberController.post("/createEvent", util.logRequest, async (req, res) => {
    console.log("\t|Inside createEvent");
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      const userId = req.session.userId;

      //Specify db collention
      let collection = client.db().collection(userId);
      console.log(req.body);
      let eventTopic = req.body.eventTitle;
      let eventDate = req.body.eventDate;
      let category = "calendarEvent";
      let post = postEvent(eventTopic, category, user, eventDate);

      if (eventTopic.length > 0 && eventTopic.length < 20) {
        util.insertOne(collection, post);
        res.status(200).json({ success: { message: "Save successful" } });
      } else {
        res.status(200).json({ error: { message: "Topic must have a length between 1-20charcaters. Please try again" } });
      }
    }
  });

  memberController.get("/calendar", util.logRequest, async (req, res, next) => {
    if (req.session.role != "guest") {
      if (req.session.userId) {
        let collection = client.db().collection(req.session.userId);
        let posts = await util.find(collection, { Category: "calendarEvent" });
        res.status(200).json(posts);
      } else {
        console.log("failed to get events");
        res.status(200).json({ error: { message: "failed to get events" } });
      }
    }
  });

  memberController.post("/createCheckList", util.logRequest, async (req, res) => {
    console.log("\t|Inside createCheckList");
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      const userId = req.session.userId;

      //Specify db collention
      let collection = client.db().collection(userId);
      //console.log(req.body);
      let checkListItems = req.body.checkListItems;
      let checkBoxesStatus = req.body.checkBoxesStatus;
      let category = "checkList";

      let post = postCheckList(checkListItems, checkBoxesStatus, category, user);

      try {
        util.deleteMany(collection, { Category: "checkList" });
        util.insertOne(collection, post);
        res.status(200).json({ success: { message: "Save successful" } });
      } catch (e) {
        res.status(200).json({ error: { message: e } });
      }
    }
  });

  memberController.get("/checkList", util.logRequest, async (req, res, next) => {
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      if (req.session.userId) {
        let collection = client.db().collection(req.session.userId);
        let posts = await util.find(collection, { Category: "checkList" });
        res.status(200).json(posts);
      } else {
        console.log("failed to get events");
        res.status(200).json({ error: { message: "failed to get events" } });
      }
    }
  });

  memberController.post("/createNotes", util.logRequest, async (req, res) => {
    console.log("\t|Inside createNotes");
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      const userId = req.session.userId;

      //Specify db collention
      let collection = client.db().collection(userId);
      //console.log(req.body);
      let note = req.body.note;
      let category = "notes";

      let post = {
        Category: category,
        "Posted By": userId,
        note,
        postedAt: new Date().getUTCDate(),
      };

      try {
        util.deleteMany(collection, { Category: "notes" });
        util.insertOne(collection, post);
        res.status(200).json({ success: { message: "Save successful" } });
      } catch (e) {
        res.status(200).json({ error: { message: e } });
      }
    }
  });

  memberController.get("/notes", util.logRequest, async (req, res, next) => {
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      if (req.session.userId) {
        let collection = client.db().collection(req.session.userId);
        let posts = await util.find(collection, { Category: "notes" });
        res.status(200).json(posts);
      } else {
        console.log("failed to get events");
        res.status(200).json({ error: { message: "failed to get notes" } });
      }
    }
  });

  memberController.get("/weatherInfo", util.logRequest, async (req, res, next) => {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const urlWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${config.API_WEATHER}`;
      const data = await getJSONData(urlWeather);
      res.status(200).json(data);
    } catch (e) {
      console.log("failed to get events");
      res.status(200).json({ error: { message: "failed to get notes" } });
    }
  });

  memberController.post("/createBudget", util.logRequest, async (req, res) => {
    console.log("\t|Inside createBudget");
    if (req.session.role == "guest") {
      res.status(200).json({ error: { message: "failed to get events" } });
    }
    if (req.session.role != "guest") {
      const userId = req.session.userId;

      //Specify db collention
      let collection = client.db().collection(userId);
      //console.log(req.body);
      let description = req.body.description;
      let transType = req.body.transType;
      let date = req.body.date;
      let category = "budget";
      let amount = req.body.amount;

      let post = {
        Category: category,
        "Posted By": userId,
        description,
        transType,
        amount,
        date,
        postedAt: new Date().getUTCDate(),
      };

      if (date != "" && description != "" && amount != "") {
        util.insertOne(collection, post);
        res.status(200).json({ success: { message: "Save successful" } });
      } else {
        res.status(200).json({ error: { message: e } });
      }
    }
  });

  memberController.get("/budget", util.logRequest, async (req, res, next) => {
    if (req.session.role != "guest") {
      if (req.session.userId) {
        let collection = client.db().collection(req.session.userId);
        let posts = await util.find(collection, { Category: "budget" });
        res.status(200).json(posts);
      } else {
        console.log("failed to get events");
        res.status(200).json({ error: { message: "failed to get notes" } });
      }
    }
  });

  memberController.get("/admin", util.logRequest, async (req, res, next) => {
    if (req.session.role == "admin") {
      if (req.session.userId) {
        let collection = client.db().collection("Users");
        let posts = await util.find(collection, { role: "member" });
        res.status(200).json(posts);
      } else {
        console.log("failed to get events");
        res.status(200).json({ error: { message: "failed to get events" } });
      }
    }
  });

  memberController.post("/deleteUser", util.logRequest, async (req, res) => {
    console.log("\t|Inside deleteUser");
    if (req.session.role == "admin") {
      const userId = req.session.userId;

      //Specify db collention
      let collection = client.db().collection(userId);
      let userCollection = client.db().collection("Users");
      //console.log(req.body);
      let email = req.body.email;

      try {
        util.deleteMany(collection, { _id: userId });
        util.deleteMany(userCollection, { email });
        res.status(200).json({ success: { message: "delete successful" } });
      } catch (e) {
        res.status(200).json({ error: { message: e } });
      }
    }
  });

  module.exports = memberController;
})();
