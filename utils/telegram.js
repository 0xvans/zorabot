import fetch from "node-fetch";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

export async function sendTelegramMessage(text, buttons) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  const photo = "https://zora.co/logo.png"; // fallback image

  const payload = {
    chat_id: TELEGRAM_CHANNEL_ID,
    caption: text,
    parse_mode: "Markdown",
    photo,
    reply_markup: buttons
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
