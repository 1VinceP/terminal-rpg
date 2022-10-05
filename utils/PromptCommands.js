/**
 * Copied and modified from inqiurer-interrupted-prompt to match my needs
 * https://github.com/lnquy065/inquirer-interrupted-prompt/blob/master/src/index.js
 */

import observe from "inquirer/lib/utils/events.js";
import help from '../components/commands/help.js';
import glossary from '../components/commands/glossary.js';
import report from '../components/commands/report.js';
import log from '../components/commands/log.js';
import quit from '../components/commands/quit.js';

const COMMAND = 'COMMAND';
const commands = ['h', 'r', 'g', 'l', 'q'];

const handleCommand = async command => {
   if (command.type !== COMMAND) return;

   if (command.key === 'h') await help();
   else if (command.key === 'r') await report();
   else if (command.key === 'g') await glossary();
   else if (command.key === 'l') await log();
   else if (command.key === 'q') await quit();
};

/**
 * Overwrite Promise to handleCommand by default when an error is thrown
 */
class CustomPromise {
   constructor(executor) {
      this.promise = new Promise(executor);
      this.promise = this.promise.then(res => res, handleCommand);
   }
   then(onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected);
   }
   catch(onRejected) {
      return this.promise.catch(onRejected);
   }
}

const rejectIfInterrupted = (event, reject) => {
   if (commands.includes(event.key.name)) {
      reject({ type: COMMAND, key: event.key.name });
   }
};

/**
 * Create a interrupted prompt from any Prompt from inquirer or its plugins
 * @param {PromptClass} basePrompt
 * @returns {InterruptedPrompt}
 */
const from = (basePrompt) => {
   class IntrPrompt extends basePrompt {
      run(cb) {
         return new CustomPromise((resolve, reject) => {
            const events = observe(this.rl);
            events.keypress.pipe().forEach(e => rejectIfInterrupted(e, reject));
            super.run(cb).then(resolve, reject);
         });
      }
   }
   return IntrPrompt;
};

/**
 * Override all default inquirer prompts to interrupted prompts
 * @param {PromptClass} basePrompts
 * @returns {InterruptedPrompt}
 */
const replaceAllDefaults = inquirer => {
   Object.keys(inquirer.prompt.prompts).forEach((key) => {
      inquirer.prompt.prompts[key] = InterruptedPrompt.from(
         inquirer.prompt.prompts[key],
      );
   });
}

const InterruptedPrompt = {
   from,
   fromAll: replaceAllDefaults
};

export default InterruptedPrompt;
