const TelegramBot = require("node-telegram-bot-api");

const fetch = require("node-fetch");

let settings = { method: "Get" };

const token =
  process.env.TOKEN || "5699287289:AAGYgM_BRzFsgEvQ05NQPyCrooX-jQmaI64";

const _idGroup = "-421311879";

const bot = new TelegramBot(token, { polling: true });

const PREFIX = "/";

const apiKey = "";

// const api = new ChatGPTAPIBrowser({
//   email: process.env.OPENAI_EMAIL,
//   password: process.env.OPENAI_PASSWORD,
// });

module.exports = {
  startBot: () => {
    bot.onText(/\/echo (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      bot.sendMessage(chatId, resp);
    });

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;

      let args = msg.text?.substring(PREFIX.length).split(" ") ?? "";

      switch (args[0]) {
        case "weather":
          const weather2 = await weatherFunc2();
          bot.sendChatAction(chatId, "typing");
          setTimeout(() => {
            bot.sendMessage(
              chatId,
              `🌦Thời tiết tại: ${weather2.request.query}.\nNhiệt độ: ${weather2.current.temperature}°C.\nCảm thấy như: ${weather2.current.feelslike}°C.\nTốc độ gió : ${weather2.current.wind_speed}km/h\nĐộ ẩm không khí : ${weather2.current.humidity}%\nChỉ số UV : ${weather2.current.uv_index}`,
              {
                reply_to_message_id: msg.message_id,
              }
            );
          }, "1000");
          break;
        case "vcb":
          const vcb = await vcbFunc();
          const usd = vcb?.ExrateList.Exrate.find(
            (x) => x._attributes?.CurrencyCode === "USD"
          )._attributes;
          bot.sendChatAction(chatId, "typing");
          setTimeout(() => {
            bot.sendMessage(
              chatId,
              `💴 Tỉ giá ${usd.CurrencyName}\n- Giá mua vào : ${usd.Buy}đ.\n- Giá bán ra : ${usd.Sell}đ.`,
              {
                reply_to_message_id: msg.message_id,
              }
            );
          }, "500");
          break;
        case "/help":
          await bot.sendMessage(
            msg.chat.id,
            "To chat with me, you can:\n" +
              "   • send messages that start with `/`\n\n" +
              "Command list:\n" +
              `(When using a command in a group, make sure to include a mention after the command, like /help).\n` +
              "  • /help Show help information.\n" +
              "  • /weather Show weather today.\n" +
              "  • /vcb Show exchange USD to VND."
          );
          break;
        default:
          bot.sendMessage(chatId, "⛔️ Lệnh không hợp lệ!");
      }
    });
  },
};

const api_weather =
  "http://api.weatherstack.com/current?access_key=e36f7ddfbe3d3515c3091f952fc08280&query=hanoi";

let weatherFunc2 = async () =>
  await fetch(api_weather, settings)
    .then((res) => {
      return res.json();
    })
    .then((json) => json);

const api_vcb = "https://salarycalculate.onrender.com/bank/get";

let vcbFunc = async () =>
  await fetch(api_vcb, settings)
    .then((res) => {
      return res.json();
    })
    .then((json) => json);
