require("colors");
const fs = require("fs");
const { exec, execSync } = require("child_process");

const os = require("os");
const {
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveBroadcast,
    saveDNS,
    saveReleaseTime,
    saveIpNetwork,
    saveMask,
    saveIpServer,
} = require("./helpers/mensajes.js");

const { replaceIpServer } = require("./helpers/functions.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const {
    consoleAnimation,
    isPackageInstalled,
    powershellCommands,
} = require("./helpers/commands.js");

let prefix = "";
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

    const ipServer = await saveIpServer();
    const ipNet = await saveIpNetwork();
    const mask = await saveMask();
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const dns = await saveDNS();
    const time = await saveReleaseTime();
    const broadcast = await saveBroadcast();

    if (mask == "255.255.255.0") prefix = "/24";
    if (mask == "255.255.0.0") prefix = "/32";
    if (mask == "255.0.0.0") prefix = "/40";

    dhcpConfig = `
    subnet ${ipNet} netmask ${mask} {
        range ${ips} ${ipsEnd};
        option domain-name-servers ${dns};
        option domain-name "example.org";
        option subnet-mask ${mask};
        option routers ${ipServer};
        option broadcast-address ${broadcast};
        default-lease-time ${time};

    }`;

    if (osName == "linux") {
        fs.writeFileSync("/etc/dhcp/dhcpd.conf", dhcpConfig);

        replaceIpServer(
            "/etc/netplan/00-installer-config.yaml",
            `${ipServer}${prefix}`
        );
        exec("sudo netplan apply", (error, stdout, stderr) => {
            if (error) {
                console.error(
                    `Error applying network configuration: ${error.message}`
                );
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }

            const processStop = exec("sudo systemctl stop isc-dhcp-server");

            processStop.on("exit", async (code) => {
                if (code === 0) {
                    await delay(2000);
                    const processStart = exec(
                        "sudo systemctl start isc-dhcp-server"
                    );

                    processStart.on("exit", () => {
                        console.log("\nSERVICIO DHCP RENICIADO\n");
                        pausa();
                    });
                } else {
                }
            });
        });
    } else {
        const defaultInterface = 6;
        execSync(
            `powershell New-NetIPAddress -InterfaceIndex ${defaultInterface} -IPAddress ${ipServer} -PrefixLength ${prefix.slice(
                1
            )}`
        );

        execSync(
            `powershell Add-DhcpServerV4Scope ${ipServer} -StartRange ${ips} -EndRange ${ipsEnd} -SubnetMask ${mask}`,
            {
                stdio: "inherit",
            }
        );

        execSync(
            `powershell Set-DhcpServerV4Scope -ScopeID ${ipServer} -LeaseDuration ${time}`,
            {
                stdio: "inherit",
            }
        );

        execSync("powershell Restart-Service dhcpserver", { stdio: "inherit" });
    }
};

main();
