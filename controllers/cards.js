const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(new Error('NotFound'))
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(200).send({ _id: req.params.cardId });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id.' });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then(() => {
      res.status(200).send({ _id: req.params.cardId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id.' });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then(() => {
      res.status(200).send({ _id: req.params.cardId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат id.' });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    });
};
