import React from 'react';
import logo from './logo.svg';
import './App.css';
import Snoowrap from 'snoowrap';

function App() {
  const Reddit = new Snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: ' CLIENTID',
    clientSecret: 'CLIENTSECRET',
    username: 'userNameToPost',
    password: 'PasswordForUserNameToPost'
  });

  let replyAnswer =
    "Instead of making EA rich year after year, just buy Madden off of craigslist or ebay 2nd hand, this way EA won't be able to make money off of you";

    Reddit.getNewComments('madden')
    .then(async res => {
      for (let i = 0; i < res.length; i++) {
        if (
          res[i].body.includes('buy madden') ||
          res[i].body.includes('buying madden')
        ) {
          //check if bot already replied
          return res[i];
        }
      }
    })
    .then(async foundComment => {
      let commentToReply = await foundComment.replies.fetchAll().then(res => {
        for (let j = 0; j < res.length; j++) {
          if (res[j].body.includes(replyAnswer)) {
            return false;
          }
        }
        return foundComment;
      });
      return commentToReply;
    })
    .then(commentToReply => {
      if (commentToReply) {
        Reddit.getComment(commentToReply.id).reply(replyAnswer);
      } else {
        return;
      }
    });

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
