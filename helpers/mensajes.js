require("colors");

const menuStart = () => {
    return new Promise((resolve) => {
        console.log("=======================".brightYellow);
        console.log("     SERVIDOR DHCP".brightYellow);
        console.log("=======================\n".brightYellow);
        resolve();
    });
};

const saveIpNetwork = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"1.".blue} Ingresa la dirección de la red: `,
            (ip) => {
                readline.close();
                resolve(ip);
            }
        );
    });
};

const saveMask = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"2.".blue} Ingresa la mascara de la red: `,
            (mask) => {
                readline.close();
                resolve(mask);
            }
        );
    });
};

const saveIpStart = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(
            `${"3.".blue} Ingresa el rango inicial de ip's: `,
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
            `${"4.".blue} Ingresa el rango final de ip's: `,
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
            `${"5.".blue} Ingresa la puerta de enlace ${"(gateaway)".gray}: `,
            (gateaway) => {
                readline.close();
                resolve(gateaway);
            }
        );
    });
};

const saveDNS = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(`${"6.".blue} Ingresa el DNS: `, (dns) => {
            readline.close();
            resolve(dns);
        });
    });
};

const saveReleaseTime = () => {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question(`${"7.".blue} Ingresa el tiempo máximo: `, (time) => {
            readline.close();
            resolve(time);
        });
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
            () => {
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
    saveDNS,
    saveReleaseTime,
    saveIpNetwork,
    saveMask,
};
