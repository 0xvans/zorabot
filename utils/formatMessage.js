export function formatCreatorMessage(c) {
  const socialLinks = [];

  if (c.socials.twitter?.handle)
    socialLinks.push(`🐦 Twitter: https://twitter.com/${c.socials.twitter.handle}`);
  if (c.socials.farcaster?.handle)
    socialLinks.push(`🪄 Farcaster: https://warpcast.com/${c.socials.farcaster.handle}`);
  if (c.socials.instagram?.handle)
    socialLinks.push(`📸 Instagram: https://instagram.com/${c.socials.instagram.handle}`);
  if (c.socials.tiktok?.handle)
    socialLinks.push(`🎵 TikTok: https://tiktok.com/@${c.socials.tiktok.handle}`);

  const followersText = `
👥 Followers:
- Zora: ${c.followers.zora}
- Twitter: ${c.followers.twitter}
- Farcaster: ${c.followers.farcaster}
- Instagram: ${c.followers.instagram}
- TikTok: ${c.followers.tiktok}
`.trim();

  const text = `
🆕 *New Zora Creator!*

👤 *${c.name || "Unknown"}* (@${c.handle || "n/a"})
💎 Contract: \`${c.address}\`

${followersText}

${socialLinks.join("\n")}

📈 Market Cap: ${c.marketCap || "?"}
  `.trim();

  const buttons = {
    inline_keyboard: [
      [{ text: "🚀 Auto Trade", url: `https://zora.co/collect/${c.address}` }]
    ]
  };

  return { text, buttons };
}
