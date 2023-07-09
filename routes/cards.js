const router = require('express').Router();
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');
const celebrates = require('../middlewares/celebrates');

router.get('/', getCards);
router.post('/', celebrates.createCard, createCard);
router.delete('/:cardId', celebrates.checkIdCard, deleteCard);
router.put('/:cardId/likes', celebrates.checkIdCard, addLike);
router.delete('/:cardId/likes', celebrates.checkIdCard, removeLike);

module.exports = router;
