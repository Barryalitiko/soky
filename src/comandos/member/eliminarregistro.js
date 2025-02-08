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

// Eliminar un usuario registrado
const eliminarUsuario = (nombre) => {
const datos = leerArchivo();
const indice = datos.usuarios.findIndex((usuario) => usuario.nombre === nombre);
if (indice === -1) {
return 'Usuario no encontrado';
}
datos.usuarios.splice(indice, 1);
escribirArchivo(datos);
return 'Usuario eliminado con éxito';
};

module.exports = {
name: 'eliminarregistro',
description: 'Eliminar un usuario registrado',
commands: ['eliminarregistro'],
usage: `${PREFIX}eliminarregistro`,
handle: async ({ socket, remoteJid, message }) => {
const datos = leerArchivo();
const usuario = datos.usuarios.find((usuario) => usuario.nombre === `kr.${message.sender}.om`);
if (!usuario) {
return 'Debes estar registrado para eliminar el registro';
}

return eliminarUsuario(usuario.nombre);
},
};