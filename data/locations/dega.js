import inquirer from 'inquirer';
import _ from 'lodash';
import GameState from '../../GameState.js';
import loadScene from '../../actions/loadScene.js';

const choices = {
   'dega iii': {
      choices: {},
   },
   'dega resort': {
      choices: {},
   },
   'resort poolside': {
      start: {
         'bar': 'poolside bar',
         'swim': 'poolside pool',
         'lounge': 'poolside lounge',
      },
   },
   'poolside bar': {
      start: [{
         'Order good drink ($1)': [],
         'Order interesting drink ($2)': [],
         'Ask about the club': [],
      }],
   },
   'poolside pool': {
      start: [
         'Swim laps',
         'Join the volleyball game',
      ],
   },
};

const messages = {
   'resort poolside': {
      start: '\nThe ever-present tropical breeze creates small ripples on the pool\'s surface. Many people lounge around the edge of the pool, and many others stand at the poolside bar. There is a group of people playing volleyball in the water, but the pool is large enough that the larger splashes aren\'t coming close to the edge.',
   },
};

function getChoices(path, time) {
   return _.get(choices, path.join('.')).choices[time];
}

const locations = {
   'dega iii': {
      description: [''],

      'dega resort': {
         description: [''],

         'resort poolside': {
            description: [''],
            async enter(time) {
               console.log('\nThe ever-present tropical breeze creates small ripples on the pool\'s surface. Many people lounge around the edge of the pool, and many others stand at the poolside bar.');
               const _choices = choices['resort poolside'][time];
               const { response } = await inquirer.prompt([{
                  name: 'response',
                  type: 'rawlist',
                  message: 'What would you like to do?',
                  choices: Object.keys(_choices),
               }]);
               loadScene({ name: _choices[response], time });
            },

            'poolside bar': {
               async enter(time) {
                  const _choices = choices['poolside bar'][time];
                  const { drinks } = await inquirer.prompt([
                     {
                        name: 'approach',
                        type: 'continue',
                        enter: true,
                        message: '\nYou approach the bar, eager for a drink and the opportunity to meet fellow vacationers. Drinks are included all week with your All Access pass and it\'s time to see if they really do mix the best bikka in the galaxy.',
                     },
                     {
                        name: 'drinks',
                        type: 'rawlist',
                        when: () => time === 'start',
                        message: `\nAt the bar you see a list of drinks. Some sound good, some sound interesting, and some seem outright gross. As you ponder the options before you you overhear a conversation to you right "Oh yeah, I totally love to ${GameState.player.hobbies[0].toLowerCase()}. There's actually a club meeting later tonight if you're interested."`,
                        choices: Object.keys(_choices[0]),
                     },
                        {
                           name: 'good',
                           type: 'continue',
                           when: ({ drinks }) => drinks.includes('good'),
                           enter: true,
                           message: '\nYou order a drink for $1. It\'s pretty good.'
                        },
                        {
                           name: 'interesting',
                           type: 'continue',
                           when: ({ drinks }) => drinks.includes('interesting'),
                           enter: true,
                           message: '\nYou order a drink for $2. It\'s very interesting.'
                        },
                        {
                           name: 'club',
                           type: 'continue',
                           when: ({ drinks }) => drinks.includes('club'),
                           enter: true,
                           message: `\n"Oh you ${GameState.player.hobbies[0].toLowerCase()} too? Hey, that's great! We could always use more people for the event coming up at the end of the week. If you go to the lounge later tonight right after sundown you'll find a whole bunch of us there!`,
                        },
                  ]);

                  drinks.includes('good') ? GameState.player.money -= 1
                     : drinks.includes('interesting') ? GameState.player.money -= 2 : null;

                  console.log('\nAfter enjoying some time at the bar you return to the poolside.');
                  loadScene({ name: 'resort poolside', time });
               }
            },

            'poolside pool': {
               async enter(time) {
                  await inquirer.prompt([
                     {
                        name: 'approach',
                        type: 'continue',
                        enter: true,
                        message: '\nGood thing you decided to wear your swimsuit! You dip a toe in the water and find that it\'s perfectly warm.',
                     },
                     {
                        name: 'activities',
                        type: 'rawlist',
                        message: 'To the left are lanes for swimming laps, and straight ahead is the volleyball game. What would you like to do?',
                        choices: choices['poolside pool'][time],
                     },
                        {
                           name: 'laps',
                           type: 'continue',
                           enter: true,
                           when: ({ activities }) => activities.includes('laps'),
                           message: '\nYou decide to swim a few laps and get out some of the energy you\'ve stored up during the long trip to Dega III.',
                        },
                        {
                           name: 'volleyball',
                           type: 'continue',
                           enter: true,
                           when: ({ activities }) => activities.includes('volleyball'),
                           message: '\nThe people playing volleyball are eager to let you fill in a missing position and you quickly join the game, even managing to score a few points before the others head off for their other plans.'
                        },
                  ]);

                  console.log('\nAfter enjoying your time in the pool you get out and dry off.');
                  loadScene({ name: 'resort poolside', time });
               },
            },
         },
      },
   },
};

export default locations;
