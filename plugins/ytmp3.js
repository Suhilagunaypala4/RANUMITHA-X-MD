const { cmd } = require('../command');
const config = require('../config');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
  name: "ytmp3",
  alias: ["yta", "youtubeaudio"],
  desc: "Download YouTube video as MP3",
  category: "Media",
  async run(m, sock) {
    const link = m.body.split(' ')[1];
    if (!link || !ytdl.validateURL(link)) {
      return m.reply("❗ Please send a valid YouTube link.");
    }

    const info = await ytdl.getInfo(link);
    const title = info.videoDetails.title;
    const stream = ytdl(link, { filter: 'audioonly' });
    const filePath = './tmp/audio.mp3';

    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);

    writeStream.on('finish', async () => {
      await sock.sendMessage(m.chat, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mp4',
        fileName: `${title}.mp3`
      }, { quoted: m });
      fs.unlinkSync(filePath);
    });
  }
};
