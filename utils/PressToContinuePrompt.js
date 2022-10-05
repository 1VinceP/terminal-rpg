/**
 * Rewritten as the original package is not compatible with the current version of inquirer
 * https://github.com/leondreamed/inquirer-press-to-continue/blob/main/src/prompt.ts
 */

import InputPromptBase from 'inquirer/lib/prompts/base.js';
import observe from 'inquirer/lib/utils/events.js';

class PressToContinuePrompt extends InputPromptBase {
   constructor(questions, rl, answers) {
      super(questions, rl, answers);

      if ([
         this.opt.anyKey !== undefined,
         this.opt.enter !== undefined,
         this.opt.key !== undefined,
      ].filter(option => option).length !== 1) {
         throw new Error('Exactly one of the options `Enter`, `key`, or `anyKey` must be set.');
      }
   }

   _run(done) {
      this.done = done;
      const events = observe(this.rl);

      events.line.subscribe(() => {
         process.stderr.moveCursor(0, -1);
         process.stderr.clearLine(1);
         if (this.opt.enter || this.opt.anyKey) {
            this.done({
               key: { name: 'Enter' },
               value: 'enter',
            });
         }
      });

      events.keypress.subscribe(event => {
         if (this.opt.anyKey) this.done(event);
         else if (event.key.name === this.opt.key) this.done(event);
      });

      this.render();

      return this;
   }

   render() {
      const key = this.opt.enter ? 'Enter'
         : this.opt.key ? this.opt.key
         : 'any key';
      console.log(`${this.opt.message}\nPress ${key} to continue...`);
   }
}

export default PressToContinuePrompt;
