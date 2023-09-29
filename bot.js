const TelegramBot = require("node-telegram-bot-api");

const fetch = require("node-fetch");

let settings = { method: "Get" };

const token =
  process.env.TOKEN || "5699287289:AAGYgM_BRzFsgEvQ05NQPyCrooX-jQmaI64";

const _idGroup = "-421311879";

const bot = new TelegramBot(token, { polling: true });

const PREFIX = "/";

module.exports = {
  startBot: () => {
    bot.onText(/\/echo (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      bot.sendMessage(chatId, resp);
    });

    bot.on("message", async (msg) => {
      const { username: botUsername } = await bot.getMe();
      const chatId = msg.chat.id;
      let args = msg.text?.substring(PREFIX.length).split(" ") ?? "";

      let text = args[0];

      if (text?.includes("@")) {
        let str = text;
        let index = str?.indexOf("@"); // Find the index of the @ symbol
        text = str?.substring(0, index); // Extract the text before the @ symbol
      }
      switch (text) {
        case "cat":
          bot.sendChatAction(chatId, "typing");
          setTimeout(async () => {
            bot.sendPhoto(chatId, await getImageCat());
          }, "500");
          break;
        case "dog":
          bot.sendChatAction(chatId, "typing");
          setTimeout(async () => {
            bot.sendPhoto(chatId, await getImageDog());
          }, "500");
          break;
        case "weather":
          const weather2 = await weatherFunc2();
          bot.sendChatAction(chatId, "typing");
          setTimeout(() => {
            bot.sendMessage(
              chatId,
              "🌦Thời tiết tại:" +
              ` ${weather2.request.query}.\n` +
              ` • Mô tả: ${weather2.current.weather_descriptions}.\n` +
              ` • Nhiệt độ: ${weather2.current.temperature}°C.\n` +
              ` • Cảm thấy như: ${weather2.current.feelslike}°C.\n` +
              ` • Tốc độ gió: ${weather2.current.wind_speed}km/h\n` +
              ` • Độ ẩm không khí: ${weather2.current.humidity}%\n` +
              ` • Chỉ số UV: ${weather2.current.uv_index}` +
              "",
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
              `💴 Tỉ giá ${usd.CurrencyName}\n • Giá mua vào : ${usd.Buy}đ.\n • Giá bán ra : ${usd.Sell}đ.`,
              {
                reply_to_message_id: msg.message_id,
              }
            );
          }, "500");
          break;
        case "help":
          await bot.sendMessage(
            msg.chat.id,
            "Để trò chuyện với tôi, bạn có thể:\n" +
            "  • gửi tin nhắn bắt đầu bằng `/`\n" +
            "Danh sách lệnh:\n" +
            `(Khi sử dụng lệnh trong nhóm, hãy đảm bảo bao gồm đề cập sau lệnh, như /help).\n` +
            "  • /help Hiển thị thông tin trợ giúp.\n" +
            "  • /weather Hiển thị thời tiết hôm nay.\n" +
            "  • /vcb Show đổi USD sang VND." +
            "  • /cat Hiển thị 1 bức ảnh mèo ngẫu nhiên." +
            "  • /dog Hiển thị 1 bức ảnh chó ngẫu nhiên."
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


let getImageCat = async () =>
  await fetch("https://api.thecatapi.com/v1/images/search", settings)
    .then((res) => res?.json())
    .then((json) => json[0].url);

let getImageDog = async () =>
  await fetch("https://api.thedogapi.com/v1/images/search", settings)
    .then((res) => res?.json())
    .then((json) => json[0].url);
