import inquirer from "inquirer";

const glossary = {
   close: null,
   health: `
   When this reaches 0, you die.
   If you have the money and the right connections, you may be brought back to life.
   `,
   stress: `
   When this reaches 0 you fall unconscious (maybe that's backwards, but bear with me), which may lead to death.
   High stress (numbers closer to 0... bear with me) can also have negative effects on your combat and social abilities depending on the circumstances.
   `,
};

export default async () => {
   let showGlossary = true;

   while (showGlossary) {
      const { item } = await inquirer.prompt([{
         name: 'item',
         type: 'search-list',
         message: 'Choose an item to learn more. Choose "close" to go back',
         choices: Object.keys(glossary),
      }]);

      if (item === 'close') {
         showGlossary = false;
         continue;
      }

      await inquirer.prompt([{
         name: item,
         type: 'continue',
         enter: true,
         message: glossary[item],
      }]);
   }
};
