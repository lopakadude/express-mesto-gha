const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.'));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные при создании пользователя.');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.'));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, context: 'query' })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, context: 'query' })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};
