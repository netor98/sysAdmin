require("colors");
const fs = require("fs");
const { execSync } = require("child_process");

const os = require("os");
const {
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveGateaway,
} = require("./helpers/mensajes.js");

const {
    consoleAnimation,
    isPackageInstalled,
} = require("./helpers/commands.js");
console.clear();

const main = async () => {
    let packageNameToCheck = "";
    menuStart();

    const osName = await consoleAnimation(
        "Verificando el sistema operativo",
        os.platform()
    );

    if (osName !== "win32") packageNameToCheck = "isc-dhcp-server";
    else packageNameToCheck = "Dhcp-server";

    const searchPackage = await isPackageInstalled(osName);
    if (searchPackage)
        await consoleAnimation(
            "Buscando paquetes",
            packageNameToCheck + " esta instalado"
        );
    else {
        await consoleAnimation(
            "Buscando paquetes",
            packageNameToCheck + " esta NO instalado"
        );
    }

    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const gateaway = await saveGateaway();

    dhcpConfig = `
    subnet 192.168.75.0 netmask 255.255.255.0 {
        range ${ips} ${ipsEnd};
        option domain-name-servers example.org;
        option domain-name "example.org";
        option subnet-mask 255.255.255.0;
        option routers 192.168.0.1;
        default-lease-time 600;
    }`;

    fs.appendFileSync("/etc/dhcp/dhcpd.conf", dhcpConfig);
    execSync("systemctl restart isc-dhcp-server", { stdio: "inherit" });
    pausa();
};

main();
