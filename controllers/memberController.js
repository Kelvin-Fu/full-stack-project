(() => {
  const util = require("../models/util.js");
  const config = require("../server/config/config");
  //const Post = require("../models/post"); //要Post的資料Object
  const client = util.getMongoClient(); // (false) for non local database
  const user = require(`${__dirname}/../models/user.js`);
  const bcrypt = require("bcrypt");
  const session = require("express-session");
  const express = require("express");
  const memberController = express.Router();

  //logRequest會連接到db然後儲存資料到Request

  //Handle index authentication
  //Check session, if authenticate go next
  memberController.get("/index.html", util.logRequest, async (req, res, next) => {
    console.info("Inside index.html");
    const userId = req.session.userId;
    console.log("Inside member controller get index");

    if (userId) {
      //console.log("User authenticated!!!");
      next();
    } else {
      //console.log("User is not authenticated!!");
      res.redirect("/login");
    }
  });

  //用戶連接到/member時post資料到db
  memberController.get("/member", util.logRequest, async (req, res, next) => {
    console.info("Inside member.html");
    let collection = client.db().collection("Posts");
    let post = Post("Security", "AAA is a key concept in security", "Pentester");
    util.insertOne(collection, post);
    res.sendFile("member.html", { root: config.ROOT });
  });

  //連接到db然後儲存資料到Request
  //查看Collection Post內data
  //Response data
  //用於到POST一頁時更新資料
  memberController.get("/posts", util.logRequest, async (req, res, next) => {
    let collection = client.db().collection("Posts");
    let posts = await util.find(collection, {});
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts);
  });

  //按button 到PostMsg頁
  memberController.get("/postMessage", util.logRequest, async (req, res, next) => {
    res.sendFile("postMessage.html", { root: config.ROOT });
  });

  //建立Post
  //讀table post資料, 儲存到db
  memberController.post("/addPost", util.logRequest, async (req, res, next) => {
    let collection = client.db().collection("Posts");
    console.log(req.body);
    let topic = req.body.topic;
    let message = req.body.message;
    let user = req.body.postedBy;
    let post = Post(topic, message, user); //wont work
    util.insertOne(collection, post);

    // res.json(
    //     {
    //         message: `You post was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/posts.json', JSON.stringify(posts))
    //res.status(200);

    res.redirect("/posts.html");
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
      util.insertOne(collection, member);
      const userId = checkUser[0]._id.toString();
      req.session.userId = userId;
      res.status(200).json({ success: { email: email, message: "Register successful" } });
    } else {
      res.status(200).json({ error: { email: email, message: "Email already registered. Please try again" } });
    }
  });

  module.exports = memberController;
})();
