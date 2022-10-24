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
   'poolside lounge': {
      start: [
         'Bet on races',
         'Play a game',
      ],
      betting: ['Cheery', 'Bruiser', 'Spice', 'Carrot'],
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

            'poolside lounge': {
               async enter(time) {
                  const { creature, amount, game } = await inquirer.prompt([
                     {
                        name: 'approach',
                        type: 'continue',
                        enter: true,
                        message: '\nThe low din of conversation greets you as you enter the lounge. A few small groups of people huddle together on the couches, largely ignorant of your entrance.',
                     },
                     {
                        name: 'activities',
                        type: 'rawlist',
                        message: 'Some people are betting and cheering on a race between exotic creatures. Another group of people appear to be in a heated competition over what you recognize as a typically casual board game.',
                        choices: choices['poolside lounge'][time],
                     },
                        {
                           name: 'creature',
                           when: ({ activities }) => activities.includes('Bet'),
                           type: 'rawlist',
                           message: 'You walk towards the crowd of people enthusiastically cheering for the race and a man immediately approaches, asking for your wager. On which creature',
                           choices: choices['poolside lounge']['betting'],
                        },
                        {
                           name: 'amount',
                           type: 'number',
                           when: ({ activities }) => activities.includes('Bet'),
                           message: 'How much would you like to bet?',
                        },
                        {
                           name: 'dialogue',
                           type: 'continue',
                           enter: true,
                           when: ({ activities }) => activities.includes('Bet'),
                           message: '\n"Excellent choice, we\'re happy to have you playing with us!" The man cheerfully scribbles your bet in a small notebook that he carries. You turn towards the race and watch with anticipation.',
                        },
                     {
                        name: 'game',
                        type: 'rawlist',
                        when: ({ activities }) => activities.includes('game'),
                        message: '\nYou sit down at an open table and are quickly joined by another person. "Ever played before?" he asks. Without waiting for an answer the deck of cards is shuffled and dealt. Looking at your hand, you see that you have a risky card that could potentially result in a major win right now, and you have a set of cards that all but guarantee a smaller win in a few turns.',
                        choices: ['Risk winning it big now', 'Accept the guaranteed win later'],
                     },
                        {
                           name: 'risk',
                           type: 'continue',
                           enter: true,
                           when: ({ game }) => game && game.includes('big'),
                           message: '\nYou take the risk and go all in...',
                        },
                        {
                           name: 'guaranteed',
                           type: 'continue',
                           enter: true,
                           when: ({ game }) => game && game.includes('guaranteed'),
                           message: '\nYou bide your time and react to the other player\'s actions before surprising him with high value card that he would\'ve expected you to player earlier. You take a small portion of the winning pot and pocket $10.',
                        },
                  ]);

                  if (creature) {
                     console.log(`\nThe race takes longer than you expected and ${creature} takes and loses the lead many times.`);
                     const chance = Math.random() * 4;
                     if (chance >= 3) {
                        console.log(`\nIt was a photo finish! If not for the high-def cameras it would have been impossible to confirm that ${creature} won the race. You receive ${amount} credits.`);
                        GameState.player.money += amount;
                     } else {
                        console.log(`\nDespite a harrowing race, ${creature} slowly fell behind the leaders and was not able to place in the top 3 winner positions. You hand over ${amount}. "Haha well maybe you'll have better luck next time! We hope to see you again."`);
                        GameState.player.money -= amount;
                     }
                  }

                  if (game && game.includes('guaranteed')) {
                     GameState.player.money += 10;
                  } else if (game && game.includes('big')) {
                     const chance = Math.random() * 10;
                     if (chance >= 6) {
                        console.log('\nYou won $20!');
                        GameState.player.money += 20;
                     } else {
                        console.log('\nYou lost $15. Better luck next time');
                        GameState.player.money -= 15;
                     }
                  }

                  console.log('\nAfter a few hours in the lounge you return outside to the pool.');
                  loadScene({ name: 'resort poolside', time });
               }
            },
         },
      },
   },
};

export default locations;
