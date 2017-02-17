const Twit = require('twit');
const fs = require('fs');
const misc = require('./misc');
const quotes = require('./quotes');
const secrets = require('./secrets.js')
const twitterAPI = {};
module.exports = twitterAPI;

const T = new Twit({
    consumer_key: secrets.consumer_key,
    consumer_secret: secrets.consumer_secret,
    access_token: secrets.access_token,
    access_token_secret: secrets.access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

twitterAPI.handleDate = date => {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const milli = date.getMilliseconds();
    if (minutes % 30 === 0 && seconds === 0) {
        const quoteArr = misc.getRandomElement(quotes);
        const quote = quoteArr[0].substring(0, 120);
        const author = quoteArr[1];
        const authorFirstName = author.split(' ')[0];
        const authorLastName = author.split(' ')[1];
        const tweet = `${quote} #${authorFirstName} #${authorLastName}`;
        console.log('sending tweet..', tweet);
        twitterAPI.sendTweet(tweet);
    }
};

twitterAPI.sendTweet = (status, mentions, tags) => {
    let tweet = {};
    tweet.status = status || 'is this thing on? #twitter';
    T.post('statuses/update', tweet, (err, data, response) => {
        console.log(data);
        if (err) console.log(err);
    });
};

twitterAPI.retweet = postId => {
    T.post('statuses/retweet/:id', { id: postId }, (err, data, response) => {
        console.log(data)
        if (err) console.log(err);
    });
};

twitterAPI.watchStream = hashtag => {
    const retweetThreshold = .97;
    console.log(`Watching for ${hashtag} and retweeting ${1 - retweetThreshold}% of tweets..`)
    const stream = T.stream('statuses/filter', { track: hashtag || 'economy' });
    stream.on('tweet', tweet => {
        if (Math.random() > 0.97) {
            twitterAPI.retweet(tweet.id_str);
        }
    });
};



