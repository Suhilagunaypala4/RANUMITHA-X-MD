const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg","ranuimg"],
    react: "🏞️",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🖼️ Please provide a search query\nExample: .img cute cats");
        }

        await reply(`🔍 Searching images for "${query}"...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // Validate response
        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ No images found. Try different keywords");
        }

   // Fetch profile picture buffer
    let thumb = Buffer.from([]);
    const number = "18002428478"; // Use your number without spaces or symbols
    const jid = number + "@s.whatsapp.net";

    try {
      const ppUrl = await conn.profilePictureUrl(jid, "image");
      const ppResp = await axios.get(ppUrl, { responseType: "arraybuffer" });
      thumb = Buffer.from(ppResp.data, "binary");
    } catch (err) {
      console.log("❗ Couldn't fetch profile picture:", err.message);
    }

    // Create contact card vCard object
    const contactCard = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "GPT ✅",
          vcard: `BEGIN:VCARD
VERSION:3.0
FN: GPT ✅
ORG: OpenAI
TEL;type=CELL;type=VOICE;waid=${number}:+1 800 242 8478
END:VCARD`,
          jpegThumbnail: thumb
        }
      }
    };

        
        const results = response.data.results;
        // Get 5 random images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `📷 Result for: ${query}\n> *© Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛*`
                },
                { quoted: mek }
            );
            // Add delay between sends to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch images"}`);
    }
});
