const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.'));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send('Карточка с указанным _id не найдена.');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(200).send({ _id: req.params.cardId });
        });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send('Передан несуществующий _id карточки.');
      }
      return res.status(200).send({ _id: req.params.cardId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные для постановки/снятии лайка. ');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send('Передан несуществующий _id карточки.');
      }
      return res.status(200).send({ _id: req.params.cardId });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send('Переданы некорректные данные для постановки/снятии лайка. ');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка по умолчанию.');
    });
};
