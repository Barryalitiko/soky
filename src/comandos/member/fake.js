const { PREFIX } = require("../../krampus");

module.exports = {
  name: "fake",
  description: "Cita falsamente un mensaje del usuario y responde con 'soky bot'.",
  commands: ["fake"],
  usage: `${PREFIX}fake [mensaje a citar]`,
  handle: async ({ args, socket, remoteJid }) => {
    if (!args.length) {
      await socket.sendMessage(remoteJid, {
        text: "Escribe el mensaje que se usará como cita falsa.\nEjemplo: #fake este mensaje será citado",
      });
      return;
    }

    const mensajeCitado = args.join(" ");
    const numero = remoteJid.split("@")[0] + "@s.whatsapp.net";

    const fakeQuoted = {
      key: {
        remoteJid: remoteJid,
        fromMe: false,
        id: "FAKE-QUOTE-SOKY",
        participant: numero,
      },
      message: {
        conversation: mensajeCitado,
      },
    };

    await socket.sendMessage(remoteJid, {
      text: "soky bot",
    }, { quoted: fakeQuoted });
  },
};