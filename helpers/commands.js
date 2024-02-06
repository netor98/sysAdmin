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

module.exports = {
    consoleAnimation,
    isPackageInstalled,
};
