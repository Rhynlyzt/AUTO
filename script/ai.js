const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "4.8",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝙶𝙿𝚃-4 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝙼𝚘𝚍𝚎𝚕 - 𝙶𝙿𝚃 4 )",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("ai") === 0 || event.body.indexOf("Ai") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();

  if (args.length === 0) {
    api.sendMessage("🤖 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙼𝚘𝚍𝚎𝚕 𝙶𝙿𝚃-4 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝚋𝚢 𝙾𝚙𝚎𝚗𝚊𝚒.", event.threadID, event.messageID);
    return;
  }

  api.sendMessage("🗨️ | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

  const content = args.join(" ");
  axios.get(`https://gpt-4-upet.onrender.com/gpt?content=${encodeURIComponent(content)}`)
    .then(response => {
      if (response.data.gpt) {
        const aiResponse = formatFont(`🎓 𝐆𝐏𝐓-4 ( 𝐀𝐈 )\n\n🖋️ 𝙰𝚜𝚔: '${content}'\n\n${response.data.gpt}`);
        api.sendMessage(aiResponse, event.threadID, event.messageID);
      } else {
        api.sendMessage("🤖 𝙽𝚘 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚏𝚛𝚘𝚖 𝙶𝙿𝚃-4 𝙰𝙿𝙸", event.threadID, event.messageID);
      }
    })
    .catch(error => {
      console.error("🤖 𝙴𝚛𝚛𝚘𝚛:", error);
      api.sendMessage("🤖 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚎𝚜𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚛𝚎𝚚𝚞𝚎𝚜𝚝, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.", event.threadID, event.messageID);
    });
};

function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

module.exports.run = async function({api, event}) {};