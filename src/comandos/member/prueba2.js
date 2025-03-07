const { PREFIX } = require("../../krampus");

module.exports = {
  name: "modificar",
  description: "Envía un mensaje que se modifica después de 3 segundos",
  commands: ["modificar"],
  usage: `${PREFIX}modificar`,
  handle: async ({ sendReply, socket, remoteJid }) => {
    try {
      // Enviar el mensaje inicial "Hola"
      const mensajeOriginal = await socket.sendMessage(remoteJid, {
        text: "Hola",
      });

      // Obtener el messageId del mensaje original
      const messageId = mensajeOriginal.key.id;

      // Esperar 3 segundos antes de modificar el mensaje
      setTimeout(async () => {
        // Modificar el mensaje
        await socket.sendMessage(remoteJid, {
          text: "Adiós",
          quoted: mensajeOriginal, // Modificar el mensaje original
        });

        // Confirmar que el mensaje fue editado
        await sendReply("El mensaje ha sido modificado a 'Adiós'.");
      }, 3000); // 3000 milisegundos (3 segundos)
    } catch (error) {
      console.error("Error en el comando modificar:", error);
      await sendReply("❌ Ocurrió un error al modificar el mensaje.");
    }
  },
};