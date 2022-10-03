import _ from 'lodash';
import GameState from '../GameState.js';
import locations from '../data/locations.js';

export default async ({ path, time }) => {
   GameState.player.location = { path, time };
   const location = _.get(locations, path.join('.'));
   await location.enter(time);
};
