import express from 'express';
import bodyParser from 'body-parser';

import getUser from './utils/login.js';
import userManager from './modules/users.js';
import eventManager from './modules/events.js';
import invoiceManager from './modules/invoices.js';
import path from "path";

const app = express();

app.use((req, res, next) => {
  console.log('[LOG]', req.method, req.url);
  next();
});

// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:8080',
//     null,
//     'null'
//   ],
//   optionsSuccessStatus: 200,
//   credentials: true,
// }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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

app.get('/images/:id', (req, res) => {
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, `./public/images/${req.params.id}`);
  res.sendFile(filePath);
});

if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
}

export default app;
