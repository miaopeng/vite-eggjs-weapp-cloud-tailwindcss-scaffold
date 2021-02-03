'use strict';

exports.success = (ctx, result = 'ok') => {
  ctx.body = {
    data: result,
  };
};

exports.error = (ctx, message = 'error') => {
  ctx.body = {
    errors: message,
  };
};
