'use strict';

const assert = require('assert');

class Cloud {
  constructor(app) {
    this.option = app.config.cloud;
  }

  async request({ ctx, query, action }) {
    const { access_token } = ctx.query;
    const data = JSON.stringify({
      env: this.option.env,
      query,
    });

    return await ctx.curl(
      `https://api.weixin.qq.com/tcb/${action}?access_token=${access_token}`,
      {
        method: 'POST',
        dataType: 'json',
        data,
      }
    );
  }

  async query(params) {
    return await this.request({ action: 'databasequery', ...params });
  }
  async add(params) {
    return await this.request({ action: 'databaseadd', ...params });
  }
  async update(params) {
    return await this.request({ action: 'databaseupdate', ...params });
  }
  async destroy(params) {
    return await this.request({ action: 'databasedelete', ...params });
  }
}

const mount = (app) => {
  const { cloud: config } = app.config;
  assert(
    config.app_id && config.app_secret,
    `[cloud] app_id: ${config.app_id}, app_secret: ${config.app_secret}`
  );
  assert(config.env, `[cloud] env: ${config.env}`);
  app.cloud = new Cloud(app);
};
module.exports = mount;
