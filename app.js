const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;

const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, (req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
