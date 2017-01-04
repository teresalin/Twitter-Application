/*
 * @module Twitter
 * This module contains 4 functions which need to be implemented. Each function
 * has comments defining the inputs and outputs of each function. Modify this
 * file as needed to complete the assignemtn howver DO NOT modify the function
 * signatures or the module.exports at the bottom of the file.
 */

var array = [];
var tweet_array = [];

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
app.use(morgan('dev'));
app.use(express.static('./client'));
app.use(bodyParser.text());

app.get('/users/:user', function(req, res, next) {
  var username = req.params.user;
  if (!contains(username)) {
    create(username);
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i].username === username) {
      var user_obj = array[i];
      break;
    }
  }

  res.status(200).json(user_obj);
});

app.post('/users/:user/follow', function(req, res) {
  var username = req.params.user;
  // The username of the user to follow is passed as text in the body.
  var followUsername = req.body;
  var success = follow(username, followUsername);
  res.send(success);
});

app.post('/users/:user/tweet', function(req, res, next) {
  var username = req.params.user;
  var content = req.body;
  var success = tweet(username, content);
  res.send(success);
});

app.post('/users/:user/favorite', function(req, res, next) {
  var username = req.params.user;
  var tweet_id = parseInt(req.body);
  var success = favorite(tweet_id);
  res.send(success);
});

app.post('/users/:user/retweet', function(req, res, next) {
  var username = req.params.user;
  var tweet_id = parseInt(req.body);
  var success = retweet(username, tweet_id);
  res.send(success);
});

app.listen(3000);

/* checks is a username exists int he array */
function contains(username) {
  if (array.length === 0) {
    return false;
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].username === username) {
      return true;
    }  
  }
  return false;
}

function exist(arr, username) {
  if (arr.length === 0) {
    return false;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].username === username) {
      return true;
    }  
  }
  return false;
}

function getIndex(arr, username) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].username === username) {
      return i;
    }  
  }
}

/* creates a username object and pushes to the array */
function create(username) {
  var obj = {username: username, followers: [], following: [], timeline: []};
  array.push(obj);
  return obj;
}

/* returns followers of a user */
function getFollowers(username) {
  if ((typeof (username) !== 'string')
        || (typeof (username) === 'undefined')
        || (typeof (username) === 'null')) {  
    return false;     
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].username === username) {
      return array[i].followers;
    }
  }
}

/* returns all the users a person is following */
function getFollowing(username) {
  if ((typeof (username) !== 'string')
        || (typeof (username) === 'undefined')
        || (typeof (username) === 'null')) {  
    return false;     
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].username === username) {
      return array[i].following;
    }
  }
}

/*
 * @function
 * @name timeline
 * The timeline function will return an array of tweets representing the
 * timeline for a given username. A timeline is comprised of two things, tweets
 * from other users the given user follows and tweets from the given user.
 *
 * @param {string} username The username of the user whose timeline to return.
 * @returns {{tweet:string, username:string}[]|false} Array of tweet objects
 * representing the timeline of the username. Alternatively, false will be
 * returned if the username is not a valid string.
 */
function timeline(username) {
  if ((typeof (username) !== 'string')
        || (typeof (username) === 'undefined')
        || (typeof (username) === 'null')
        || username.length === 0) {  
    return false;     
  }

  if (!contains(username)) {
    create(username);
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i].username === username) {
      return array[i].timeline;
    }
  }
}

/*
 * @function
 * @name follow
 * The follow function allows the followerUsername to receive future tweets
 * from username. There are a few caveats to how following works:
 *  - Only future tweets from followerUsername show up in username's timeline.
 *  - Requesting to follow the same user twice should return false.
 *  - Requesting to follow yourself should return false.
 *  - Non-string usernames should cause the function to return false.
 *
 * @param {string} followerUsername The user requesting to follow username.
 * @param {string} username The user being followed.
 * @returns {boolean} Returns true if successfully followed and false if not.
 */
function follow(followerUsername, username) 
{
  if (followerUsername === username 
    || typeof (username) !== 'string'
    || typeof (followerUsername) !== 'string'
    || username.length === 0
    || followerUsername.length === 0) {
    return false;
  }

  //if followerUsername doesn't exist, create it
  if (!contains(followerUsername)) {
    create(followerUsername);
    array[getIndex(array, followerUsername)].following.push(username);
  }
  else {
    var follower = array[getIndex(array, followerUsername)];
    if (exist(follower.following, username)) {
      return false;
    }
    follower.following.push(username);
  }

  //if username doesn't exist, create it, add follower and return true
  if (!contains(username)) {
    create(username);
    array[getIndex(array, username)].followers.push(followerUsername);
    return true;
  }

  var user = array[getIndex(array, username)];
  if (exist(user.followers, followerUsername)) {
    return false;
  }

  user.followers.push(followerUsername);
  return true;
}

/* @function
 * @name unfollow
 * The unfollow function is the inverse of {@link follow}. After unfollowing,
 * future tweets from username will not show up in followerUsername's
 * timeline. Just like {@link follow}, there are a few caveats.
 *  - Existing tweets from username on followerUsername's timeline are not
 *    removed.
 *  - Return false if followerUsername isn't following username.
 *  - Return false if followerUsername tries to unfollow themself.
 *  - Non-string usernames should cause the function to return false.
 *
 * @param {string} followerUsername The user requesting to follow username.
 * @param {string} username The user being followed.
 * @returns {boolean} Returns true if successfully unfollowed and false if not.
 */
