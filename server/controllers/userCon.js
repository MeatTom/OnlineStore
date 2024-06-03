const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { VerificationCode, User } = require('../models/db');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

require('dotenv').config();
const SECRET = process.env.SECRET;

const sendCode = async (req, res) => {
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(verificationCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60000); // код действует 10 минут

    try {
        // Проверка на уникальность email
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        // Создание записи с кодом подтверждения
        await VerificationCode.create({
            email,
            code: hashedCode,
            expires_at: expiresAt,
        });

        // Настройка и отправка email с кодом подтверждения
        const transporter = nodemailer.createTransport({
            service: 'Yandex',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: "meattom@yandex.ru",
            to: email,
            subject: 'Ваш код подтверждения',
            text: `Ваш код подтверждения: ${verificationCode}`,
        });

        res.status(200).json({ message: 'Код подтверждения отправлен' });
    } catch (error) {
        console.error('Ошибка при отправке кода подтверждения:', error);
        res.status(500).json({ error: 'Ошибка при отправке кода подтверждения' });
    }
};


const registration = async (req, res) => {
        const { name, email, password, code, phone } = req.body;

        try {
            const verificationEntry = await VerificationCode.findOne({
                where: { email },
                order: [['expires_at', 'DESC']]
            });

            if (!verificationEntry) {
                return res.status(400).json({ error: 'Код подтверждения истек' });
            }

            const isCodeValid = await bcrypt.compare(code.trim(), verificationEntry.code);

            if (!isCodeValid) {
                return res.status(400).json({ error: 'Неверный код подтверждения' });
            }

            if (new Date() > new Date(verificationEntry.expires_at)) {
                return res.status(400).json({ error: 'Код подтверждения истек' });
            }

            // Удаление записи с кодом подтверждения
            await VerificationCode.destroy({ where: { email } });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: passwordHash, phone });
        const token = jwt.sign(
            {
                userId: user.id,
            },
            SECRET,
            {
                expiresIn: '10d',
            }
        );


        res.status(201).json({ message: 'Пользователь зарегистрирован успешно.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }
};


const authorization = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET,
            { expiresIn: '21d' }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при входе в систему' });
    }
};

const checkUserInfo = async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
    }
};

const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded.userId;

        const { name, email, phone, code } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        if (email && email !== user.email) {
            const verificationEntry = await VerificationCode.findOne({
                where: { email },
                order: [['expires_at', 'DESC']]
            });

            if (!verificationEntry) {
                return res.status(404).json({ error: 'Код подтверждения не обнаружен' });
            }

            const isCodeValid = await bcrypt.compare(code.trim(), verificationEntry.code);

            if (!isCodeValid) {
                return res.status(400).json({ error: 'Неверный код подтверждения' });
            }

            if (new Date() > new Date(verificationEntry.expires_at)) {
                return res.status(400).json({ error: 'Код подтверждения истек' });
            }

            await VerificationCode.destroy({ where: { email } });

            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        if (phone) {
            user.phone = phone;
        }

        await user.save();

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
};

const updateUserPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }

        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId;

        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Неверный текущий пароль' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Пароль успешно изменен' });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ error: 'Ошибка при смене пароля' });
    }
};


module.exports = { registration, authorization, checkUserInfo, updateUser, sendCode, updateUserPassword };

