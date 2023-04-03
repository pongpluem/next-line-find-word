const line = require('@line/bot-sdk');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };
  
  // create LINE SDK client
  const client = new line.Client(config);

export default async function handler(req, res) {
    try {
        const message = req.body.message;

        console.log(process.env.CHANNEL_ACCESS_TOKEN)

        console.log("req")
        console.log(req)
        console.log("bofy")
        console.log(req.body)
        console.log("message")
        console.log(message)
        /*
        await client.pushMessage("", {
          type: "text",
          text: message,
        });
        */
        res.status(200).json({ message: `${message}Successs` });
      } catch (e) {
        res.status(500).json({ message: `error! ${e} ` });
      }
    
  }

