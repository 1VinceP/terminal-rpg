import _ from 'lodash';

const routes = {};

/**
 *
 * @param {object} locations - location data
 * @param {*} base - prefix path for nested routes
 */
export const createRoutes = (locations = {}, base = '') => {
   const ignoredProps = ['description', 'enter'];

   _.forEach(locations, (data, name) => {
      if (ignoredProps.includes(name)) return;

      const path = `${base}${name}`;

      /* create route for location */
      routes[name] = path;

      /* create routes for sublocations with a base path */
      if (typeof data === 'object') {
         createRoutes(data, `${path}.`);
      }
   });
};

export default routes;