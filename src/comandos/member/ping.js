const { PREFIX } = require("../../krampus");

module.exports = {
  name: "ping",
  description: "Verificar se o bot está online",
  commands: ["ping"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }) => {
    const startTime = Date.now();
    await sendReact("👻");
    const endTime = Date.now();
    const latency = endTime - startTime;
    const speed = latency.toFixed(2) + "ms";
    await sendReply(`Velocidad de respuesta: ${speed}\n> Soky OM bot`);
  },
};


