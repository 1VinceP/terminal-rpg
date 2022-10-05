import help from '../components/commands/help.js';

export default {
   '/help': async () => {
      await help();
   },
};
