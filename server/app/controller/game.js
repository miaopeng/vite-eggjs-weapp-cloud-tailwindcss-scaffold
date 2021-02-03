'use strict';

const _ = require('lodash');
const Controller = require('egg').Controller;

class GameController extends Controller {
  async index() {
    const { ctx, app } = this;
    const query = 'db.collection("games").limit(50).get()';
    const res = await app.cloud.query({ ctx, query });

    if (!res.data || res.data.errcode !== 0 || !res.data.data) {
      ctx.helper.error(ctx, res.data ? res.data.errmsg : 'get games failed');
      return;
    }

    const games = res.data.data.map((g) => JSON.parse(g));
    ctx.helper.success(ctx, games);
  }

  async getShuffledQuestions(question_count) {
    const { ctx, app } = this;
    const query =
      'db.collection("questions").field({ name: true }).limit(50).get()';
    const res = await app.cloud.query({ ctx, query });

    if (!res.data || res.data.errcode !== 0 || !res.data.data) {
      return [];
    }

    const questions = res.data.data.map((q) => JSON.parse(q));
    return _.shuffle(questions).slice(0, question_count);
  }

  async create() {
    const { ctx, app } = this;
    const { question_count } = ctx.request.body;
    const questions = await this.getShuffledQuestions(question_count);

    const body = JSON.stringify({
      ...ctx.request.body,
      created_at: new Date(),
      questions,
    });

    const query = `db.collection("games").add({ data: ${body} })`;
    const res = await app.cloud.add({ ctx, query });

    if (res && res.data.errcode === 0) {
      ctx.helper.success(ctx, res);
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }

  async show() {
    const { ctx, app } = this;
    const { id: _id } = ctx.params;
    const query = `db.collection("games").doc("${_id}").get()`;
    const res = await app.cloud.query({ ctx, query });

    if (res && res.data.errcode === 0) {
      const [game] = res.data.data;
      ctx.helper.success(ctx, JSON.parse(game));
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }

  async update() {
    const { ctx, app } = this;
    const { id: _id } = ctx.params;
    const { question_count } = ctx.request.body;
    const questions = await this.getShuffledQuestions(question_count);
    const body = JSON.stringify({
      questions,
      ...ctx.request.body,
    });
    const query = `db.collection("games").doc("${_id}").update({ data: ${body}})`;
    const res = await app.cloud.update({ ctx, query });

    if (res && res.data.errcode === 0) {
      ctx.helper.success(ctx);
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }

  async destroy() {
    const { ctx, app } = this;
    const { id: _id } = ctx.params;
    const query = `db.collection("games").doc("${_id}").remove()`;
    const res = await app.cloud.destroy({ ctx, query });

    if (res && res.data.errcode === 0) {
      ctx.helper.success(ctx);
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }
}

module.exports = GameController;
