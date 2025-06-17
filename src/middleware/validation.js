const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    const redirectPath = req.originalUrl.includes('/admin') ? '/admin/register' : '/register';
    return res.redirect(redirectPath);
  }
  next();
};

const validateUserRegister = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('pwd')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('pwdConf')
    .custom((value, { req }) => value === req.body.pwd)
    .withMessage('Passwords do not match'),
  handleValidationErrors,
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('pwd').if(body('password').not().exists()).notEmpty().withMessage('Password is required'),
  body('password').if(body('pwd').not().exists()).notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateAdminRegister = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('pwd')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('pwdConf')
    .custom((value, { req }) => value === req.body.pwd)
    .withMessage('Passwords do not match'),
  handleValidationErrors,
];

const validateAdminLogin = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('pwd').if(body('password').not().exists()).notEmpty().withMessage('Password is required'),
  body('password').if(body('pwd').not().exists()).notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateAdminRegister,
  validateAdminLogin,
};
