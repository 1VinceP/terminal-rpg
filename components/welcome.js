import inquirer from 'inquirer';
import GameState from '../GameState.js';
import Player from '../data/classes/Player.js';
import gradient from 'gradient-string';
import routes from '../data/routes.js';

export default async function welcome() {
   const hobbyChoices = ['Pilot vehicles', 'Study biology', 'Play sports', 'Write stories'];
   const { name, species, career, hobbies } = await inquirer.prompt([
      {
         name: 'name',
         message: 'What is your name, traveler?',
      },
      {
         name: 'species',
         message: 'What is your species?',
         type: 'list',
         choices: ['Human', 'K\'dar', 'Prima', 'Sskitt'],
      },
      {
         name: 'career',
         message: 'What do you do for a living?',
         type: 'list',
         choices: ['Executive', 'Desk Drone', 'Explorer', 'Warrior'],
      },
      {
         name: 'hobbies.first',
         message: 'What do you do for fun? (1/2)',
         type: 'list',
         choices: hobbyChoices,
      },
      {
         name: 'hobbies.second',
         message: 'What do you do for fun? (2/2)',
         type: 'list',
         choices: hobbyChoices,
      },
   ]);

   const player = new Player(name);
   player.create({ career, species, hobbies });
   player.report();

   GameState.setPlayer(player);
   GameState.player.setLocation('resort poolside', 'start');
   GameState.save();

   console.log(gradient.cristal(`${name} arrives on the planet Dega III.`));
   await inquirer.prompt([{
      name: 'dialogue',
      type: 'continue',
      enter: true,
      message: 'With your All Access resort pass in hand, you step off of the transport ship and head directly to the poolside lounge. You\'ve heard nothing but great things about this place and you\'re excited to finally get the R&R that you deserve.',
   }]);
}
