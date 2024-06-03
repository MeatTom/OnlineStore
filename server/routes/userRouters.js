require('dotenv').config()
const {validationResult} = require ('express-validator')
const userController = require('../controllers/userCon')
const express = require('express');
const router = express.Router();
const validation = require('../validation/auth')
const userValidation = require('../validation/user')

//регистрация с валидацией
router.post('/auth/register', validation.regValidation,  async (req, res,next) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array())
    }
   next();
});
router.post('/auth/register', userController.registration);

router.post('/auth/send-code', validation.sendCodeValidation, async (req, res,next) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array())
    }
    next();
});
router.post('/auth/send-code', userController.sendCode);

router.post('/auth/login', validation.loginValidation, async (req, res,next) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array())
    }
   next();
});
router.post('/auth/login',  userController.authorization)

router.get('/auth/profile', userController.checkUserInfo)

router.put('/users/update', userValidation.validateUpdateUser, userController.updateUser);

router.put('/users/update-password', userValidation.validateUpdatePassword, userController.updateUserPassword);

module.exports = router;