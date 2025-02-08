Aquí te dejo el comando completo actualizado:

const fs = require('fs');
const path = require('path');
const { PREFIX } = require('../../krampus');

const archivoJson = path.resolve(process.cwd(), 'assets/usuarios.json');

// Leer archivo JSON
const leerArchivo = () => {
try {
const datos = fs.readFileSync(archivoJson, 'utf8');
return JSON.parse(datos);
} catch (error) {
return { usuarios: [] };
}
};

// Escribir archivo JSON
const escribirArchivo = (datos) => {
fs.writeFileSync(archivoJson, JSON.stringify(datos, null, 2));
};

// Verificar si un nombre de usuario ya está registrado
const verificarNombre = (nombre) => {
const datos = leerArchivo();
return datos.usuarios.some((usuario) => usuario.nombre === nombre);
};

// Registrar un nuevo usuario
const registrarUsuario = (nombre) => {
const datos = leerArchivo();
const nuevoUsuario = {
nombre: `kr.${nombre}.om`,
fechaRegistro: new Date().toISOString(),
};
datos.usuarios.push(nuevoUsuario);
escribirArchivo(datos);
return `Usuario registrado con éxito: ${nuevoUsuario.nombre}`;
};

module.exports = {
name: 'registrar',
description: 'Registrar un nuevo usuario',
commands: ['registrar'],
usage: `${PREFIX}registrar <nombre>`,
handle: async ({ socket, remoteJid, msg }) => {
const texto = (msg.message.conversation || msg.message.extendedTextMessage.text);
const argumentos = texto.trim().split(' ').slice(1);

if (argumentos.length === 0) {
  return 'Debes proporcionar un nombre para registrarte';
}

const nombre = argumentos.join('');

if (nombre.includes(' ')) {
  return 'El nombre de usuario no puede contener espacios';
}

if (nombre.length > 10) {
  return 'El nombre de usuario no puede tener más de 10 letras';
}

const nombreCompleto = `kr.${nombre}.om`;

if (verificarNombre(nombreCompleto)) {
  return `El nombre de usuario ${nombreCompleto} ya está registrado`;
}

registrarUsuario(nombre);
return `¡Felicidades! Te acabas de registrar como ${nombreCompleto}.`;
},
};