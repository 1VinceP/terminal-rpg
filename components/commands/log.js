import inquirer from "inquirer";
import day from 'dayjs';
import GameState from '../../GameState.js';

const format = 'ddd D MMM YYYY h:mm A';

export default async () => {
   if (GameState.logs.length > 0) {
      console.log('\n');
      GameState.logs.forEach(log => console.log(`${day(log.date).format(format)}:\n\t${log.message}`));
      console.log('\n');
   } else {
      console.log('There are no logs to display.');
   }

   await inquirer.prompt([{
      name: 'log',
      type: 'continue',
      enter: true,
      message: '',
   }]);
};
