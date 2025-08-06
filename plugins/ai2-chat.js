const { cmd } = require('../command');
const axios = require('axios');

// Fake ChatGPT vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`
        }
    }
};


cmd({
    pattern: "ai2",
    alias: ["cnw", "hiruka","mrranumitha","mrhiruka"],
    desc: "Chat with Gemini AI via Lakiya API",
    category: "ai",
    react: "🧠",
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

        await reply(`✨ *Gemini AI Response:*\n\n${data.result}`
        }, { quoted: contactCard });
        await react("✅");
    } catch (e) {
        console.error("Error in Gemini AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with Gemini AI.");
    }
});
