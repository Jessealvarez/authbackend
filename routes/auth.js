var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");
const { blogsDB } = require("../mongo");

const createUser = async (username, passwordHash) => {
  try {
    const collection = await blogsDB().collection("users");
    const user = {
      username: username,
      password: passwordHash,
      uid: uuid(),
    };

    //save user functionality
    await collection.insertOne(user);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

router.post("/register-user", async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const userSaveSuccess = await createUser(username, hash);
    res.json({ success: userSaveSuccess });
  } catch (e) {
    res.json({ success: false });
  }
});

router.post("/login-user", async function (req, res) {
  //Add mongodb code to fetch a user from the database where the username matches the incoming username from req.body
  try {
    const collection = await blogsDB().collection("users");

    const user = await collection.findOne({
      username: req.body.username,
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    res.json({ success: match });
  } catch (e) {
    res.json({ success: false });
  }
});
module.exports = router;
