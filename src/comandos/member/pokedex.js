const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const userPokemonsFilePath = path.resolve(process.cwd(), "assets/userPokemons.json");

module.exports = {
  name: "pokédex",
  description: "Muestra los Pokémon comprados por el usuario.",
  commands: ["pokedex"],
  usage: `${PREFIX}pokédex`,
  handle: async ({ socket, remoteJid, userJid, quoted }) => {
    let userPokemons = readData(userPokemonsFilePath);

    // Verificar si el usuario tiene Pokémon
    if (!userPokemons[userJid] || userPokemons[userJid].length === 0) {
      await socket.sendMessage(remoteJid, {
        text: "❌ No tienes Pokémon en tu colección.",
        quoted: quoted // Responde al mensaje del usuario
      });
      return;
    }

    // Obtener los Pokémon del usuario
    const pokemons = userPokemons[userJid];

    // Crear un mensaje con los Pokémon comprados
    let pokedexMessage = "📜 *Pokédex del entrenador*\n\n";
    pokemons.forEach((pokemon) => {
      pokedexMessage += `🔹 *${pokemon}*\n`;
    });

    // Enviar el mensaje con el GIF de la Pokédex como respuesta
    await socket.sendMessage(remoteJid, {
      video: fs.readFileSync("assets/sx/pokedex.mp4"),
      caption: pokedexMessage,
      gifPlayback: true,
      quoted: quoted // Responde al mensaje del usuario
    });
  },
};

// Función para leer los datos del archivo
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {}; // Si hay un error, devolvemos un objeto vacío
  }
};