import inquirer from "inquirer";

export default async () => {
   await inquirer.prompt([{
      name: 'help',
      enter: true,
      type: 'continue',
      message: `
   At any time you may type the following commands:
   h - return to this screen
   r - see your character report
   g - see the glossary
   l - see a log of your actions
   q - close the game without saving
      `
   }]);
};
