const { PREFIX } = require("../../config");

module.exports = {
  name: "tag",
  description: "Para fijar mensajes",
  commands: ["krampus-bot", "todos"],
  usage: `${PREFIX}hidetag motivo`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendReact("📌");

    await sendText(`> ╚════ KrampusBot ═════╝
      !\n\n${fullArgs}`, mentions);
  },
};