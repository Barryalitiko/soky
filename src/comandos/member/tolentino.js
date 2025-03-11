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
      { message: "Tolentino te tumbó por no entender el chisme, perdiste 7 monedas.", effect: -7 },
      { message: "Tolentino te dio una primicia, ganaste 18 monedas.", effect: 18 },
      { message: "Tolentino te tumbó por no prestar atención al chisme, perdiste 6 monedas.", effect: -6 },
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
      { message: "Tolentino te invitó a un encuentro, ganaste 14 monedas.", effect: 14 },
       { message: "Tolentino te mencionó en su programa y ganaste 12 monedas.", effect: 12 },
  { message: "Tolentino te ignoró en vivo y perdiste 6 monedas.", effect: -6 },
  { message: "Tolentino te hizo trending topic, ganaste 18 monedas.", effect: 18 },
  { message: "Tolentino te dejó en visto y perdiste 4 monedas.", effect: -4 },
  { message: "Tolentino te pasó un dato exclusivo, ganaste 15 monedas.", effect: 15 },
  { message: "Tolentino te sacó del aire por interrumpir, perdiste 7 monedas.", effect: -7 },
  { message: "Tolentino te dio una primicia caliente, ganaste 10 monedas.", effect: 10 },
  { message: "Tolentino te bloqueó por mandar demasiados mensajes, perdiste 5 monedas.", effect: -5 },
  { message: "Tolentino te dejó dar una exclusiva, ganaste 20 monedas.", effect: 20 },
  { message: "Tolentino te desenmascaró en vivo y perdiste 12 monedas.", effect: -12 },
  { message: "Tolentino te invitó a una entrevista y ganaste 16 monedas.", effect: 16 },
  { message: "Tolentino te cortó la llamada en vivo, perdiste 9 monedas.", effect: -9 },
  { message: "Tolentino te sacó en su canal y te mandaron 14 monedas.", effect: 14 },
  { message: "Tolentino te quitó la primicia, perdiste 8 monedas.", effect: -8 },
  { message: "Tolentino te dejó hablar en su podcast, ganaste 11 monedas.", effect: 11 },
  { message: "Tolentino te frenó el chisme, perdiste 6 monedas.", effect: -6 },
  { message: "Tolentino te recomendó en la farándula y ganaste 17 monedas.", effect: 17 },
  { message: "Tolentino te desmintió en vivo y perdiste 10 monedas.", effect: -10 },
  { message: "Tolentino te pasó un contacto valioso, ganaste 13 monedas.", effect: 13 },
  { message: "Tolentino te mandó un mensaje cifrado y perdiste 5 monedas.", effect: -5 },
  { message: "Tolentino te hizo tendencia y ganaste 19 monedas.", effect: 19 },
  { message: "Tolentino te mandó a leer más antes de opinar, perdiste 7 monedas.", effect: -7 },
  { message: "Tolentino te defendió de un chisme falso y ganaste 14 monedas.", effect: 14 },
  { message: "Tolentino te tumbó la película y perdiste 11 monedas.", effect: -11 },
  { message: "Tolentino te incluyó en un debate importante y ganaste 10 monedas.", effect: 10 },
  { message: "Tolentino te dejó sin palabras en vivo, perdiste 9 monedas.", effect: -9 },
  { message: "Tolentino te pasó un dato exclusivo, ganaste 15 monedas.", effect: 15 },
  { message: "Tolentino te criticó en su programa y perdiste 8 monedas.", effect: -8 },
  { message: "Tolentino te invitó a su estudio y ganaste 12 monedas.", effect: 12 },
  { message: "Tolentino te bajó de la nube y perdiste 7 monedas.", effect: -7 },
  { message: "Tolentino te dejó dar una opinión clave, ganaste 14 monedas.", effect: 14 },
  { message: "Tolentino te ignoró en un panel y perdiste 6 monedas.", effect: -6 },
  { message: "Tolentino te dejó ser parte del análisis y ganaste 16 monedas.", effect: 16 },
  { message: "Tolentino te expuso por hablar sin pruebas, perdiste 9 monedas.", effect: -9 },
  { message: "Tolentino te invitó a su transmisión y ganaste 11 monedas.", effect: 11 },
  { message: "Tolentino te tumbó el argumento, perdiste 10 monedas.", effect: -10 },
  { message: "Tolentino te puso como fuente confiable, ganaste 13 monedas.", effect: 13 },
  { message: "Tolentino te mandó un mensaje subliminal, perdiste 5 monedas.", effect: -5 },
  { message: "Tolentino te ayudó a subir en la farándula, ganaste 18 monedas.", effect: 18 },
  { message: "Tolentino te sacó en un caso serio y perdiste 12 monedas.", effect: -12 },
  { message: "Tolentino te apoyó en redes y ganaste 17 monedas.", effect: 17 },
  { message: "Tolentino te ignoró en la calle y perdiste 8 monedas.", effect: -8 },
  { message: "Tolentino te invitó a un foro exclusivo y ganaste 15 monedas.", effect: 15 },
  { message: "Tolentino te bajó de la nube con pruebas, perdiste 9 monedas.", effect: -9 },
  { message: "Tolentino te incluyó en una investigación especial, ganaste 20 monedas.", effect: 20 },
  { message: "Tolentino te cortó la llamada en pleno debate, perdiste 10 monedas.", effect: -10 },
  { message: "Tolentino te dejó hablar sin interrupciones, ganaste 14 monedas.", effect: 14 },
  { message: "Tolentino te desenmascaró en vivo y perdiste 13 monedas.", effect: -13 },
  { message: "Tolentino te recomendó en un reportaje, ganaste 16 monedas.", effect: 16 },
  { message: "Tolentino te tumbó la historia por falta de pruebas, perdiste 7 monedas.", effect: -7 },
  { message: "Tolentino te dio un reconocimiento, ganaste 19 monedas.", effect: 19 },
  { message: "Tolentino te hizo perder credibilidad, perdiste 11 monedas.", effect: -11 },
  { message: "Tolentino te incluyó en un proyecto especial, ganaste 18 monedas.", effect: 18 },
  { message: "Tolentino te desmontó el cuento y perdiste 9 monedas.", effect: -9 },
  { message: "Tolentino te mencionó como experto y ganaste 12 monedas.", effect: 12 },
  { message: "Tolentino te dejó fuera de un evento y perdiste 6 monedas.", effect: -6 },
  { message: "Tolentino te entrevistó en exclusiva, ganaste 15 monedas.", effect: 15 },
  { message: "Tolentino te sacó del aire por polémico, perdiste 8 monedas.", effect: -8 },
  { message: "Tolentino te apoyó en una controversia, ganaste 14 monedas.", effect: 14 },
  { message: "Tolentino te hizo perder confianza del público, perdiste 10 monedas.", effect: -10 },
  { message: "Tolentino te metió en una discusión de expertos, ganaste 13 monedas.", effect: 13 },
  { message: "Tolentino te quitó el micrófono en plena transmisión, perdiste 7 monedas.", effect: -7 },
  { message: "Tolentino te dejó dar una primicia importante, ganaste 17 monedas.", effect: 17 },
  { message: "Tolentino te bajó la película en vivo, perdiste 12 monedas.", effect: -12 }
    ];

    // Elegir una acción aleatoria
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    // Aplicar el cambio de monedas
    userKr.kr += randomAction.effect;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    // Reacción inicial con ⏳
    await sendReact("⏳");

    // Esperar 3 segundos antes de cambiar la reacción
    setTimeout(async () => {
      if (randomAction.effect > 0) {
        await sendReact("🤗");
      } else {
        await sendReact("⏰");
      }

      // Enviar un mensaje único con la acción y el saldo actualizado
      await sendReply(`${randomAction.message}\n\n> 💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);
    }, 3000);
  }
};