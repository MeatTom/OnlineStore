const {body} = require ('express-validator')

const regValidation = [
    body('name', 'Укажите Ваше имя, оно должно быть не менее 3 символов').isLength({min: 3}),
    body('email', 'Введён неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5 символов').isLength({ min: 5}),
];

const loginValidation = [
    body('email', "Неверный формат почты").isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({min: 5})
]

module.exports = {regValidation, loginValidation}
