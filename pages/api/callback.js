const line = require("@line/bot-sdk");
const jsonData3 = require("../../resource/json/3.json");
const jsonData4 = require("../../resource/json/4.json");
const jsonData5 = require("../../resource/json/5.json");
const jsonData6 = require("../../resource/json/6.json");
const jsonDataM = require("../../resource/json/m.json");

const games = new Map();

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

export default async function handler(req, res) {
  try {
    //console.log(jsonData3)

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

/*
  function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {       
      return Promise.resolve(null);
    }      

    console.log(event)
    

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text,
    });
  }
  */

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: "text", text }))
  );
};

function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }

  console.log("1");

  switch (event.type) {
    case "message":
      console.log("2");
      const message = event.message;
      switch (message.type) {
        case "text":
          return handleText(message, event.replyToken, event.source);
          break;
        case "image":
          //return handleImage(message, event.replyToken);
          break;
        case "video":
          //return handleVideo(message, event.replyToken);
          break;
        case "audio":
          //return handleAudio(message, event.replyToken);
          break;
        case "location":
          //return handleLocation(message, event.replyToken);
          break;
        case "sticker":
          //return handleSticker(message, event.replyToken);
          break;
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
          break;
      }

    case "follow":
      return replyText(event.replyToken, "Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let data = event.postback.data;
      if (data === "DATE" || data === "TIME" || data === "DATETIME") {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case "beacon":
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function NewGame(message, replyToken, source, user) {
  Math.floor(Math.random() * 10) + 1;

  console.log("New1");

  const lv = Math.floor(Math.random() * 4) + 3;
  let data = jsonData4;

  switch (lv) {
    case 3:
      data = jsonData3;
      break;
    case 4:
      data = jsonData4;
      break;
    case 5:
      data = jsonData5;
      break;
    case 6:
      data = jsonData6;
      break;
    default:
      data = jsonData4;
      break;
  }

  console.log("New2");

  // Overrid to Hard Mode
  data = jsonDataM;

  //console.log(data);

  const i = Math.floor(Math.random() * (data.data.word.length - 1));

  console.log(i);

  const word = data.data.word[i]
  console.log(word);

  const q = word.wordEN;
  console.log(q);
  const s = word.soundTH;
  console.log(s);
  const d = word.descTH;
  console.log(d);

  console.log("New3");

  games.set(user, {
    userid: user,
    quest: q,
    sound: s,
    desc: d,
    num: 1,
  });

  console.log("New4");
  console.log(games);

  return games.get(user);
}

function getUser(source) {
  let user = "";

  switch (source.type) {
    case "user":
      user = source.userId;
      break;
    case "group":
      user = source.groupId;
      break;
    case "room":
      user = source.roomId;
      break;
  }

  return user;
}

function iremove(value, index) {
  let tmp = [];

  for (let i = 0; i < value.length; i++) {
    if (i != index) {
      tmp.push(value[i]);
    }
  }

  return tmp;
}

function handleText(message, replyToken, source) {
  console.log("3");
  let user = "";
  let game = null;
  let hint = "";
  const text = message.text.toLowerCase();
  switch (text) {
    case "profile":
      if (source.userId) {
        return client
          .getProfile(source.userId)
          .then((profile) =>
            replyText(replyToken, [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ])
          );
      } else {
        return replyText(
          replyToken,
          "Bot can't use profile API without user ID"
        );
      }
      break;
    case "g start":
      console.log("4");
      user = getUser(source);

      console.log("5");
      console.log(user);

      game = NewGame(message, replyToken, source, user);

      console.log("6");
      console.log(game);
      if (Math.floor(Math.random() * 2) === 0) {
        hint = game.desc;
        game.hint = 0;
      } else {
        hint = game.sound;
        game.hint = 1;
      }

      //games[user] = game

      return replyText(replyToken, [
        `Game Start! with word ` + game.quest.length + ` digits.`,
        hint,
      ]);

      break;
    /*
      case 'bye':
        switch (source.type) {
          case 'user':
            return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
          case 'group':
            return replyText(replyToken, 'Leaving group')
              .then(() => client.leaveGroup(source.groupId));
          case 'room':
            return replyText(replyToken, 'Leaving room')
              .then(() => client.leaveRoom(source.roomId));
        }
      */
    case "g give up":
      user = getUser(source);
      game = games.get(user);

      games.delete(user);

      return replyText(replyToken, [`Game Stop!`, game.quest]);
      break;
    case "g hint":
      user = getUser(source);
      game = games.get(user);

      if (game.hint != 0) {
        hint = game.desc;
        game.hint = 0;
      } else {
        hint = game.sound;
        game.hint = 1;
      }

      games.set(user, game);

      return replyText(replyToken, [`Game Hint! `, hint]);
      break;
    default: // Game verify
      user = getUser(source);

      game = games.get(user);

      let digit = 0;
      let place = 0;
      let quests = Array.of(game.quest);
      let texts = Array.of(text);
      let placeUsed = [];

      let qsize = game.quest.length;

      if (text.length === qsize) {
        // place find
        for (let i = qsize - 1; i >= 0; i--) {
          if (texts[i] === quests[i]) {
            place++;
            digit++;
            placeUsed.push(i);
          }
        }

        // remove place use quest
        placeUsed.forEach((s) => {
          texts = iremove(texts, s);
          quests = iremove(quests, s);
        });

        // find digit
        for (let k = 0; k < texts.length; k++) {
          for (let s = quests.length; s > 0; s--) {
            if (texts[k] === quests[s - 1]) {
              digit++;
              quests = iremove(quests, s - 1);
              break;
            }
          }
        }

        console.log("place : "+place)
        console.log("digit : "+digit)
        console.log("texts : "+texts)
        console.log("quests : "+quests)
        console.log("placeUsed : "+placeUsed)

        if (place >= qsize) {
          //gameTime := time.Since(game.localTime)

          games.delete(user);

          return replyText(replyToken, [
            `Your Win!`,
            `คำศัพท์ : ` +
              game.quest +
              ` คำอ่าน : ` +
              game.sound +
              ` คำแปล : ` +
              game.desc,
          ]);
        } else {
          return replyText(replyToken, [
            text+` ▼ `,
            `  ตำแหน่ง : `+ place + ` ตัวอักษร : ` + digit,
          ]);
        }
      }

      break;
    //console.log(`Echo message to ${replyToken}: ${message.text}`);
    //return replyText(replyToken, message.text);
  }
}

function handleImage(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.jpg`
    );
    const previewPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        // ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(
          `convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`
        );

        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
          previewImageUrl:
            baseURL + "/downloaded/" + path.basename(previewPath),
        };
      }
    );
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    return client.replyMessage(replyToken, {
      type: "image",
      originalContentUrl,
      previewImageUrl,
    });
  });
}

function handleVideo(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.mp4`
    );
    const previewPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        // FFmpeg and ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
          previewImageUrl:
            baseURL + "/downloaded/" + path.basename(previewPath),
        };
      }
    );
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    return client.replyMessage(replyToken, {
      type: "video",
      originalContentUrl,
      previewImageUrl,
    });
  });
}

function handleAudio(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.m4a`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
        };
      }
    );
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl }) => {
    return client.replyMessage(replyToken, {
      type: "audio",
      originalContentUrl,
      duration: message.duration,
    });
  });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId).then(
    (stream) =>
      new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        stream.on("end", () => resolve(downloadPath));
        stream.on("error", reject);
      })
  );
}

function handleLocation(message, replyToken) {
  return client.replyMessage(replyToken, {
    type: "location",
    title: message.title,
    address: message.address,
    latitude: message.latitude,
    longitude: message.longitude,
  });
}

function handleSticker(message, replyToken) {
  return client.replyMessage(replyToken, {
    type: "sticker",
    packageId: message.packageId,
    stickerId: message.stickerId,
  });
}
