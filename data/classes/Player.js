import chalk from 'chalk';
import _ from 'lodash';

export default class Player {
   constructor(name) {
      this.name = name;
      this.health = 2;
      this.stress = 2;
      this.location = {};
      this.bag = [];
      this.equipped = {
         head: null,
         chest: null,
         arms: null,
         wrist: null,
         handLeft: null,
         handRight: null,
         legs: null,
         feet: null,
         back: null,
      };
      this.stats = {
         bulk: 1,
         reflex: 1,
         brain: 1,
         charm: 1,
      };
      this.abilities = {
         encounterStart: [],
         encounterEnd: [],
         fightStart: [],
         fightEnd: [],
         dayStart: [],
         dayEnd: [],
         passive: [],
         anytime: [],
      };
      /* owned things like vehicles, etc */
      this.licenses = [];
      this.species = null;
      this.career = null;
      this.hobbies = null;
   }

   create({ species, career, hobbies }) {
      this.species = species;
      this.career = career;
      this.hobbies = Object.values(hobbies);

      /* set species stats */
      if (species === 'Human') Object.keys(this.stats).forEach(stat => ++this.stats[stat]);
      else if (species === 'K\'dar') {
         this.stats.reflex += 2;
         ++this.stats.brain;
      } else if (species === 'Prima') {
         this.stats.bulk += 2;
         ++this.stats.charm;
      } else if (species === 'Sskitt') {
         this.stats.brain += 2;
         ++this.stats.bulk;
      }

      /* set career stats */
      if (career === 'Warrior') ++this.stats.bulk;
      else if (career === 'Explorer') ++this.stats.reflex;
      else if (career === 'Desk Drone') ++this.stats.brain;
      else if (career === 'Executive') ++this.stats.charm;

      /* map hobbies */
      const hbs = Object.values(hobbies);
      if (hbs.includes('Pilot vehicles')) this.abilities.anytime.push('Push the limits');
      if (hbs.includes('Study Biology')) this.abilities.encounterStart.push('Quick insight');
      if (hbs.includes('Play sports')) this.abilities.fightStart.push('Adrenaline boost');
      if (hbs.includes('Write stories')) this.abilities.dayEnd.push('Journaling');

      /* update computed values */
      this.health += this.stats.bulk;
      this.stress += this.stats.brain;
   }

   load(data) {
      Object.assign(this, data);
   }

   report(obj = this) {
      console.log('\n');
      _.forEach(obj, (val, key) => {
         console.log(chalk.cyan(`[${key}]`), val);
      });
      console.log('\n');
   }

   setLocation(path, time) {
      this.location = { path, time };
   }
}