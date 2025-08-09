const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: '🖇',
  desc: "Convert media to Catbox URL",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType) throw "Please reply to an image, video, or audio file";

    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';

    const fileName = `file${extension}`;

    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data) throw "Error uploading to Catbox";

    const mediaUrl = response.data;
    fs.unlinkSync(tempFilePath);

    const mediaType = mimeType.includes('image') ? 'Image' :
                      mimeType.includes('video') ? 'Video' :
                      mimeType.includes('audio') ? 'Audio' : 'File';

    const fakePreviewText =
`*WhatsApp ✅ • Group*
👥 Powering Smart Automation

*Uploaded successfully:*
${mediaUrl}
`;

    await client.sendMessage(message.chat, {
      text: fakePreviewText,
      contextInfo: {
        isForwarded: true
      }
    }, { quoted: message });

  } catch (error) {
    console.error(error);
    await reply(`Error: ${error.message || error}`);
  }
});
