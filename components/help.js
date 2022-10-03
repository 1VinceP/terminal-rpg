import inquirer from "inquirer";

export default async () => {
   await inquirer.prompt([{
      name: 'help',
      message: `
   At any time you may type the following commands:
   /help - return to this screen
   /report - see your character report
   /glossary - see the glossary
   /quit - close the game without saving

   Press Enter to continue...
      `
   }]);
};
