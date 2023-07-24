module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  res.status(err.statusCode).send({ message: err.message });
  return next();
};
