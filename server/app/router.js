'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/login', controller.home.login);

  router.resources('question', '/questions', controller.question);
  router.post('/questions/:id/answer', controller.question.answer);

  router.resources('game', '/games', controller.game);
};
