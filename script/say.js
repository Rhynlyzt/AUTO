const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "say",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 2,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "mr.beast text to speech"
    },
    category: "𝗔𝗜",
    guide: {
      en: "{p}beast [text]"
    }
  },
  run: async function ({ api, event, args }) {
    try {
      const { createReadStream, unlinkSync } = fs;
      const { resolve } = path;

      const { messageID, threadID, senderID, body, mentions, type } = event;

      let chat = args.join(" ");

      const extractText = () => {
        if (type === "message_reply") {
          return event.messageReply.body;
        } else if (mentions.length > 0) {
          return mentions[0].body;
        } else {
          return chat;
        }
      };

      chat = extractText();

      if (!chat) return api.sendMessage(`Please provide text to convert to audio.`, threadID, messageID);

      const text = encodeURIComponent(chat);

      const audioPath = resolve(__dirname, 'cache', `${threadID}_${senderID}_beast.mp3`);

      const audioApi = await axios.get(`https://www.api.vyturex.com/beast?query=${text}`);

      const audioUrl = audioApi.data.audio;

      // Simple downloadFile function implementation
      const downloadFile = async (url, dest) => {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
        });

        response.data.pipe(fs.createWriteStream(dest));

        return new Promise((resolve, reject) => {
          response.data.on('end', () => resolve());
          response.data.on('error', (error) => reject(error));
        });
      };

      await downloadFile(audioUrl, audioPath);

      const att = createReadStream(audioPath);

      api.sendMessage({
        attachment: att,
        body: '', 
      }, threadID, null, messageID, () => unlinkSync(audioPath));
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
  }
};