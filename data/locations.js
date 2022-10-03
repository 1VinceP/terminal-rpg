import inquirer from 'inquirer';
import _ from 'lodash';

const choices = {
   'Dega III': {
      choices: [],
      'Dega Resort': {
         choices: [],
         'poolside': {
            choices: {
               start: ['Bar', 'Swim', 'Lounge'],
            },
         },
      },
   },
};

function getChoices(path, time) {
   return _.get(choices, path.join('.')).choices[time];
}

export default {
   'Dega III': {
      description: [''],
      'Dega Resort': {
         description: [''],
         'poolside': {
            description: [''],
            async enter(time) {
               console.log('\nThe ever-present tropical breeze creates small ripples on the pool\'s surface. Many people lounge around the edge of the pool, and many others stand at the poolside bar.');
               const { response } = await inquirer.prompt([{
                  name: 'response',
                  type: 'rawlist',
                  message: 'What would you like to do?',
                  choices: getChoices(['Dega III', 'Dega Resort', 'poolside'], time),
               }]);
               console.log(response);
            },
         },
      },
   },
};
