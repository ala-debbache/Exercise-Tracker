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

mongoose.connect("mongodb+srv://ala:maradona2018@exercises.axzra.mongodb.net/exercises?retryWrites=true&w=majority");

const { Schema } = mongoose;


const userSchema = new Schema({
  username: String
});

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: String
});

const User = mongoose.model("User",userSchema);
const Exercise = mongoose.model("Exercise",exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users",async (req,res)=>{
  let username = req.body.username;
  try {
    let user = User({username: username});
    await user.save();
    res.json({username: user.username, _id: user.id});
  } catch {
    res.status(401).json({error: "server or database error"});
  }
});

app.get("/api/users",async (req,res)=>{
  try {
    const all = await User.find({});
    res.json(all);
  } catch {
    res.status(401).json({error: "server or database error"});
  }
});

app.post("/api/users/:_id/exercises",async (req,res)=>{
  let description = req.body.description;
  let duration = req.body.duration;
  let date = "";
  if(req.body.date){
    date = new Date(req.body.date).toDateString();
  }else{
    date = new Date().toDateString();
  }
  try {
    const user = await User.findOne({_id: req.params._id});
    let exercise = new Exercise({
      username: user.username,
      description: description,
      duration: duration,
      date: date
    });
    await exercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: description,
      duration: duration,
      date: date
    });
  } catch {
    res.status(401).json({error: "server or database error"});
  }
});

app.get("/api/users/:id/logs",async (req,res)=>{
  try {
    let user = await User.findOne({_id: req.params.id});
    let exercises = await Exercise.find({username: user.username});
    let logs = exercises.map(e=>{
      return {
        description: e.description,
        duration: e.duration,
        date: e.date
      }
    });
    res.json({
      username: user.username,
      _id: req.params.id,
      count: exercises.length,
      log: [logs]
    });
  } catch {
    res.status(401).json({error: "server or database error"});
  }
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

