import _ from 'lodash';
import GameState from '../GameState.js';
import locations from '../data/locations/index.js';
import routes from '../data/routes.js';

/**
 * @param {array} path - array of nodes for navigating location trees
 * @param {string} time - locations can have different events depending on when the player is there
 */
export default async ({ name, time }) => {
   GameState.player.setLocation(name, time);
   GameState.save();

   const location = _.get(locations, routes[name.toLowerCase()]);
   await location.enter(time);
};