function unfollow(followerUsername, username) 
{
  if (typeof (username) !== 'string' ||
    typeof (followerUsername) !== 'string' ||
    followerUsername === username ||
    followerUsername.length === 0 ||
    username.length === 0) {
    return false;
  }

  if (!contains(followerUsername)) {
    create(followerUsername);
  }

  //if username doesn't exist, create it 
  if (!contains(username)) {
    create(username);
  }

  //if username has no followers
  var user = array[getIndex(array, username)];
  var found = false;

  if (exist(user.followers, followerUsername)) {
    found = true;
    user.followers.splice(getIndex(user.followers, followerUsername), 1)
  }

  var follower = array[getIndex(array, followerUsername)];
  if (exist(follower.following, username)) {
    follower.following.splice(getIndex(follow.following, username), 1);
  }

  return found;
}

function tweetObj(id, tweet, username, retweet, favorites) {
  this.id = Math.floor(100000 + Math.random() * 900000);
  this.tweet = tweet;
  this.username = username;
  //this.date();
  this.retweet = retweet;
  this.favorites = favorites;
}

// tweetObj.prototype.date = function() {
//   var d = new Date();
//   var year = d.getUTCFullYear();
//   var month = ("0" + d.getUTCMonth()).slice(-2);
//   var day = ("0" + d.getUTCDay()).slice(-2);
//   var hour = ("0" + d.getUTCHours()).slice(-2);
//   var min = ("0" + d.getUTCMinutes()).slice(-2);
//   var sec = ("0" + d.getUTCSeconds()).slice(-2);
//   this.date = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
// };

/* adds a tweet object to the user and the user's followers */
function add_tweet(tweet_obj) {

  //var tweet_obj = new tweetObj(id, tweet, username, retweet, favorites);

  //add tweet to user
  for (var i = 0; i < array.length; i++) {
    if (array[i].username === tweet_obj.username) {
      array[i].timeline.unshift(tweet_obj);

      //if there's no follower
      if (array[i].followers.length === 0) {
        //do nothing
      }
      else {
        //loop through followers and add tweets
        for (var k = 0; k < array[i].followers.length; k++) {
          for (var j = 0; j < array.length; j++) {
            if (array[i].followers[k] === array[j].username) {
              array[j].timeline.unshift(tweet_obj);
            }
          }
        }
      }
    }
  }
}

/*
 * @function
 * @name tweet
 * This function will add a tweet for a given user. Tweeting will add a tweet
 * to each followers timeline, including the user doing the tweeting.
 *
 * @param {string} username The user tweeting.
 * @param {string} tweet The tweet content.
 * @returns {boolean} Returns true if both parameters are valid strings, false if not.
 */
function tweet(username, tweet) {
  if (typeof (username) !== 'string' ||
    typeof (tweet) === 'null' ||
    typeof (tweet) === 'undefined' ||
    tweet.length > 140 ||
    tweet.length === 0 ||
    username.length === 0 ||
    username.length > 140) {
    return false;
  }
  //if username doesn't exist, create it, add tweet, and return true
  if (!contains(username)) {
    create(username);
  }
  var tweet_obj = new tweetObj(0, tweet, username, false, 0);
  //id, tweet, username, date, retweet, favorites
  add_tweet(tweet_obj); 
  tweet_array.push(tweet_obj);
  return tweet_obj;
}

/*
 * @function
 * @name retweet
 * Retweeting allows followers to share another user's tweets with their own
 * followers.
 *
 * @param   {string} retweeter  The user performing the retweet.
 * @param   {number} tweet_id   The tweet ID being retweeted.
 * @returns {boolean}           True if successful, false if not successful.
 */
function retweet(retweeter, tweet_id) {
  if (typeof (retweeter) !== 'string' || 
  	typeof (retweeter) === 'null' || 
  	typeof (retweeter) === 'undefined' ||
  	typeof (tweet_id) === 'null' ||
  	typeof (tweet_id) === 'undefined') {
    return false;
  }

  //checks if retweeting own tweet
  for (var i = 0; i < array.length; i++) {
    if (array[i].username === retweeter) {
      for (var j = 0; j < array[i].timeline.length; j++) {
        if (array[i].timeline[j].id === tweet_id && array[i].timeline[j].retweet) {
          return false;
        }
      }
    }
  }

  //adds tweet to retweeter's timeline
  //return false if tweet_id does not exist
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].timeline.length; j++) {
      if (array[i].timeline[j].id === tweet_id) {
        var retweet_obj = new tweetObj(tweet_id, 
                        array[i].timeline[j].tweet, 
                        array[i].timeline[j].username, 
                        true, array[i].timeline[j].favorites);
        retweet_obj.id = tweet_id;
        //id, tweet, username, date, retweet, favorites
        add_tweet(retweet_obj);
        tweet_array.push(retweet_obj);
        return true;
      }
    }
  }
  return false;
}

/*
 * @function
 * @name favorite
 * Increments the favorite count of the tweet with the corresponding ID.
 *
 * @param   {number} tweet_id ID of tweet to favorite.
 * @returns {boolean}         True if successful, false if not successful.
 */
function favorite(tweet_id) {
  var found = false;
  for (var i = 0; i < tweet_array.length; i++) {
    if (tweet_array[i].id === tweet_id) {
      tweet_array[i].favorites++;
      found = true;
    }
  } 
  return found;
}