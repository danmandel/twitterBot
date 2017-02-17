const express = require('express');
const bodyParser = require('body-parser');

const quotes = require('./shared/quotes.js');
const misc = require('./shared/misc.js');
const twitterAPI = require('./shared/twitterAPI.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let port = process.env.PORT || 1337;
app.listen(port);
console.log(`listening on port: ${port}.`);

const tick = () => {
    const date = new Date();
    console.log('tick...', date);
    twitterAPI.handleDate(date);
};

const intervalId = setInterval(tick, 1000);

twitterAPI.watchStream('javascript');
