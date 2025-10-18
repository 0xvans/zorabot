import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const bot = new Telegraf(BOT_TOKEN);

export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.zora.co/universal/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash: "c2b3a1f16014905782a54053dc5a0aa4",
        operationName: "TabsQueriesProvider_ExploreQuery",
        variables: { first: 10, listType: "NEW_CREATORS" },
      }),
    });

    const data = await response.json();
    const creators = data?.data?.exploreList?.edges ?? [];

    if (creators.length === 0) {
      res.status(200).json({ message: "No new creators found." });
      return;
    }

    for (const { node } of creators) {
      const p = node.creatorProfile;
      if (!p) continue;

      const socials = p.socialAccounts || {};
      const lines = [
        `👤 <b>${p.displayName || p.handle}</b> (@${p.handle})`,
        `💎 <b>Contract:</b> <code>${node.address}</code>`,
        `📊 <b>Market Cap:</b> ${node.marketCap || "0"}`,
        "",
        `🌐 <b>Followers Zora:</b> ${p.vcFollowingTokenHolders?.count ?? 0}`,
        socials.twitter
          ? `🐦 Twitter: @${socials.twitter.username} (${socials.twitter.followerCount ?? 0})`
          : "",
        socials.farcaster
          ? `🌸 Farcaster: @${socials.farcaster.username} (${socials.farcaster.followerCount ?? 0})`
          : "",
        socials.instagram
          ? `📸 Instagram: @${socials.instagram.username} (${socials.instagram.followerCount ?? 0})`
          : "",
        socials.tiktok
          ? `🎵 TikTok: @${socials.tiktok.username} (${socials.tiktok.followerCount ?? 0})`
          : "",
        "",
        `<a href="https://zora.co/${p.handle}">🔗 View on Zora</a>`,
        `<a href="https://basescan.org/address/${node.address}">🚀 Auto Trade</a>`
      ].filter(Boolean);

      const caption = lines.join("\n");

      await bot.telegram.sendPhoto(CHANNEL_ID, node.avatar?.downloadableUri || node.mediaContent?.downloadableUri || "https://picsum.photos/200", {
        caption,
        parse_mode: "HTML"
      });
    }

    res.status(200).json({ message: "Sent to Telegram successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
