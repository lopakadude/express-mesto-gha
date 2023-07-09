const router = require('express').Router();
const {
  getAllUsers, getUser, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const celebrates = require('../middlewares/celebrates');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrates.getUser, getUser);

router.patch('/me', celebrates.updateUser, updateUserInfo);

router.patch('/me/avatar', celebrates.updateUserAvatar, updateUserAvatar);

module.exports = router;
