const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const celebrates = require('./middlewares/celebrates');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const { createUser, login } = require('./controllers/users');

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(express.json());

app.use(cors);

app.use(requestLogger);

app.post('/signin', celebrates.login, login);

app.post('/signup', celebrates.createUser, createUser);

app.use('/', auth, require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(require('./middlewares/centralError'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
