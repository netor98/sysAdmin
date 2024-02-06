require("colors");

const saveIpStart = () => {
    return new Promise((resolve) => {
        console.log("=======================".brightYellow);
        console.log("     SERVIDOR DHCP".brightYellow);
        console.log("=======================\n".brightYellow);

        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"1.".blue} Ingresa rango inicial de ip's: `,
            (ipsStart) => {
                readline.close();
                resolve(ipsStart);
            }
        );
    });
};

const saveIpEnd = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"2.".blue} Ingresa rango final de ip's: `,
            (ipsEnd) => {
                readline.close();
                resolve(ipsEnd);
            }
        );
    });
};

const pausa = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `\nPresione ${" ENTER ".green} para continuar`,
            (ips) => {
                readline.close();
                resolve();
            }
        );
    });
};

module.exports = {
    saveIpStart,
    pausa,
    saveIpEnd,
};
