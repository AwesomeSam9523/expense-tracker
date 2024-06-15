import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import getUser from './utils/login.js';
import userManager from './modules/users.js';
import eventManager from './modules/events.js';
import invoiceManager from './modules/invoices.js';

const app = express();

app.use((req, res, next) => {
  console.log('[LOG]', req.method, req.url);
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    null,
    'null'
  ],
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/',
  safeFileNames: /\\/g,
  debug: process.env.PRODUCTION !== 'true',
}));
app.use(async (req, res, next) => {
  if (!req.headers.authorization)
    return res.sendStatus(401);

  const token = req.headers.authorization.split(' ')[1];
  req.user = null;

  if (token) {
    req.user = await getUser(token);
  }
  next();
});
app.use('/user', userManager);
app.use('/event', eventManager);
app.use('/invoice', invoiceManager);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
