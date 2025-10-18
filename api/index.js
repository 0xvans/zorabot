import { getNewCreators } from "../utils/zoraClient.js";
import { sendTelegramMessage } from "../utils/telegram.js";
import { formatCreatorMessage } from "../utils/formatMessage.js";

export default async function handler(req, res) {
  try {
    const creators = await getNewCreators();

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const fresh = creators.filter(c => new Date(c.createdAt).getTime() > fiveMinutesAgo);

    for (const c of fresh) {
      const msg = formatCreatorMessage(c);
      await sendTelegramMessage(msg.text, msg.buttons);
    }

    res.status(200).json({ sent: fresh.length, time: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
