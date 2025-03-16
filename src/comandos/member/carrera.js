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
    await sendReact("🛵");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("💨");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("🏁");

    // Determinar si gana o pierde (50% de probabilidad)
    const gano = Math.random() < 0.5;
    let respuesta;

    const frasesGanar = [
      "🔥 Metiste nitro en la última curva y dejaste a todo el mundo atrás. ¡Ganaste *100 monedas*!",
      "🚀 ¡Parecías un F1 en la pista! Te llevaste la carrera y *100 monedas* de premio.",
      "😎 Dema', el motor tuyo es un avión. Primera posición y *100 monedas* pa' ti.",
      "🏎️ Te fuiste en una y cruzaste la meta como un relámpago. *100 monedas* más en tu bolsillo.",
      "💨 Dejaste a los demás tragando humo. Victoria fácil y *100 monedas* para ti.",
      "🔥 Tu motor rugió como un león y te llevaste la carrera. *100 monedas* ganadas.",
      "🚗💨 Dominas la pista como un profesional. Te llevas *100 monedas* por la victoria.",
      "🏆 Eres el campeón indiscutible de la carrera. *100 monedas* bien merecidas.",
      "💸 Tu velocidad te hizo ganar el oro. *100 monedas* directas a tu cuenta.",
      "🎉 La multitud grita tu nombre. ¡Felicidades! *100 monedas* ganadas.",
      "🏁 Pasaste la meta con estilo. *100 monedas* para el mejor piloto.",
      "🚦 Desde la salida sabíamos que ibas a ganar. *100 monedas* en el bolsillo.",
      "💨 Tuvo que haber sido ilegal lo rápido que fuiste. *100 monedas* para ti.",
      "😏 Les diste una cátedra de manejo. *100 monedas* en tu cuenta.",
      "🔥 Dominaste la pista de inicio a fin. *100 monedas* bien ganadas.",
      "😎 Dejaste a los demás en la sombra. *100 monedas* pa’ ti.",
      "🏁 No fue una carrera, fue un paseo para ti. *100 monedas* ganadas.",
      "💨 ¿Eso fue un auto o un jet? *100 monedas* para el más rápido.",
      "🎯 No hay quien te gane en la pista. *100 monedas* en tu cuenta.",
      "⚡ Corres tan rápido que deberían hacerte un antidoping. *100 monedas* ganadas.",
      "🏆 Eres el rey de la pista. *100 monedas* bien merecidas.",
      "🔥 Ganaste con una ventaja absurda. *100 monedas* a tu cuenta.",
      "🚀 Saliste disparado como un cohete. *100 monedas* ganadas.",
      "🛣️ No hubo competencia para ti. *100 monedas* sumadas.",
      "😆 Ni los fantasmas de la pista pudieron alcanzarte. *100 monedas* pa’ ti.",
      "🎖️ Corres mejor que un piloto profesional. *100 monedas* bien merecidas.",
      "🚥 Tu precisión en la carrera es de otro nivel. *100 monedas* a tu saldo.",
      "💰 Apostaron en tu contra y perdieron. *100 monedas* para ti.",
      "🏎️ Desde la salida tomaste la delantera. *100 monedas* ganadas.",
      "📢 Eres la sensación del circuito. *100 monedas* añadidas."
    ];

    const frasesPerder = [
      "💨 Tu carro se apagó en la salida, bro… perdiste *100 monedas*.",
      "🚗💨 Metiste el cambio mal y te pasaron como si fueras un triciclo. Perdiste *100 monedas*.",
      "🔥 Te confiaron con la arrancada y al final te comieron vivo. No ganaste y perdiste *100 monedas*.",
      "⛽ Se te acabó la gasolina en la última vuelta. Adiós *100 monedas*.",
      "🔧 El motor explotó en plena carrera. Perdiste *100 monedas*.",
      "🚦 Saliste tarde y nunca recuperaste el tiempo. Se fueron *100 monedas*.",
      "🌧️ La pista mojada te jugó una mala pasada. *100 monedas* menos.",
      "😫 Un bache te sacó de la carrera. Adiós a *100 monedas*.",
      "😖 No era tu día. La suerte te abandonó y perdiste *100 monedas*.",
      "🚧 Chocaste contra una barrera. *100 monedas* menos en tu cuenta.",
      "💀 Tu auto no dio la talla. Perdiste *100 monedas*.",
      "💨 Demasiado lento esta vez. Te quitaron *100 monedas*.",
      "⚙️ Se te salió una llanta en plena curva. Adiós *100 monedas*.",
      "🔩 Problemas mecánicos te arruinaron la carrera. *100 monedas* menos.",
      "🏎️ Pensaste que ibas a ganar, pero sorpresa… perdiste *100 monedas*.",
      "🐢 Corristes como una tortuga. *100 monedas* menos.",
      "⚡ Tu nitro no funcionó. Perdiste *100 monedas*.",
      "🛞 Un pinchazo arruinó todo. *100 monedas* menos.",
      "🚔 Te paró la policía. *100 monedas* perdidas.",
      "😢 La derrota duele… y más con *100 monedas* menos.",
      "🔥 Te fuiste de boca en la curva final. Se fueron *100 monedas*.",
      "🤡 Tu manejo fue un chiste. Adiós *100 monedas*.",
      "💥 Explotaste el motor por forzarlo demasiado. *100 monedas* menos.",
      "📉 Hoy no fue tu día. *100 monedas* menos en tu cuenta.",
      "🥶 Te congelaste en la salida y nunca recuperaste. *100 monedas* menos.",
      "🏁 Te pasaron en la última curva. *100 monedas* menos.",
      "🌪️ Te sacó un remolino de la pista. *100 monedas* perdidas.",
      "💀 Tu auto quedó irreconocible después del choque. *100 monedas* menos.",
      "🛑 Frenaste demasiado en la curva y perdiste la carrera. *100 monedas* menos."
    ];

    userKr.kr += gano ? 100 : -100;
    writeData(krFilePath, krData);

    await sendReply((gano ? frasesGanar : frasesPerder)[Math.floor(Math.random() * 30)]);
    await sendReply(`> 💰 Tu saldo actual es: *${userKr.kr} monedas* $k`);
  },
};