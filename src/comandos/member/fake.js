const { PREFIX } = require("../../krampus");

module.exports = {
  name: "fake",
  description: "Falsifica una cita de la persona a la que respondes con el texto que escribas.",
  commands: ["fake"],
  usage: `${PREFIX}fake [texto] (responde al mensaje de alguien)`,
  handle: async ({ args, socket, remoteJid, quoted }) => {
    if (!args.length || !quoted) {
      await socket.sendMessage(remoteJid, {
        text: "Debes responder al mensaje de alguien y escribir el texto a citar.\nEjemplo: (responde a un mensaje) #fake esto dijiste tú",
      });
      return;
    }

    const mensajeCitado = args.join(" ");

    // Mostrar qué viene en quoted
    console.log("quoted.key:", quoted.key);
    console.log("quoted.key.participant:", quoted.key.participant);
    console.log("quoted.key.remoteJid:", quoted.key.remoteJid);

    const numeroRespondido =
      quoted.key.participant || // En grupos
      quoted.key.remoteJid ||   // En privados
      "0@s.whatsapp.net";       // Fallback de seguridad

    console.log("Número detectado:", numeroRespondido);

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