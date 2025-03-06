const { PREFIX } = require("../../krampus");

module.exports = {
  name: "invitar",
  description: "Invita a un usuario a un grupo de WhatsApp.",
  commands: ["invitar"],
  usage: `${PREFIX}invitar`,
  handle: async ({ socket, remoteJid }) => {
    const mensaje = "Hola, únete a nuestro grupo de WhatsApp.";
    const link = "https://chat.whatsapp.com/...";

    await socket.sendMessage(remoteJid, {
      text: mensaje,
      buttons: [
        {
          url: link,
          text: "Únete",
        },
      ],
      contextInfo: {
        isForwarded: true, // Indica que es un mensaje reenviado
        forwardingScore: 2, // Hace que parezca más reenviado
        participant: "1203630250000000@c.us", // Reemplaza con el JID del canal
        externalAdReply: {
          title: "Krampus OM bot",
          body: "Mensaje reenviado desde el canal oficial",
          thumbnailUrl: "https://example.com/imagen.jpg", // Imagen opcional
          sourceUrl: link, // Puedes enlazarlo a la invitación o a otro sitio
        },
      },
    });
  },
};