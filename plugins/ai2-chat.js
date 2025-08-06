const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai2",
    alias: ["cnw", "hiruka","mrranumitha","mrhiruka"],
    desc: "Chat with Gemini AI via Lakiya API",
    category: "ai",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Gemini AI.\nExample: `.ai2 ඔයා හැදුවෙ කවුද`");

        const apiUrl = `https://lakiya-api-site.vercel.app/ai/gemini?q=${encodeURIComponent(q)}&CREATOR=Mr.RANUMITHA`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
            await react("❌");
            return reply("Gemini AI failed to respond. Please try again later.");
        }

        await reply(`✨ *Gemini AI Response:*\n\n${data.result}`);
        await react("✅");
    } catch (e) {
        console.error("Error in Gemini AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with Gemini AI.");
    }
});
