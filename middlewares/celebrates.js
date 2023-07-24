const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { regexUrl } = require('../utils/constants/regexUrl');

// его можно использовать и для создания юзера
module.exports.login = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl),
  }),
});

module.exports.getUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
});

module.exports.updateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.updateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regexUrl).required(),
  }),
});

module.exports.createCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexUrl),
  }),
});

module.exports.checkIdCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().required(),
  }),
});
