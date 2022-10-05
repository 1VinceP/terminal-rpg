import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import GameState from '../GameState.js';
import sleep from '../utils/sleep.js';
import help from './commands/help.js';

export default async function titleScreen() {
   let showTitle = true;
   while (showTitle) {
      console.clear();

      figlet('Welcome to Terminal RPG', (err, data) => {
         console.log(gradient.pastel.multiline(data));
      });

      await sleep(100);

      const startChoices = [
         'New Game',
         ...(GameState.player ? ['Continue'] : []),
         'Help',
      ];

      const answers = await inquirer.prompt([{
         name: 'start',
         type: 'rawlist',
         message: 'Select an option to continue',
         choices: startChoices,
         interruptedKeyName: 'a',
      }]);
      const { start } = answers;

      if (/New Game/.test(start)) {
         if (!GameState.player) {
            showTitle = false;
            continue;
         } else {
            const didReset = await GameState.reset();
            showTitle = !didReset;
         }
      } else if (/Continue/.test(start)) {
         showTitle = false;
      } else if (/Help/.test(start)) {
         await help();
      }
   }
}
