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

      let helpMessage = `ðŸŸ¢ðŸŸ¡ðŸ”´ ð™¼ðšˆ ð™°ðš…ð™°ð™¸ð™»ð™°ð™±ð™»ð™´ ð™²ð™¾ð™¼ð™¼ð™°ð™½ð™³ðš‚:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {

        helpMessage += `\t${i + 1}. 
â•­â”€â•¼â”â”â”â”â”â”â”â”â•¾â”€â•®
    ${prefix}${commands[i]}
â•°â”€â”â”â”â”â”â”â”â”â”â•¾â”€â•¯
\n`;

      }

      helpMessage += '\nðŸ”´ðŸŸ¡ðŸŸ¢ð™´ðš…ð™´ð™½ðšƒ ð™»ð™¸ðš‚ðšƒ:\n\n';

      eventCommands.forEach((eventCommand, index) => {

        helpMessage += `\t${index + 1}. â•­â”€â•¼â”â”â”â”â”â”â”â”â•¾â”€â•®
    ${prefix}${eventCommand}
â•°â”€â”â”â”â”â”â”â”â”â”â•¾â”€â•¯\n`;

      });

      helpMessage += `\nðŸŸ¡ðŸŸ¢ðŸ”´ ð™¿ð™°ð™¶ð™´ ${page}/${Math.ceil(commands.length / pages)}. ðšƒð™¾ ðš…ð™¸ð™´ðš† ðšƒð™·ð™´ ð™½ð™´ðš‡ðšƒ ð™¿ð™°ð™¶ð™´, ðšƒðšˆð™¿ð™´ '${prefix}ð™·ð™´ð™»ð™¿ ð™¿ð™°ð™¶ð™´ number'. ðšƒð™¾ ðš…ð™¸ð™´ðš† ð™¸ð™½ð™µð™¾ðšð™¼ð™°ðšƒð™¸ð™¾ð™½ ð™°ð™±ð™¾ðš„ðšƒ ð™° ðš‚ð™¿ð™´ð™²ð™¸ð™µð™¸ð™² ð™²ð™¾ð™¼ð™¼ð™°ð™½ð™³, ðšƒðšˆð™¿ð™´ '${prefix}ð™·ð™´ð™»ð™¿ ð™²ð™¾ð™¼ð™¼ð™°ð™½ð™³ ð™½ð™°ð™¼ð™´.`;

      api.sendMessage(helpMessage, event.threadID, event.messageID);

    } else if (!isNaN(input)) {

      const page = parseInt(input);

      const pages = 20;

      let start = (page - 1) * pages;

      let end = start + pages;

      let helpMessage = `ðŸŸ¢ðŸŸ¡ðŸ”´ ð™¼ðšˆ ð™°ðš…ð™°ð™¸ð™»ð™°ð™±ð™»ð™´ ð™²ð™¾ð™¼ð™¼ð™°ð™½ð™³ðš‚:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {

        helpMessage += `\t${i + 1}.
â•­â”€â•¼â”â”â”â”â”â”â”â”â•¾â”€â•®
    ${prefix}${commands[i]} 
â•°â”€â”â”â”â”â”â”â”â”â”â•¾â”€â•¯\n`;

      }

      helpMessage += '\nðŸ”´ðŸŸ¡ðŸŸ¢ ð™´ðš…ð™´ð™½ðšƒ ð™»ð™¸ðš‚ðšƒ:\n\n';

      eventCommands.forEach((eventCommand, index) => {

        helpMessage += `\t${index + 1}. â•­â”€â•¼â”â”â”â”â”â”â”â”â•¾â”€â•®
    ${prefix}${eventCommand} 
â•°â”€â”â”â”â”â”â”â”â”â”â•¾â”€â•¯\n`;

      });

      helpMessage += `\nðŸŸ¢ðŸŸ¡ðŸ”´ ð™¿ð™°ð™¶ð™´ ${page} of ${Math.ceil(commands.length / pages)}`;

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

        const roleMessage = role !== undefined ? (role === 0 ? 'âž› Permission: user' : (role === 1 ? 'âž› Permission: admin' : (role === 2 ? 'âž› Permission: thread Admin' : (role === 3 ? 'âž› Permission: super Admin' : '')))) : '';

        const aliasesMessage = aliases.length ? `âž› Aliases: ${aliases.join(', ')}\n` : '';

        const descriptionMessage = description ? `Description: ${description}\n` : '';

        const usageMessage = usage ? `âž› Usage: ${usage}\n` : '';

        const creditsMessage = credits ? `âž› Credits: ${credits}\n` : '';

        const versionMessage = version ? `âž› Version: ${version}\n` : '';

        const cooldownMessage = cooldown ? `âž› Cooldown: ${cooldown} second(s)\n` : '';

        const message = ` ã€Œ Command ã€\n\nâž› Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;

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
  

    
      