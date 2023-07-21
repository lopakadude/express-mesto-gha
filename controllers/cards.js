const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(
          'Переданы некорректные данные при создании карточки.',
        ));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .then((cardInfo) => {
      if (cardInfo) {
        if (cardInfo.owner._id.toString() === userId) {
          Card.findByIdAndRemove({ cardId })
            .then((card) => {
              if (card) {
                res.send({ cardId });
              }
            })
            .catch((err) => next(err));
        } else { next(new ForbiddenError('Отсутствие прав на удаление карточки.')); }
      } else {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequest('Некорректный формат id.'));
      } else {
        next(err);
      }
    });
};

module.exports.addLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    { cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      } else if (err.kind === 'ObjectId') {
        next(new BadRequest('Некорректный формат id.'));
      } else {
        next(err);
      }
    });
};

module.exports.removeLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    { cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      } else if (err.kind === 'ObjectId') {
        next(new BadRequest('Некорректный формат id.'));
      } else {
        next(err);
      }
    });
};
