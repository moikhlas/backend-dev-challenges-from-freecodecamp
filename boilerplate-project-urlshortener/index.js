require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// const dns = require('dns')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let all_urls = []

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const urlBody = req.body.url
  const rand_numID = Math.floor(Math.random() * (500 - 1 + 1)) + 1;

  if (urlBody.trim === "") {
    return res.redirect('http://localhost:3000/')
  }

  if (!urlBody.startsWith('https://') && !urlBody.startsWith('http://')) {
    return res.json({ error: 'invalid url' });
  }

  all_urls.push({ original_url: `${urlBody}`, short_url: rand_numID })

  res.json({ original_url: `${urlBody}`, short_url: rand_numID });
});

app.get('/api/shorturl', (req, res) => {
  res.json(all_urls)
})

app.get('/api/shorturl/:shortID', (req, res) => {
  const id = Number(req.params.shortID);

  const urlEntry = all_urls.find(url => url.short_url === id);

  let redirectUrl = urlEntry.original_url;

  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
    redirectUrl = 'http://' + redirectUrl;
  }

  res.redirect(redirectUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
