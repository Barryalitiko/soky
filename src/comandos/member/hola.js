const { PREFIX } = require("../../krampus");
const path = require("path");

module.exports = {
  name: "invitar",
  description: "Invita a un usuario a un grupo de WhatsApp.",
  commands: ["invitar"],
  usage: `${PREFIX}invitar`,
  handle: async ({ socket, remoteJid }) => {
    const mensaje = "Hola, únete a nuestro grupo de WhatsApp.";
    const link = "https://www.instagram.com/krampusom?igsh=aXJ5OWViMzYweHAw&utm_source=qr";

    await socket.sendMessage(remoteJid, {
      text: mensaje,
      buttons: [
        {
          url: link,
          text: "Únete",
        },
      ],
      contextInfo: {
        isForwarded: true,
        forwardingScore: 2,
        participant: "1203630250000000@c.us",
        externalAdReply: {
          title: "Krampus OM bot",
          body: "Operacion Marshall",
          thumbnailUrl: `file://${path.resolve(__dirname, "../../../assets/images/IMG-20250306-WA0001.jpg")}`,
          sourceUrl: link,
        },
      },
    });
  },
};
