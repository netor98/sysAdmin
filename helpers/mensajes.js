require("colors");

const mostrarMenu = () => {
    console.log("=======================".brightYellow);
    console.log("     SERVIDOR DHCP".brightYellow);
    console.log("=======================\n".brightYellow);

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(`${"1.".blue} Ingresa rango inicial de ip's: `, (ips) => {
        readline.close();
    });
};

const pausa = () => {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(`\nPresione ${" ENTER ".green} para continuar`, (ips) => {
        readline.close();
    });
};

module.exports = {
    mostrarMenu,
    pausa,
};
