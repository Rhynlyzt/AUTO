module.exports.config = {
  name: "accept",
  version: "1.0.0",
  commands: ["accept"] // Command aliases
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length !== 1) {
      return api.sendMessage("Please provide the UID of the user you want to accept the friend request from.", event.threadID);
    }

    const uid = args[0]; // Extract the UID from the command arguments

    // Send the friend request using the provided UID
    await api.acceptFriendRequest(uid);

    // Send a confirmation message
    api.sendMessage(`Friend request from user with UID ${uid} has been accepted.`, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};