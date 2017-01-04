
window.addEventListener('load', function() {
  var following_list = document.querySelector('#following-list');
  var follower_list = document.querySelector('#follower-list');
  following_list.addEventListener('click', switchClicked);
  follower_list.addEventListener('click', switchClicked);
});

function removeAll(list) {
  while (list.hasChildNodes()) {
    list.removeChild(list.childNodes[0]);
  }
}

function updateFollow(list, selector) {
  for (var i = 0; i < list.length; i++) {
    var ul = document.getElementById(selector);
    var li = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#';
    link.innerText = list[i];
    li.appendChild(link);
    ul.appendChild(li);
  }
}

function followClicked() {
  var req = new XMLHttpRequest();
  var userToFollow = document.getElementById("follow-input").value;
  var current_user = document.getElementById("current-user-header").innerHTML;
  req.open('POST', '/users/' + current_user + '/follow', true);
  req.addEventListener('load', function() {
    var ul = document.getElementById("following-list");
    var li = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#';
    link.innerText = userToFollow;
    li.appendChild(link);
    ul.appendChild(li);
  });
  document.getElementById("follow-input").value = "";
  req.send(userToFollow);
  console.log(req.responseText);
}

function goBack() {
  window.history.back();
}

function goForward() {
  window.history.forward();
}

function favoriteClicked(e) {
  var req = new XMLHttpRequest();
  var div = e.target.parentNode.parentNode.previousSibling;
  var current_user = document.getElementById("current-user-header").innerHTML;
  req.open('POST', '/users/' + current_user + '/favorite', true);
  var tweet_id = $(div).data("tweet_id");
  req.send(tweet_id);
}

function retweetClicked(e) {
  var req = new XMLHttpRequest();
  var div = e.target.parentNode.parentNode.previousSibling;
  var current_user = document.getElementById("current-user-header").innerHTML;
  req.open('POST', '/users/' + current_user + '/retweet', true);
  var tweet_id = $(div).data("tweet_id");
  console.log("tweet id: " + tweet_id);
  console.log(req.responseText);
  req.send(tweet_id);
}

function tweetClicked() {
  var req = new XMLHttpRequest();
  var button = document.getElementById("tweet-button");
  var current_user = document.getElementById("current-user-header").innerHTML;
  var tweet_content = document.getElementById("tweet-input").value;
  req.open('POST', '/users/' + current_user + '/tweet', true);
  req.addEventListener('load', function() {
    var ul = document.getElementById("tweet-list");
    var li = document.createElement('li');
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');

    var link = document.createElement('a');
    var link2 = document.createElement('a');

    var span = document.createElement('span');

    var div = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');

    p1.setAttribute("class", "tweet-content");
    p2.setAttribute("class", "tweet-username");

    link.setAttribute("class", "favorite-link");
    link2.setAttribute("class", "retweet-link");

    span.setAttribute("class", "favorite-count");

    div.setAttribute("class", "row");
    div2.setAttribute("class", "col-md-2");
    div3.setAttribute("class", "col-md-3");

    li.setAttribute("class", "list-group-item tweet");

    link.href = '#';
    link.innerHTML = "Favorite ";
    link.addEventListener('click', favoriteClicked);
    link2.href = '#';
    link2.innerHTML = "Retweet";
    link2.addEventListener('click', retweetClicked);
    span.innerHTML = 0;

    div2.appendChild(link);
    div2.appendChild(span);
    div3.appendChild(link2);

    p1.appendChild(document.createTextNode(tweet_content));
    p2.appendChild(document.createTextNode(current_user));

    div.appendChild(div2);
    div.appendChild(div3);

    li.appendChild(p2);
    li.appendChild(p1);
    li.appendChild(div);
    ul.insertBefore(li, ul.childNodes[0]);
  });
  document.getElementById("tweet-input").value = "";
  req.send(tweet_content);
  //console.log(tweet_content);
  console.log(req.responseText);
}

