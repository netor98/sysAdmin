require("colors");

const menuStart = () => {
    return new Promise((resolve) => {
        console.log("=======================".brightYellow);
        console.log("     SERVIDOR DHCP".brightYellow);
        console.log("=======================\n".brightYellow);
        resolve();
    });
};

const saveIpStart = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"1.".blue} Ingresa el rango inicial de ip's: `,
            (ipsEnd) => {
                readline.close();
                resolve(ipsEnd);
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
            `${"2.".blue} Ingresa el rango final de ip's: `,
            (ipsEnd) => {
                readline.close();
                resolve(ipsEnd);
            }
        );
    });
};

const saveGateaway = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"3.".blue} Ingresa la puerta de enlace ${"(gateaway)".gray}: `,
            (gateaway) => {
                readline.close();
                resolve(gateaway);
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
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveGateaway,
};
