const { PREFIX } = require("../../config");

const commands = [
  { command: "soky", reaction: "🏳️‍🌈" },
  { command: "maicol", reaction: "🛵" },
  { command: "olo", reaction: "🎸" },
  { command: "stacy", reaction: "🕊️" },
  { command: "gigi", reaction: "🧚‍♀️" },
  { command: "diamantico", reaction: "🥊" },
  { command: "hustle", reaction: "🤥" },
  { command: "edwin", reaction: "🦄" },
  { command: "alexander", reaction: "🫎" },
  { command: "cameron", reaction: "🦐" },
  { command: "krampus", reaction: "🦇" },
  { command: "joan", reaction: "👨🏾‍🦽" },
  { command: "amor", reaction: "🫦" },
  { command: "bb", reaction: "💋" },
  { command: "bebe", reaction: "💋" },
  { command: "mia", reaction: "👀" },
  { command: "cuero", reaction: "🧚‍♀️" },
  { command: "klk", reaction: "🇩🇴" },
  { command: "barry", reaction: "🍄" },
];

module.exports = {
  name: "emoji-reaction",
  description: "Reacciona a comandos específicos con emojis",
  handle: async ({ args, sendReaction, message }) => {
    if (!args.length) return;

    // Extraer el comando y verificar si coincide con alguno de la lista.
    const inputCommand = args[0].toLowerCase().replace(PREFIX, "");
    const matchedCommand = commands.find(
      (cmd) => `${PREFIX}${cmd.command}` === `${PREFIX}${inputCommand}`
    );

    if (matchedCommand) {
      await sendReaction(matchedCommand.reaction);
    }
  },
};