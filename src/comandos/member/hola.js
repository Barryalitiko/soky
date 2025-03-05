const { PREFIX } = require("../../krampus");

module.exports = {
  name: "invitar",
  description: "Invita a un usuario a un grupo de WhatsApp.",
  commands: ["invitar"],
  usage: `${PREFIX}invitar`,
  handle: async ({ sendReply, socket, userJid, remoteJid }) => {
    const mensaje = "Hola";
    const link = "https://chat.whatsapp.com/...";

    await socket.sendMessage(remoteJid, {
      text: mensaje,
      buttons: [
        {
          url: link,
          text: "Únete",
        },
      ],
    });
  },
};
