const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

// console.log(
//   dotenv.config({
//     path: path.join(__dirname, '..', 'config', '.env'),
//   })
// );

const connectDB = require('../config/db');

require('colors');
require('../config/setEnvVars');

const { PORT } = process.env;

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false, //для форми
  })
);

app.use('/api/v1', require('./routes/carsRoutes'));
app.use(
  '/',
  require('./routes/usersRouters')
)(
  // connectDB();
  async () => {
    await connectDB(); // immediately invoked function expression;
  }
)();

app.use('*', (req, res, _) => {
  res.status(404).json({
    message: 'Not Found',
  });
});
app.use(require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.cyan.italic.underline);
});
