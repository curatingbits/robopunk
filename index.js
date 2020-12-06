require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;


bot.login(TOKEN);

const hashtag = async (number) => {
  _val = parseInt(number.substring(1));
  if (_val > 9999 || _val < 0) {
    return _val + " isn't a Punk.";
  }

  return "https://www.larvalabs.com/cryptopunks/details/" + _val;
};


const openseaEvent = async() => {
  console.log("Hello")
  await fetch("https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=0xb7f7f6c52f2e2fdb1963eab30438024864c313f6&offset=0&limit=2", {
  "method": "GET",
  "headers": {}
})
.then(response => 
  response.json()

).then(data => {
  console.log(data.asset_events[0].asset)
})
.catch(err => {
  console.error(err);
});

}

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  if (msg.content.startsWith("#")) {
    hashtag(msg.content)
      .then((val) => msg.channel.send(val))
      .catch((err) => console.log(err));

    // msg.reply('pong');
    // msg.channel.send('https://www.larvalabs.com/cryptopunks/details/' + _value);
  }
});

// setInterval(openseaEvent, 10000)
