
```js
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
  name: "song",
  alias: ["ytmp3", "music"],
  desc: "Download a song from YouTube",
  category: "Media",
  async run(m, sock) {
    const query = m.body.split(' ').slice(1).join(' ');
    if (!query) return m.reply("🎵 Please give a song name or YouTube link.");

    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return m.reply("❌ Song not found!");

    const stream = ytdl(video.url, { filter: 'audioonly' });
    const filePath = './tmp/song.mp3';

    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);

    writeStream.on('finish', async () => {
      await sock.sendMessage(m.chat, { audio: fs.readFileSync(filePath), mimetype: 'audio/mp4' }, { quoted: m });
      fs.unlinkSync(filePath);
    });
  },
};
```

