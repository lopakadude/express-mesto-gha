module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    console.error;
    return res.status(500).send({'На сервере произошла ошибка'});
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};
