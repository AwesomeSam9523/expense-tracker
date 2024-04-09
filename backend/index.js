import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import getUser from './utils/login.js';
import userManager from './modules/users.js';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  if (!req.headers.authorization) return;
  const token = req.headers.authorization.split(' ')[1];
  req.user = null;

  if (token) {
    req.user = await getUser(token);
  }
  next();
});
app.use('/user', userManager);

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
