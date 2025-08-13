const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const crypto = require('crypto');
const { count } = require('console');

// Function use to genarate randome ID's using the crypto modual 

function generateHexId() {
  return crypto.randomBytes(12).toString('hex'); // 12 bytes → 24 hex chars
}

// Destructure and get form data 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Holds all the users 
let users = [];
//add count

// Handle adding user to users 
app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const id = generateHexId()
  users.push({ username: `${username}`, _id: `${id}`, log: [] })

  res.json({ username: username, _id: id });

})

// Is used to allow user to see all the users 
app.get('/api/users', (req, res) => {
  let filteredUsers = [];
  users.forEach(user => {
    filteredUsers.push({ username: user.username, _id: user._id })
  })
  res.send(filteredUsers)
})

//Handle adding exerciises to the corect user 
app.post('/api/users/:_id/exercises', (req, res) => {
  const description = req.body.description;
  const id = req.params._id;
  const duration = req.body.duration;
  const date = req.body.date;

  //Find index of the requsted item
  let userIndex = users.findIndex(user => user._id === id)

  //validates it
  if (userIndex === -1) {
    return res.json({ "Status": "404: username not found" })
  }

  //makes sure if description and durations are provided 
  if (!description || !duration) {
    return res.json({ "Status": "403: provide discription and/or duration" })
  }

  //creating a date object
  const exerciseDate = date ? new Date(date) : new Date();

  //adding new exercise to the log object of the respetive user 
  users[userIndex].log.push({
    description,
    duration: Number(duration),
    date: exerciseDate.toDateString()
  });

  //returning a json responce 
  res.json({
    _id: users[userIndex]._id,
    username: users[userIndex].username,
    date: exerciseDate.toDateString(),
    description,
    duration: Number(duration)
  });
})

// allows user to check for users log: list of all exercises
app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  const { _id } = req.params;

  const user = users.find(user => user._id === _id);

  if (!user) {
    return res.json({ "Status": "404: username not found" });
  }

  // If there are no query parameters, return all logs.
  if (!from && !to && !limit) {
    return res.json({
      _id: user._id,
      username: user.username,
      count: user.log.length,
      log: user.log
    });
  }

  // If there are query parameters, filter the logs.
  let logs = [...user.log];

  if (from) {
    const fromDate = new Date(from);
    logs = logs.filter(l => new Date(l.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    logs = logs.filter(l => new Date(l.date) <= toDate);
  }

  if (limit) {
    logs = logs.slice(0, Number(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs
  });
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
