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

// Cambiar el nombre de un usuario registrado
const cambiarNombre = (nombreActual, nombreNuevo) => {
const datos = leerArchivo();
const indice = datos.usuarios.findIndex((usuario) => usuario.nombre === nombreActual);
if (indice === -1) {
return 'Usuario no encontrado';
}
datos.usuarios[indice].nombre = `kr.${nombreNuevo}.om`;
escribirArchivo(datos);
return `Nombre de usuario cambiado con éxito: ${datos.usuarios[indice].nombre}`;
};

module.exports = {
name: 'cambiarregistro',
description: 'Cambiar el nombre de un usuario registrado',
commands: ['cambiarregistro'],
usage: `${PREFIX}cambiarregistro <nuevo_nombre>`,
handle: async ({ socket, remoteJid, message }) => {
const argumentos = message.body.trim().split(' ').slice(1);

if (argumentos.length === 0) {
  return 'Debes proporcionar un nuevo nombre para cambiar el registro';
}

const nombreNuevo = argumentos.join(' ');
const datos = leerArchivo();
const usuario = datos.usuarios.find((usuario) => usuario.nombre === `kr.${message.sender}.om`);
if (!usuario) {
  return 'Debes estar registrado para cambiar el nombre';
}

const nombreActual = usuario.nombre;
const nombreCompletoNuevo = `kr.${nombreNuevo}.om`;
const existeNombre = datos.usuarios.some((usuario) => usuario.nombre === nombreCompletoNuevo);
if (existeNombre) {
  return `El nombre de usuario ${nombreCompletoNuevo} ya está registrado`;
}

return cambiarNombre(nombreActual, nombreNuevo);
},
};