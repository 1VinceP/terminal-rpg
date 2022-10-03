import fs from 'fs';
import inquirer from 'inquirer';
import root from './helpers/root.js';
import Player from './data/classes/Player.js';

const gameStatePath = `${root}/../game_state.json`;

class GameState {
   constructor() {
      this.created = null;
      this.lastSave = null;
      this.player = null;
      this.logs = [];
   }

   create() {
      try {
         const date = new Date();
         this.created = date;
         this.lastSave = date;
         this.log('Game created', date);
         this.save();
      } catch (error) {
         console.log(error);
      }
   }

   load() {
      try {
         let savedState = fs.readFileSync(gameStatePath);
         savedState = JSON.parse(savedState);
         Object.assign(this, savedState);
         this.player = new Player();
         this.player.load(savedState.player);
      } catch (error) {
         console.log(error);
      }
   }

   save() {
      try {
         let date = new Date();
         this.lastSave = date;
         this.log('Game saved.', date);
         fs.writeFileSync(gameStatePath, JSON.stringify(this));
      } catch (error) {
         console.log(error);
      }
   }

   setPlayer(player) {
      this.player = player;
      this.log('Player updated.');
   }

   log(message, date) {
      this.logs.unshift({ message, date });
   }

   async reset() {
      const { confirmed } = await inquirer.prompt([{
         name: 'confirmed',
         type: 'confirm',
         message: 'Are you sure you want to reset your game?',
      }]);

      if (confirmed) {
         this.created = null;
         this.lastSave = null;
         this.player = null;
         this.logs = [];
         this.save();
         return true;
      }

      return false;
   }
}

const game = new GameState();
export default game;
