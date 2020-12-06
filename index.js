require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const hashtag = async (number) => {
  _val = parseInt(number.substring(1))
  console.log(_val, "VAL")
  if(_val > 9999 || _val < 0){ return _val + " isn't a Punk."}

  return 'https://www.larvalabs.com/cryptopunks/details/' + _val
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.startsWith('#')) {

  hashtag(msg.content).then((val) => (msg.channel.send(val)))
   
    // msg.reply('pong');
    // msg.channel.send('https://www.larvalabs.com/cryptopunks/details/' + _value);

  } 
});
