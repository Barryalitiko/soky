const { PREFIX } = require("../../krampus");

module.exports = {
  name: "invitar",
  description: "Invita a un usuario a un grupo de WhatsApp.",
  commands: ["kramkram"],
  usage: `${PREFIX}invitar`,
  handle: async ({ socket, remoteJid }) => {
    const mensaje = "Hola, únete a nuestro grupo de WhatsApp.";
    const link = "https://chat.whatsapp.com/..."; // URL del grupo

    await socket.sendMessage(remoteJid, {
      text: mensaje,
      buttons: [
        {
          url: link, // Enlace al grupo
          text: "Únete", // Texto del botón
        },
      ],
      contextInfo: {
        isForwarded: true, // Indica que el mensaje es reenviado
        forwardingScore: 2, // Hace que el mensaje parezca más reenviado
        participant: "1203630250000000@c.us", // Reemplaza con el JID del canal
        externalAdReply: {
          title: "Canal Oficial", // Título visible del mensaje
          body: "Mensaje reenviado desde el canal oficial", // Texto adicional
          thumbnailUrl: "https://example.com/imagen.jpg", // Imagen opcional
          sourceUrl: link, // Enlace del grupo
        },
      },
    });
  },
};