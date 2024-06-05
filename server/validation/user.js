const { body } = require('express-validator');

const validateUpdateUser = [
    body('name')
        .optional({ checkFalsy: true })
        .isString().withMessage('Имя должно быть строкой')
        .isLength({ min: 3 }).withMessage('Имя должно содержать не менее 3 символов')
        .matches(/^[a-zA-Zа-яА-Я\s-]+$/).withMessage('Имя может содержать только кириллические или латинские буквы, пробелы и тире'),
    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Некорректный адрес электронной почты'),
    body('phone')
        .optional({ checkFalsy: true })
        .isString().withMessage('Телефон должен быть строкой')
        .matches(/^[\d\s()+-]+$/).withMessage('Телефон может содержать только цифры, пробелы и символы + ( ) -'),
    body('code')
        .optional({ checkFalsy: true })
        .isInt().withMessage('Код должен быть числом')
        .isLength({ min: 6, max: 6 }).withMessage('Код должен содержать 6 символов')
];

const validateUpdatePassword = [
    body('currentPassword')
        .notEmpty().withMessage('Текущий пароль обязателен'),
    body('newPassword')
        .notEmpty().withMessage('Новый пароль обязателен')
        .isLength({ min: 5 }).withMessage('Пароль должен содержать не менее 5 символов')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s:])[A-Za-z\d^\w\d\s:]+$/).withMessage('Пароль должен содержать как минимум одну латинскую букву, одну цифру и один специальный символ')
];

module.exports = {
    validateUpdateUser,
    validateUpdatePassword
};
