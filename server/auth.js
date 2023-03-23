const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

// This will help us connect to the database
const dbo = require("./db/conn");

app.use(bodyParser.json());

app.post('/login', async (req, res) => {

  let db_connect = dbo.getDb();

  const { username, password } = req.body;

  // Find the user in the database
  const user = await db_connect.collection("label").findOne({ username });
  // If the user doesn't exist, sign up
  if (!user) {
    let data = {
      username: username,
      password: password,
      labels: [],
    }
    await db_connect.collection("label").insertOne(data);
    
    console.log("New account created");
    res.json({ success: true });
    return;
  }

  // Verify the password
  const salt = await bcrypt.genSalt(15)
  const newHashedPassword = await bcrypt.hash(user.password, salt)
  const passwordMatch = await bcrypt.compare(password, newHashedPassword);
  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({ success: true });
});

module.exports = app;
