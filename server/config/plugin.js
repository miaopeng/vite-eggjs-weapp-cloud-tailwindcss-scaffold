'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  viewStatic: {
    enable: true,
    package: 'egg-view-static',
  },
};
