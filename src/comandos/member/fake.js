const { PREFIX } = require("../../krampus");

module.exports = {
  name: "fake",
  description: "Cita falsamente a la persona respondida, usando el texto que escribas.",
  commands: ["fake"],
  usage: `${PREFIX}fake [mensaje a citar] (responde al mensaje de alguien)`,
  handle: async ({ args, socket, remoteJid, quoted }) => {
    if (!args.length || !quoted) {
      await socket.sendMessage(remoteJid, {
        text: "Debes responder al mensaje de alguien y escribir el texto a citar.\nEjemplo: (responde a un mensaje) #fake esto dijiste tú",
      });
      return;
    }

    const mensajeCitado = args.join(" ");
    const numeroRespondido = quoted.key.participant || quoted.participant || quoted.key.remoteJid;

    const fakeQuoted = {
      key: {
        remoteJid: remoteJid,
        fromMe: false,
        id: "FAKE-QUOTE-SOKY",
        participant: numeroRespondido,
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