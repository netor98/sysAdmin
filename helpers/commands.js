const { exec } = require("child_process");
require("colors");

function isPackageInstalled(os) {
    let command;
    if (os == "linux") {
        command = "dpkg -l | grep -w isc-dhcp-server";
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                resolve(!error && stdout.includes("isc-dhcp-server"));
            });
        });
    } else {
        command = "powershell Get-Service -Name 'Dhcp Server'";
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                resolve(stdout.trim() === "Installed");
            });
        });
    }
}

const consoleAnimation = (text, result) => {
    return new Promise((resolve) => {
        const animationDelay = 500; // in milliseconds
        const dotCount = 3;

        let dots = "";

        function animate() {
            process.stdout.write(`\r${text}${dots}`.yellow);
            dots = dots.length === dotCount ? "" : dots + ".";
        }

        const interval = setInterval(animate, animationDelay);

        // Stop the animation after a certain period (e.g., 5 seconds in this example)
        setTimeout(() => {
            clearInterval(interval);
            process.stdout.write(": " + result.blue + "\n"); // Move to the next line
            resolve(result);
        }, 3000);
    });
};

const powershellCommands = (ipStart, ipEnd, mask, gateaway, time, dns) => {
    const commands = [
        "Install-WindowsFeature -Name DHCP -IncludeManagementTools", // Instalar la característica DHCP
        `Add-DhcpServerv4Scope -Name "MyScope" -StartRange ${ipStart} -EndRange ${ipEnd} -SubnetMask ${mask} -State Active`, // Agregar un ámbito DHCP IPv4
        `Set-DhcpServerv4OptionValue -OptionID 6 -Value "${gateaway}"`, // Establecer la puerta de enlace predeterminada
        `Set-DhcpServerv4OptionValue -OptionID 3 -Value "${gateaway}"`, // Establecer la puerta de enlace del router
        `Set-DhcpServerv4OptionValue -OptionID 51 -Value "${time}`, // Establecer el tiempo de concesión predeterminado en segundos (86400 segundos = 24 horas)
        `Set-DhcpServerv4OptionValue -OptionID 6 -DNSserver "${dns}"`, // Establecer el servidor DNS
    ];

    commands.forEach((command) => {
        try {
            execSync(`powershell -Command "& { ${command} }"`, {
                stdio: "inherit",
            });
        } catch (error) {
            console.error(`Error al ejecutar el comando: ${command}`, error);
        }
    });
};

module.exports = {
    consoleAnimation,
    isPackageInstalled,
    powershellCommands,
};
