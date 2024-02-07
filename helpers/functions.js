const fs = require("fs");
const buscarTextoEnArchivo = (filePath, newIp) => {
    const searchText = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+\b/g;

    try {
        // Leer el archivo de forma sincrónica
        let data = fs.readFileSync(filePath, "utf8");

        // Reemplazar el texto en el contenido del archivo
        const newData = data.replace(searchText, newIp);

        // Escribir los cambios en el archivo de forma sincrónica
        fs.writeFileSync(filePath, newData, "utf8");
    } catch (err) {
        console.error("Error al operar con el archivo:", err);
    }
};

module.exports = {
    buscarTextoEnArchivo,
};
