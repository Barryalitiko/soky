const { PREFIX, ASSETS_DIR } = require("../../config");
const path = require("path");

module.exports = {
  name: "tag",
  description: "Para fijar mensajes",
  commands: ["tag", "t"],
  usage: `${PREFIX}hidetag motivo`,
  handle: async ({
    fullArgs,
    sendText,
    sendImageFromFile,
    socket,
    remoteJid,
    sendReact,
  }) => {
    const { participants } = await socket.groupMetadata(remoteJid);
    const mentions = participants.map(({ id }) => id);

    await sendReact("📌");

    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", "tag.jpg"),
      `📌
      > ╚════ KrampusBot ════╝
      \n\n${fullArgs}`, mentions);
  },
};
