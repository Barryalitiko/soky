Para enviar el GIF pokedex.mp4 junto con el mensaje de la Pokédex, debes modificar sendReply para que envíe un mensaje con el video. Aquí está el código actualizado:

Código modificado:

const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const userPokemonsFilePath = path.resolve(process.cwd(), "assets/userPokemons.json");

module.exports = {
  name: "pokédex",
  description: "Muestra los Pokémon comprados por el usuario.",
  commands: ["pokedex"],
  usage: `${PREFIX}pokédex`,
  handle: async ({ socket, remoteJid, userJid }) => {
    let userPokemons = readData(userPokemonsFilePath);

    // Verificar si el usuario tiene Pokémon
    if (!userPokemons[userJid] || userPokemons[userJid].length === 0) {
      await socket.sendMessage(remoteJid, {
        text: "❌ No tienes Pokémon en tu colección."
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

    // Enviar el mensaje con el GIF de la Pokédex
    await socket.sendMessage(remoteJid, {
      video: fs.readFileSync("assets/sx/pokedex.mp4"),
      caption: pokedexMessage,
      gifPlayback: true
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

Cambios realizados:
	1.	Agregué socket y remoteJid en handle para poder enviar el video.
	2.	Cambié sendReply por socket.sendMessage, ya que sendReply solo envía texto.
	3.	Incluí el GIF pokedex.mp4 con gifPlayback: true para que se reproduzca como GIF en WhatsApp.
	4.	Mejoré el formato del mensaje, agregando un título y emojis para que se vea mejor.

Ahora, cuando un usuario use !pokedex, verá su lista de Pokémon junto con la animación de la Pokédex.