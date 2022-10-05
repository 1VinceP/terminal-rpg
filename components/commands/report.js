import inquirer from "inquirer";
import GameState from '../../GameState.js';

export default async () => {
   GameState.player.report();

   await inquirer.prompt([{
      name: 'report',
      type: 'continue',
      enter: true,
      message: '',
   }]);
};
