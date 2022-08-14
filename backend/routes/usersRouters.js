const { Router } = require('express');
const UserController = require('../controllers/Users');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();

//registration
//login
//logout
//getAllUsers
//localhost:5000/api/v1/cars

router.get('/users', authMiddleware, UserController.getAllUsers);
router.post(
  '/register',
  (req, res, next) => {
    console.log('Відпрацював Joi');
    next();
  },
  UserController.registration
);
router.post('/login', UserController.login);
outer.post('/logout', authMiddleware, UserController.logout);

module.exports = router;