function switchClicked(e) {
  var req = new XMLHttpRequest();
  var switchUsername;
  if (document.getElementById("switch-user-input").value === "") {
    switchUsername = e.target.textContent;
  }
  else {
    switchUsername = document.getElementById("switch-user-input").value;
  }
  req.open('GET', '/users/' + switchUsername, true);
  req.addEventListener('load', function(){
    var user = JSON.parse(req.responseText);
    var timeline = user.timeline;
    var followers = user.followers;
    var following = user.following;
    document.getElementById("current-user-header").innerHTML = switchUsername;
    if (timeline !== false) {   
      removeAll(document.getElementById("tweet-list"));
      for (var i = 0; i < timeline.length; i++) {
        if (timeline[i].retweet) {
          console.log(JSON.stringify(timeline[i]));
          var ul = document.getElementById("tweet-list");
          var li = document.createElement('li');
          var p1 = document.createElement('p');
          var p2 = document.createElement('p');

          var link = document.createElement('a');
          var link2 = document.createElement('a');

          var span = document.createElement('span');
          var span2 = document.createElement('span2');

          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');

          p1.setAttribute("class", "tweet-content");
          $(p1).data("tweet_id", timeline[i].id);
          p2.setAttribute("class", "tweet-username");

          link.setAttribute("class", "favorite-link");
          link2.setAttribute("class", "retweet-link");

          span.setAttribute("class", "favorite-count");
          span2.setAttribute("class", "retweet-indicator");

          div.setAttribute("class", "row");
          div2.setAttribute("class", "col-md-2");
          div3.setAttribute("class", "col-md-3");

          li.setAttribute("class", "list-group-item tweet"); // added line

          link.href = '#';
          link2.href = '#';
          link.innerHTML = "Favorite ";
          link.addEventListener('click', favoriteClicked);
          //console.log("favorites: " + timeline[i].favorites);
          span.innerHTML = timeline[i].favorites;
          span2.innerHTML = "(again)";
          link2.innerHTML = "Retweet";
          link2.addEventListener('click', retweetClicked);

          div2.appendChild(link);
          div2.appendChild(span);
          div3.appendChild(link2);
          div3.appendChild(span2);

          p1.appendChild(document.createTextNode(timeline[i].tweet));
          p2.appendChild(document.createTextNode(timeline[i].username));
          
          div.appendChild(div2);
          div.appendChild(div3);
          
          li.appendChild(p2);
          li.appendChild(p1);
          li.appendChild(div);
          ul.appendChild(li); 
        }
        else {
          var ul = document.getElementById("tweet-list");
          var li = document.createElement('li');
          var p1 = document.createElement('p');
          var p2 = document.createElement('p');

          var link = document.createElement('a');
          var link2 = document.createElement('a');

          var span = document.createElement('span');

          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');

          p1.setAttribute("class", "tweet-content");
          $(p1).data("tweet_id", timeline[i].id);
          p2.setAttribute("class", "tweet-username");

          link.setAttribute("class", "favorite-link");
          link2.setAttribute("class", "retweet-link");

          span.setAttribute("class", "tweet-username");

          div.setAttribute("class", "row");
          div2.setAttribute("class", "col-md-2");
          div3.setAttribute("class", "col-md-3");

          li.setAttribute("class", "list-group-item tweet"); // added line

          link.href = '#';
          link2.href = '#';
          link.innerHTML = "Favorite";
          link.addEventListener('click', favoriteClicked);
          console.log("favorites: " + timeline[i].favorites);
          span.innerHTML = timeline[i].favorites;
          link2.innerHTML = "Retweet";
          link2.addEventListener('click', retweetClicked);

          div2.appendChild(link);
          div2.appendChild(span);
          div3.appendChild(link2);

          p1.appendChild(document.createTextNode(timeline[i].tweet));
          p2.appendChild(document.createTextNode(timeline[i].username));
          
          div.appendChild(div2);
          div.appendChild(div3);
          
          li.appendChild(p2);
          li.appendChild(p1);
          li.appendChild(div);
          ul.appendChild(li);
        }
      }  
    }

    if (followers !== false) {
      removeAll(document.getElementById("follower-list"));
      updateFollow(followers, "follower-list");
    }

    if (following !== false) {
      removeAll(document.getElementById("following-list"));
      updateFollow(following, "following-list");
    }
  });
  document.getElementById("switch-user-input").value = "";
  req.send();
  console.log(req.responseText);
}


