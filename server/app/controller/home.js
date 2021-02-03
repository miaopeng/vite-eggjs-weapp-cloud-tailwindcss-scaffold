'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }

  async login() {
    const { ctx } = this;
    const API_ID = 'wx30ed2c73a06cb35e';
    const API_SECRET = 'f5a0a27def944afb47c8fba99745379c';
    const res = await ctx.curl(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${API_ID}&secret=${API_SECRET}`,
      {
        dataType: 'json',
      }
    );

    console.log('token', res.data);

    ctx.body = {
      data: res.data,
    };
  }
}

module.exports = HomeController;
