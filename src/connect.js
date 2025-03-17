const path = require("path");
const { question, onlyNumbers } = require("./utils");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidStatusBroadcast,
  proto,
  isJidNewsletter,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const { load } = require("./loader");
const {
  warningLog,
  infoLog,
  errorLog,
  sayLog,
  successLog,
} = require("./utils/logger");

const msgRetryCounterCache = new NodeCache();

// **Nuevo store para manejar mensajes en memoria**
const store = makeInMemoryStore(pino().child({ level: "silent" }));
store.readFromFile("./baileys_store.json"); // Opcional, para persistencia

// Guardar el estado del store cada 10 segundos
setInterval(() => {
  store.writeToFile("./baileys_store.json");
}, 10000);

// **Corrección de getMessage para recuperar mensajes correctamente**
async function getMessage(key) {
  const msg = store.messages[key.remoteJid]?.get(key.id);
  return msg ? msg.message : undefined;
}

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: false,
    defaultQueryTimeoutMs: 60 * 1000,
    auth: state,
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    keepAliveIntervalMs: 60 * 1000,
    markOnlineOnConnect: true,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
    getMessage,
  });

  // **Vincular store con el socket**
  store.bind(socket.ev);

  if (!socket.authState.creds.registered) {
    warningLog("Credenciales no configuradas!");
    infoLog('Ingrese su número sin el + (ejemplo: "13733665556"):');

    const phoneNumber = await question("Ingresa el número: ");

    if (!phoneNumber) {
      errorLog(
        'Número de teléfono inválido! Reinicia con el comando "npm start".'
      );
      process.exit(1);
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
    sayLog(`Código de Emparejamiento: ${code}`);
  }

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("Kram desconectado!");
      } else {
        switch (statusCode) {
          case DisconnectReason.badSession:
            warningLog("Sesión no válida!");
            break;
          case DisconnectReason.connectionClosed:
            warningLog("Conexión cerrada!");
            break;
          case DisconnectReason.connectionLost:
            warningLog("Conexión perdida!");
            break;
          case DisconnectReason.connectionReplaced:
            warningLog("Conexión de reemplazo!");
            break;
          case DisconnectReason.multideviceMismatch:
            warningLog("Dispositivo incompatible!");
            break;
          case DisconnectReason.forbidden:
            warningLog("Conexión prohibida!");
            break;
          case DisconnectReason.restartRequired:
            infoLog('Krampus reiniciado! Reinicia con "npm start".');
            break;
          case DisconnectReason.unavailableService:
            warningLog("Servicio no disponible!");
            break;
        }

        const newSocket = await connect();
        load(newSocket);
      }
    } else if (connection === "open") {
      successLog("Operación Marshall");
    } else {
      infoLog("Cargando datos...");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

exports.connect = connect;