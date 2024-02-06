import inquirer from "inquirer";

const ipExpr = /^(\d{1,3}\.){3}\d{1,3}$/; //Expresion regular para verificar una ip

const questions = [
    {
        type: "input",
        name: "startIps",
        message: "Ingresa el rango inicial:",
        validate: function (input) {
            return ipExpr.test(input) || "Ingresa una ip válida";
        },
    },
    {
        type: "input",
        name: "endIps",
        message: "Ingresa el rango final:",
        validate: function (input) {
            return ipExpr.test(input) || "Ingresa una ip válida";
        },
    },
    {
        type: "confirm",
        name: "confirm",
        message: "Are you sure?",
        validate: function (input) {
            // Check if the user confirmed (answered with 'y' or 'yes')
            return (
                ["y", "yes"].includes(input.toLowerCase()) ||
                "Please confirm with yes or y"
            );
        },
    },
];

async function promptWithValidation() {
    const answer = await inquirer.prompt(questions);
    console.log(answer);
}

promptWithValidation();
