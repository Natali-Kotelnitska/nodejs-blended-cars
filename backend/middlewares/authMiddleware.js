const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = asyncHandler(async (req, res, next) => {
  //1. який метод запиту прийшов
  // 2. зчитати токен з заголовків i перевірити що це токен авторизації
  // 4. якщо токен не передали і це не токен авторизації - помилка
  // 5. розпарсуєм токен
  // 6.передаєм інфо з токена для подального користування

  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    if (
      !(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      )
    ) {
      res.status(400);
      throw new Error('Authorization Token is not send');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.evt.JWT_SECRET);
    // console.log(token);
    //   Cconsole.log('decoded', decoded)
    if (!decoded) {
      res.status(403);
      throw new Error('Forbidden');
    }
    const candidate = await User.findById(decoded.id).select(
      '-userPassword -createdAt'
    );
    if (!candidate) {
      res.status(401);
      throw new Error('Not authorized');
    }
    // console.log('candidate', candidate);
    req.user = candidate;
    next();
  } catch (error) {
    throw new Error(401);
  }
});
