const { PREFIX } = require("../../config");

module.exports = {
  name: "reacciones",
  description: "Reacciona con emojis a palabras específicas usando comandos.",
  commands: [
    "soky", "maicol", "olo", "stacy", "gigi", "diamantico", "hustle", "edwin",
    "alexander", "cameron", "krampus", "joan", "amor", "bb", "bebe", "mia",
    "cuero", "klk", "barry"
  ],
  usage: `${PREFIX}<comando>`,
  handle: async ({ command, sendReact, sendReply }) => {
    // Mapeo de comandos a emojis
    const reactions = {
      soky: "🏳️‍🌈",
      maicol: "🛵",
      olo: "🎸",
      stacy: "🕊️",
      gigi: "🧚‍♀️",
      diamantico: "🥊",
      hustle: "🤥",
      edwin: "🦄",
      alexander: "🫎",
      cameron: "🦐",
      krampus: "🦇",
      joan: "👨🏾‍🦽",
      amor: "🫦",
      bb: "💋",
      bebe: "💋",
      mia: "👀",
      cuero: "🧚‍♀️",
      klk: "🇩🇴",
      barry: "🍄",
    };

    // Verificar si el comando tiene una reacción
    const emoji = reactions[command];
    if (!emoji) {
      await sendReply("Comando inválido. Usa uno de los comandos disponibles.");
      return;
    }

    // Enviar la reacción al comando
    await sendReact(emoji);
    await sendReply(`Reaccioné con: ${emoji}`);
  },
};