require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js");
const Web3 = require("web3");
const fetch = require("node-fetch");
const htmlToJson = require("html-to-json");
const bot = new Client();
const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;
const SERVER = process.env.SERVER;

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

bot.login(TOKEN);

const hashtag = async (number) => {
  _val = parseInt(number.substring(1));
  if (_val > 9999 || _val < 0) {
    return _val + " isn't a Punk.";
  }

  return "https://larvalabs.com/cryptopunks/details/" + _val.toString();
};

async function punkData(msg, number) {
  _val = parseInt(number.substring(1));
  if (_val > 9999 || _val < 0) {
    return _val + " isn't a Punk.";
  }
  await fetch(
    " https://api.opensea.io/api/v1/asset/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/" +
      _val,
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var punkType = data.traits
        .filter(function (item) {
          if (item.trait_type === "type") {
            return true;
          }
          return false;
        })
        .map(function (item) {
          return item.value;
        });

      var punkAtt = data.traits
        .filter(function (item) {
          if (item.trait_type === "accessory") {
            return true;
          }
          return false;
        })
        .map(function (item) {
          return `${item.value} (${item.trait_count}) `;
        })
        .join(", ");
      const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle(data.name)

        .setURL(data.external_link)
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setThumbnail(data.image_original_url)
        .setDescription(
          data.name + " is a " + punkType + " with the attributes " + punkAtt
        )
        .addFields({
          name: "Owner",
          value: `[${data.owner.address.slice(
            0,
            8
          )}](https://www.larvalabs.com/cryptopunks/accountinfo?account=${
            data.owner.address
          })`,
          inline: true,
        })

        .addFields(
          data.last_sale
            ? {
                name: "Last Sale",
                value: `Sold ${new Date(
                  data.last_sale.event_timestamp
                ).toLocaleDateString()} for ${web3.utils.fromWei(
                  data.last_sale.total_price,
                  "ether"
                )}Ξ`,
                inline: true,
              }
            : { name: "Last Sale", value: "No Transactions", inline: true }
        );
      msg.channel.send(embed);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

const openseaEvent = async () => {
  var d1 = new Date(),
    d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() - 2);

  const pastTime = Math.round(d2 / 1000 + 60 * 60 * 24);
  console.log(pastTime);
  await fetch(
    "https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=0xb7f7f6c52f2e2fdb1963eab30438024864c313f6&offset=0&limit=2&occurred_after=" +
      pastTime,
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.asset_events.length);
      if (data.asset_events.length > 0) {
        console.log(data.asset_events);

        data.asset_events.map((item) => {
          bot.channels.get(CHANNEL).send(item.asset.permalink);
        });
      } else {
        console.log("no changes");
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
  if (msg.content.startsWith("#")) {
    punkData(msg, msg.content);
  }
});

setInterval(openseaEvent, 120000);
