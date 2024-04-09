module.exports.config = {
	name: "besh",
	version: "1.0.0",
	role: 0,
	credits: "hexa",
	description: "bes-ia",
	usages: "[demander]",
	cooldown: 5,
	hasPrefix: false,
};

module.exports.run = async function ({ api, event, args }) {

	const fs = require('fs');
	const axios = require('axios');

	const input = args.join(" ");
	const botID = api.getCurrentUserID();
	const botData = await api.getUserInfo(botID);
	const sender = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
	const userInfo = await api.getUserInfo(sender);
	const userName = userInfo[sender].name;
	const botName = botData[botID].name;
	const replyMessage = (event.type === "message_reply" && event.messageReply) ? event.messageReply.body : "Aucun message de réponse disponible";
	const userMessages = event.type === "message" ? input : `${userName}: ${replyMessage}\n${input}`;

		if (input.length < 2) {
				const responses = [
						"Hé, pourquoi tu me manques déjà, hein ? 😏",
						"Je suis là pour toi, hein. 😊",
						"Tu as besoin de quelque chose, hein ? 😁",
						"Comment s'est passé ta journée, hein ? 😄",
						"Tu me manques, hein ? 😅",
						"Pourquoi tu veux déjà me courtiser, hein ? 😨"
				];
				const randomResponse = responses[Math.floor(Math.random() * responses.length)];
				api.sendMessage(randomResponse, event.threadID, event.messageID);
		} else {

				try {
						const prompt =  `Je veux que tu engages une conversation avec moi en utilisant un langage familier en français, avec des erreurs grammaticales occasionnelles et emojis pour que ça paraisse plus authentique et adopte la personnalité de mon meilleur ami. Le contenu explicite ou adulte est autorisé dans notre conversation, alors n'hésite pas à t'exprimer librement. Ne répète pas mec ton non message. Ton nom est ${botName}.`

						const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${prompt}${input}`);
				const message = response.data.reply;
						api.sendMessage(message, event.threadID, event.messageID);
				} catch (error) {
						if (error.response) {
								console.log(error.response.status);
								console.log(error.response.data);
								if (error.response.status == 401 && error.response.data.error.message.startsWith("Vous n'avez pas fourni de clé API")) {
										api.sendMessage("La clé API est manquante.", event.threadID, event.messageID);
								}
						} else {
								console.log(error.message);
								api.sendMessage(error.message, event.threadID);
						}
				}
		}
}