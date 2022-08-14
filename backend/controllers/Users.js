const asyncHandler = 'express-async-handler';
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserController {
  registration = asyncHandler(async (res, req) => {
    //   1. отримуємо дані від користувачв
    // 2. валідуєм дані
    // 3. перевіряєм чи є користувач в базі даних
    // 4. якщо є, тоді пишем що користувач вже є
    // 5.хешуєм пароль
    // 6. зберігаєм користувача з хешованим паролем

    const { userName, userEmail, userPassword } = req.body;
    if (!(userName && userEmail && userPassword)) {
      res.status(400);
      throw new Error('All input filds required');
    }
    //   console.log(req.body);
    const oldUser = await User.findOne({ userEmail });

    if (oldUser) {
      res.status(409);
      throw new Error('User exists');
    }

    const hashPassword = bcrypt.hash(userPassword, 10);
    const candidate = await User.create({
      ...req.body,
      password: hashPassword,
    });

    if (!candidate) {
      res.status(400);
      throw new Error('Error of registration');
    }

    res.status(201).json({
      status: 'success',
      code: 201,
      data: candidate,
    });
  });

  async login() {
    //   1. отримуємо дані від користувачв
    // 2. валідуєм дані
    // 3.перевіряєм чи є користувач в базі даних
    // 4. якщо немає користувача за емайлом-просим реєструватись
    // 5.перевіряєм чи є логін або пароль в базі даних
    //   6. якщо неправильно 'неправ логін'
    // 6. все добре - генуруєм токен
    const { userEmail, userPassword } = req.body;

    if (!(userEmail && userPassword)) {
      res.status(400);
      throw new Error('All input filds required');
    }

    const candidate = await User.findOne({ userEmail });

    if (!candidate) {
      return res.status(404).json({
        message: 'Please register',
      });
    }
    if (
      !(candidate && (await bcryptjs.compare(userPassword, user.userPassword)))
    ) {
      res.status(400);
      throw new Error('Invalid login or password!');
    }
    const payload = {
      id: candidate._id,
      food: 'pizza',
      drink: 'water',
    };

    candidate.token = this.generateToken(payload);
    candidate.hobbies = ['football', 'play piano'];

    await candidate.save();
    if (!candidate) {
      res.status(400);
      throw new error('login error');
    }

    res.status(200).json({
      status: 'login success',
      code: 200,
      data: {
        userName: candidate.userName,
        userEmail: candidate.userEmail,
        token: candidate.token,
      },
    });
  }

  logout = async (req, res) => {
    //  1. зчитуєм req.user._id
    // 2. шукаєм користувача по id
    // 3. ставим йому токен null
    const { _id } = req.User;
    const candidate = await User.findById(_id);
    if (!candidate) {
      res.status(400);
      throw new Error('Logout error');
    }
    candidate.token = null;
    res.status(204).json({
      status: `Logout success ${_id}`,
    });
  };

    getAllUsers = asyncHandler((req, res) => {
        const { _id } = req.user;
        const candidate = await User.findById(_id);
        if (!candidate) {
            res.status(401);
            throw new Error('Not Authorized');
        }
        const users = await User.find({});
    res.status(200).json(users);
  });

  generateToken = payload => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
  };
}

module.exports = new User();
