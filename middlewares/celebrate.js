const { celebrate } = require('celebrate');
const { Joi } = require('joi');

module.exports.login = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().url(),
  }),
});

module.exports.getUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
});

module.exports.updateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().url(),
  }),
});

module.exports.createCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().url(),
  }),
});

module.exports.checkIdCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
});
