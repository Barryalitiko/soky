const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const usageStatsFilePath = path.resolve(process.cwd(), "assets/usageStats.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}: ${error.message}`);
  }
};

module.exports = {
  name: "tolentino",
  description: "Recibe una acción buena o mala de Tolentino.",
  commands: ["tolentino"],
  usage: `${PREFIX}tolentino`,
  handle: async ({ sendReply, sendReact, userJid }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de Tolentino está desactivado.");
      return;
    }

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    // Lista de 50 posibles acciones con Tolentino
    const actions = [
      { message: "Tolentino te subió el ánimo y te regaló 10 monedas.", effect: 10 },
      { message: "Tolentino te dijo que te caíste del chisme y perdiste 5 monedas.", effect: -5 },
      { message: "Tolentino te invitó a una fiesta, ganaste 15 monedas.", effect: 15 },
      { message: "Tolentino te tumbó por andar metido en líos, perdiste 8 monedas.", effect: -8 },
      { message: "Tolentino te dio un consejo, ganaste 7 monedas.", effect: 7 },
      { message: "Tolentino te quitó unas monedas por no hacerle caso, perdiste 4 monedas.", effect: -4 },
      { message: "Tolentino te dio el número de una fuente, ganaste 12 monedas.", effect: 12 },
      { message: "Tolentino te bajó de la nube y perdiste 6 monedas.", effect: -6 },
      { message: "Tolentino te regañó por no saber algo, perdiste 3 monedas.", effect: -3 },
      { message: "Tolentino te pidió una ayuda y ganaste 20 monedas.", effect: 20 },
      { message: "Tolentino te dejó entrar a la fuente, ganaste 5 monedas.", effect: 5 },
      { message: "Tolentino te subió a la ola y perdiste 10 monedas.", effect: -10 },
      { message: "Tolentino te invitó al junte y ganaste 8 monedas.", effect: 8 },
      { message: "Tolentino te tumbó por meterte en cosas raras, perdiste 7 monedas.", effect: -7 },
      { message: "Tolentino te dio una primicia, ganaste 18 monedas.", effect: 18 },
      { message: "Tolentino te tumbó por no entender el chisme, perdiste 6 monedas.", effect: -6 },
      { message: "Tolentino te dio el scoop, ganaste 10 monedas.", effect: 10 },
      { message: "Tolentino te dijo que no ibas a entender, perdiste 3 monedas.", effect: -3 },
      { message: "Tolentino te mandó a callar y te quitó 5 monedas.", effect: -5 },
      { message: "Tolentino te hizo un favor y ganaste 12 monedas.", effect: 12 },
      { message: "Tolentino te bajó de la nube y te quitó 9 monedas.", effect: -9 },
      { message: "Tolentino te sorprendió con un chisme, ganaste 14 monedas.", effect: 14 },
      { message: "Tolentino te castigó por hablar demasiado, perdiste 6 monedas.", effect: -6 },
      { message: "Tolentino te invitó a un evento exclusivo, ganaste 15 monedas.", effect: 15 },
      { message: "Tolentino te tumbó el chisme y perdiste 11 monedas.", effect: -11 },
      { message: "Tolentino te sorprendió con una primicia, ganaste 9 monedas.", effect: 9 },
      { message: "Tolentino te invitó a la tertulia, ganaste 10 monedas.", effect: 10 },
      { message: "Tolentino te tiró el chisme y perdiste 7 monedas.", effect: -7 },
      { message: "Tolentino te hizo un descuento, ganaste 6 monedas.", effect: 6 },
      { message: "Tolentino te bajó de la nube por hablar de más, perdiste 5 monedas.", effect: -5 },
      { message: "Tolentino te mandó a callar en público, perdiste 4 monedas.", effect: -4 },
      { message: "Tolentino te soltó una primicia, ganaste 18 monedas.", effect: 18 },
      { message: "Tolentino te mandó un mensaje, ganaste 6 monedas.", effect: 6 },
      { message: "Tolentino te regañó por estar en la calle, perdiste 9 monedas.", effect: -9 },
      { message: "Tolentino te hizo un favor y ganaste 20 monedas.", effect: 20 },
      { message: "Tolentino te tumbó por no prestarle atención, perdiste 5 monedas.", effect: -5 },
      { message: "Tolentino te invitó al chisme y ganaste 15 monedas.", effect: 15 },
      { message: "Tolentino te bajó del cuento y te quitó 8 monedas.", effect: -8 },
      { message: "Tolentino te hizo un truco y ganaste 10 monedas.", effect: 10 },
      { message: "Tolentino te dijo que no hables más, perdiste 3 monedas.", effect: -3 },
      { message: "Tolentino te dio el tip y ganaste 12 monedas.", effect: 12 },
      { message: "Tolentino te tumbó por hablar de más, perdiste 4 monedas.", effect: -4 },
      { message: "Tolentino te invitó a compartir y ganaste 11 monedas.", effect: 11 },
      { message: "Tolentino te tumbó por hablar mal, perdiste 9 monedas.", effect: -9 },
      { message: "Tolentino te ayudó con el chisme y ganaste 13 monedas.", effect: 13 },
      { message: "Tolentino te tumbó por un mal consejo, perdiste 10 monedas.", effect: -10 },
      { message: "Tolentino te dijo que sigas tranquilo, ganaste 8 monedas.", effect: 8 },
      { message: "Tolentino te bajó de la nube por hablar demasiado, perdiste 6 monedas.", effect: -6 },
      { message: "Tolentino te invitó a un encuentro, ganaste 14 monedas.", effect: 14 }
    ];

    // Elegir una acción aleatoria
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    // Aplicar el cambio de monedas
    userKr.kr += randomAction.effect;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    // Enviar el mensaje de la acción
    await sendReply(randomAction.message);
    await sendReply(`upss\n> 💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);

    // Reacción según el efecto de la acción
    if (randomAction.effect > 0) {
      await sendReact("🤗");
    } else {
      await sendReact("⏰");
    }
  }
};