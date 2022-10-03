import Item from './Item.js';

export const types = [
   'Melee',
   'Ranged',
   'Grenade',
];

export default class Weapon extends Item {
   constructor(name, description, cost, damage, type) {
      super(name, description, cost);

      this.damage = damage;
      this.type = type;
   }
}
