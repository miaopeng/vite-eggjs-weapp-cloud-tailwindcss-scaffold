/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606276761171_7234';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.view = {
    defaultViewEngine: 'static',
    mapping: {
      '.html': 'static',
    },
  };

  config.cors = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // weixin miniprogram cloud
  config.cloud = {
    app_id: 'your_app_id',
    app_secret: 'your_app_secret',
    env: 'your_cloud_env',
  };

  return {
    ...config,
    ...userConfig,
  };
};
