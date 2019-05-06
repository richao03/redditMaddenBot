import React from 'react';
import logo from './logo.svg';
import './App.css';
import Snoowrap from 'snoowrap';

function App() {
  //here we use a library called snoowrap that helps us get authorized from reddit's API
  const Reddit = new Snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: ' CLIENTID',
    clientSecret: 'CLIENTSECRET',
    username: 'userNameToPost',
    password: 'PasswordForUserNameToPost'
  });

  //this is the answer we are going to use to auto reply
  let replyAnswer =
    "Instead of making EA rich year after year, just buy Madden off of craigslist or ebay 2nd hand, this way EA won't be able to make money off of you";

    //once we are authorized we can use the methods snoowrap provides, such as Reddit.getNewComments({name of subreddit})
    
    //ideally this function will be set on a timer, so it runs once an hour for example
    Reddit.getNewComments('madden')
    .then(async res => {
      //snoowrap uses .then style promises
      for (let i = 0; i < res.length; i++) {
        //once we fetched all the newest comments, we use a for loop to check if the body of the comment includes these key words
        if (
          res[i].body.includes('buy madden') ||
          res[i].body.includes('buying madden')
        ) {
          //if it does exist, we pass it to the next .then function 
          return res[i];
        }
      }
    })
    .then(async foundComment => {
      //then we check the replies to that found comment from line 33
      //does any of the replies already contain the replyAnswer in line 17 above?
      let commentToReply = await foundComment.replies.fetchAll().then(res => {
        for (let j = 0; j < res.length; j++) {
          if (res[j].body.includes(replyAnswer)) {
            //if it does we return false
            return false;
          }
        }
        //otherwise we return the entire comment
        return foundComment;
      });
      return commentToReply; //this is either going to be the entire comment, or a boolean of false
    })
    .then(commentToReply => {
      //if commentToReply is not false, we will get the comment, and reply to it with the replyAnswer variable from line 17 
      if (commentToReply) {
        Reddit.getComment(commentToReply.id).reply(replyAnswer);
      } else {
        //if commentToReply is false, then just return and do nothing
        return;
      }
    });

    //ignore all of the code below, because there is no front end associated with this script
    //its only here because i used a boiler plate create-react-app to start the project
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
