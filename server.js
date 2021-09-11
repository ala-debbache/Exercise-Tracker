const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

mongoose.connect("mongodb+srv://ala:maradona@exercises.axzra.mongodb.net/exercises?retryWrites=true&w=majority");

const { Schema } = mongoose;
const userSchema = new Schema({
  username: String
});

const User = mongoose.model("User",userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users",async (req,res)=>{
  let username = req.body.username;
  try {
    let user = User({username: username});
    await user.save();
    console.log(user);
    res.json(user);
  } catch {
    res.status(401).json({error: "server or database error"});
  }
  
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

