const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
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
  name: "carrera",
  description: "Participa en una carrera de autos y prueba tu suerte.",
  commands: ["carrera"],
  usage: `${PREFIX}carrera`,
  handle: async ({ sendReply, sendReact, userJid }) => {
    // Leer saldo de monedas
    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
    }

    // Verificar si tiene monedas suficientes
    if (userKr.kr < 10) {
      await sendReply("❌ No tienes suficientes chelitos para entrar a la carrera. Necesitas 10 monedas.");
      return;
    }

    // Restar costo de participación
    userKr.kr -= 10;
    writeData(krFilePath, krData);

    // Animación de la carrera con reacciones
    await sendReact("🏎️");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("💨");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("🏁");

    // Determinar si gana o pierde (50% de probabilidad)
    const gano = Math.random() < 0.5;
    let respuesta;

    if (gano) {
      // Ganó la carrera
      const premio = 20;
      userKr.kr += premio;
      respuesta = [
        "🔥 Metiste nitro en la última curva y dejaste a todo el mundo atrás. ¡Ganaste *20 monedas*!",
        "🚀 ¡Parecías un F1 en la pista! Te llevaste la carrera y *20 monedas* de premio.",
        "😎 Dema', el motor tuyo es un avión. Primera posición y *20 monedas* pa' ti."
      ];
    } else {
      // Perdió la carrera
      respuesta = [
        "💨 Tu carro se apagó en la salida, bro… la carrera no era pa’ ti esta vez.",
        "🚗💨 Metiste el cambio mal y te pasaron como si fueras un triciclo. Perdiste la carrera.",
        "🔥 Te confiaron con la arrancada y al final te comieron vivo. No ganaste esta vez."
      ];
    }

    // Guardar cambios en monedas
    writeData(krFilePath, krData);

    // Enviar respuesta aleatoria
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(respuesta[Math.floor(Math.random() * respuesta.length)]);

    // Mostrar saldo actualizado
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(`> 💰 Tu saldo actual es: *${userKr.kr} monedas* 𝙺𝚛`);
  },
};