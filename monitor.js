const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");

// Replace with your Telegram bot token
const botToken = "5888511962:AAFrWLzn0tt1LzXPNO_bFjKcLJrJskE-DmY";
const chatId = "601180719"; // Your chat ID

const bot = new TelegramBot(botToken, { polling: false });

const URL = "https://esii-orion.com/orion-reservation/slots?account=EVMSPI&config=SEJOURUSARNVT&usemode=app&code=REN1"; // The URL of the webpage you want to monitor
const targetClassName = "user-msg error"; // The specific class name you want to monitor

let previousDivCount = 0;

async function checkForNewDivs() {
    bot.sendMessage(chatId, "hello");
  try {
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const divCount = $(`div.${targetClassName}`).length;

    if (divCount < previousDivCount) {
      const deletedDivs = previousDivCount - divCount;
      bot.sendMessage(chatId, `Deleted ${deletedDivs} div(s) with class "${targetClassName}" from ${URL}`);
    }

    previousDivCount = divCount;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Check for new divs every N seconds
const checkInterval = 60 * 1000; // Check every minute
setInterval(checkForNewDivs, checkInterval);
