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

// Mostrar la lista de usuarios registrados
const mostrarUsuarios = () => {
const datos = leerArchivo();
return datos.usuarios.map((usuario) => `${usuario.nombre} - ${usuario.fechaRegistro}`).join('\n');
};

module.exports = {
name: 'registro',
description: 'Mostrar la lista de usuarios registrados',
commands: ['registro'],
usage: `${PREFIX}registro`,
handle: async ({ socket, remoteJid, message }) => {
const datos = leerArchivo();
if (datos.usuarios.length === 0) {
return 'No hay usuarios registrados';
}
return mostrarUsuarios();
},
};