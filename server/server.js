(() => {
  const config = require(`${__dirname}/config/config`);
  const homeController = require(`${__dirname}/../controllers/homeController`);
  const memberController = require(`${__dirname}/../controllers/memberController`);
  const session = require("express-session");
  const express = require("express");
  const app = express();

  app.use(
    session({
      secret: "pineappleTree",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(homeController);
  app.use(memberController);
  app.use(express.static(config.ROOT, { index: "login.html" }));
  app.get("*", (req, res) => {
    res.status(404).send("Eror 404: Page Not found");
  });

  app.listen(config.PORT, "localhost", () => {
    console.log(`\t|app listening on ${config.PORT}`);
  });
})();
