const line = require('@line/bot-sdk');
const jsonData3 = require('../../resource/json/3.json');
const jsonData4 = require('../../resource/json/4.json');
const jsonData5 = require('../../resource/json/5.json');
const jsonData6 = require('../../resource/json/6.json');



// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };
  
  // create LINE SDK client
  const client = new line.Client(config);

export default async function handler(req, res) {
    try {
        console.log(jsonData3)
        
        Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.error(err);
          res.status(500).end();
        });

       // res.status(200).json({ message: `${message}Successs` });
      } catch (e) {
        res.status(500).json({ message: `error! ${e} ` });
      }
    
  }

  function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {       
      return Promise.resolve(null);
    }
  
    console.log("this is message")
    console.log(event.message.text)

    console.log("this is token")
    console.log(event.replyToken)

    

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text,
    });
  }

