'use strict';

const _ = require('lodash');
const omit = require('omit.js').default;
const Controller = require('egg').Controller;

class QuestionController extends Controller {
  async index() {
    const { ctx, app } = this;
    const query = 'db.collection("questions").limit(50).get()';
    const res = await app.cloud.query({ ctx, query });

    if (!res.data || res.data.errcode !== 0 || !res.data.data) {
      ctx.helper.error(ctx);
      return;
    }

    const questions = res.data.data.map((q) => JSON.parse(q));
    ctx.helper.success(ctx, questions);
  }

  async show() {
    const { ctx, app } = this;
    const { id: _id } = ctx.params;
    const query = `db.collection("questions").doc("${_id}").get()`;
    const res = await app.cloud.query({ ctx, query });

    if (res && res.data.errcode === 0) {
      try {
        const question = JSON.parse(res.data.data[0]);
        question.answers = _.shuffle(question.answers);
        const masked = omit(question, ['correct', 'level']);
        ctx.helper.success(ctx, masked);
      } catch (error) {
        ctx.helper.error(ctx, 'Question Error: ' + error.message);
      }
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }

  async answer() {
    try {
      const { ctx, app } = this;
      const { id: _id } = ctx.params;
      const body = ctx.request.body;
      const query = `db.collection("questions").doc("${_id}").get()`;
      const res = await app.cloud.query({ ctx, query });

      if (res && res.data.errcode === 0) {
        const question = JSON.parse(res.data.data[0]);
        ctx.helper.success(ctx, { correct: question.correct });
      } else {
        ctx.helper.error(ctx, res.data.errmsg);
      }
    } catch (error) {
      ctx.helper.error(ctx, error.message);
    }
  }

  async create() {
    const { ctx, app } = this;
    const body = JSON.stringify(ctx.request.body);
    const query = `db.collection("questions").add({ data: ${body} })`;
    const res = await app.cloud.add({ ctx, query });

    if (res && res.data.errcode === 0) {
      ctx.helper.success(ctx, res);
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }

  async update() {
    const { ctx, app } = this;
    const { id: _id } = ctx.params;
    const body = JSON.stringify(ctx.request.body);
    const query = `db.collection("questions").doc("${_id}").update({ data: ${body}})`;
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
    const query = `db.collection("questions").doc("${_id}").remove()`;
    const res = await app.cloud.destroy({ ctx, query });

    if (res && res.data.errcode === 0) {
      ctx.helper.success(ctx);
    } else {
      ctx.helper.error(ctx, res.data.errmsg);
    }
  }
}

module.exports = QuestionController;
