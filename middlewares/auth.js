const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Авторизация не пройдена. Неверный почта или пароль');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV !== 'production' ? 'super-strong-secret' : process.env.JWT_SECRET);
    console.log(payload);
  } catch (err) {
    throw new AuthorizationError('Авторизация не пройдена. Неверный почта или пароль');
  }
  req.user = payload;
  return next();
};
