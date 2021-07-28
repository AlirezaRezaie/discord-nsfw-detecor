require("dotenv").config();
const gitwatchClient = require("./gitwatch");
let client = new gitwatchClient.Detector(requestEndPoint, github_token);
const deepai = require("deepai");
deepai.setApiKey(process.env.NSFW_API_KEY);

const Discord = require("discord.js");
const client = new Discord.Client();

async function is_nude(img_url) {
  let resp = await deepai.callStandardApi("nsfw-detector", {
    image: img_url.toString(),
  });
  let output = [];
  resp.output.detections.forEach((element) => {
    output.push(element.name);
  });

  return output === [] ? undefined : output.join(",");
}
client.on("ready", () => {
  console.log("bot is ready");
  const channel = client.channels.cache.find(
    (channel) => channel.name === "programming-and-etc"
  );

  client.watchNewCommit((author, message) => {
    channel.send(author, message);
  });
});

client.on("message", (msg) => {
  try {
    recievedImgUrl = msg.attachments.first().url;

    is_nude(recievedImgUrl)
      .then((result) => {
        if (result) {
          msg.reply("بی ادب \n" + result);
          console.log(result);
        }
      })
      .catch(() => console.log("error"));
  } catch (e) {
    console.log("not an image");
  }
});

client.login(process.env.BOT_TOKEN);
