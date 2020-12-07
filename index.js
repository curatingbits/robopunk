require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL
const SERVER = process.env.SERVER

bot.login(TOKEN);

const hashtag = async (number) => {
  _val = parseInt(number.substring(1));
  if (_val > 9999 || _val < 0) {
    return _val + " isn't a Punk.";
  }

  return "https://www.larvalabs.com/cryptopunks/details/" + _val;
};

const openseaEvent = async () => {
  var d1 = new Date(),
    d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() - 2);

  const pastTime = Math.round(d2 / 1000 + 60 * 60 * 24)
  console.log(pastTime)
  await fetch(
    "https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=0xb7f7f6c52f2e2fdb1963eab30438024864c313f6&offset=0&limit=2&occurred_after="+pastTime,
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.asset_events.length);
      if(data.asset_events.length > 0){
        console.log(  data.asset_events)
      
       
        data.asset_events.map((item) => {
          bot.channels.get(CHANNEL).send(item.asset.permalink)
        })
      } else {
        console.log("no changes")
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);

});

bot.on("message", (msg) => {

  if(msg.channel.id === CHANNEL) {
    if (msg.content.startsWith("#")) {
      hashtag(msg.content)
        .then((val) => msg.channel.send(val))
        .catch((err) => console.log(err));
    }
  }
});



setInterval(openseaEvent, 120000);
