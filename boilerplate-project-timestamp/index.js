// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// TO handle Parameters though the URL 


app.get("/api/:date?", (req, res) => {
  const inputDate = req.params.date;

  let date;

  if (!inputDate) {
    // No date provided - current date
    date = new Date();
  } else if (/^\d+$/.test(inputDate)) {
    // inputDate is all digits, treat as unix timestamp (number)
    date = new Date(Number(inputDate));
  } else {
    // otherwise parse normally
    date = new Date(inputDate);
  }

  if (isNaN(date.valueOf())) {
    return res.json({ error: "Invalid Date" });
  } else {
    return res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
