const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
const bcrypt = require('bcrypt');
const { User} = require('../models/db');

const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: passwordHash });
        const token = jwt.sign(
            {
                userId: user.id,
            },
            SECRET,
            {
                expiresIn: '10d',
            }
        );


        // Отправка ответа клиенту
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
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
            { expiresIn: '10d' }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при входе в систему' });
    }
};

const checkUserInfo = async (req, res) => {
    try {
        // Извлечение токена из запроса
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            res.status(403).json({ error: 'У Вас нет доступа' });
        }

        // Проверка токена на валидность
        const decoded = jwt.verify(token, SECRET);

        // Извлечение id пользователя из токена
        const userId = decoded.userId;

        // Поиск пользователя в базе данных по id
        const user = await User.findByPk(userId);

        // Если пользователь не найден
        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Сравнение id, переданного в токене и извлеченного из базы данных
        if (user.id !== userId) {
            res.status(403).json({ error: 'Доступ запрещен' });
        }

        // Отправка информации о пользователе клиенту
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phone } = req.body;

        // Поиск пользователя в базе данных по userId
        const user = await User.findByPk(userId);

        // Если пользователь не найден
        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
            return;
        }

        // Обновление полей пользователя
        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();

        // Отправка обновленной информации о пользователе клиенту
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
};

module.exports = { registration, authorization, checkUserInfo, updateUser };

