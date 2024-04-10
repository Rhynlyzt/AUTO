module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  aliases: ['info'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Develeoper',
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = ` ⋆☾⋆⁺₊✧𝐌𝐘 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓✩ ♬ ₊.:\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. ⋆☾⋆⁺₊✧ ${prefix}${commands[i]} ✩ ♬ ₊.\n`;
      }
      helpMessage += '˖ ࣪ ᪥𝐓𝐇𝐄 𝐄𝐕𝐄𝐍𝐓 𝐋𝐈𝐒𝐓𐀔 𓂃:\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. ✩ ♬ ₊ ${prefix}${eventCommand} ⋆☾⋆⁺₊✧\n`;
      });
      helpMessage += `\n𝐏𝐀𝐆𝐄 ${page}/${Math.ceil(commands.length / pages)}. 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐓𝐇𝐄 𝐍𝐄𝐗𝐓 𝐏𝐀𝐆𝐄, 𝐓𝐘𝐏𝐄 '${prefix}𝐇𝐄𝐋𝐏 𝐏𝐀𝐆𝐄 𝐍𝐔𝐌𝐁𝐄𝐑'. 𝐓𝐎 𝐕𝐈𝐄𝐖 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐀𝐁𝐎𝐔𝐓 𝐀 𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂 𝐂𝐎𝐌𝐌𝐀𝐍𝐃, 𝐓𝐘𝐏E. '${prefix}𝐇𝐄𝐋𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐍𝐀𝐌E✩ ♬ '.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = ` ⋆☾⋆⁺₊✧𝐌𝐘 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓✩ ♬ ₊.:\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. ⋆☾⋆⁺₊✧ ${prefix}${commands[i]} ✩ ♬ ₊.\n`;
      }
      helpMessage += '˖ ࣪ ᪥𝐓𝐇𝐄 𝐄𝐕𝐄𝐍𝐓 𝐋𝐈𝐒𝐓𐀔 𓂃:\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}.✩ ♬ ₊.${prefix}${eventCommand} ⋆☾⋆⁺₊✧\n`;
      });
      helpMessage += `\n𝐏𝐀𝐆𝐄 ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix
        } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
        const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = description ? `Description: ${description}\n` : '';
        const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
        const versionMessage = version ? `➛ Version: ${version}\n` : '';
        const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
        const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.handleEvent = async function({
  api,
  event,
  prefix
}) {
  const {
    threadID,
    messageID,
    body
  } = event;
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry i don't have prefix";
  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(message, threadID, messageID);
  }
}
