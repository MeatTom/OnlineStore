const { Favorite, Tovar} = require('../models/db');
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const addToFavorite = async (req, res) => {
    try {
    const { itemId } = req.body;
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
        return res.status(403).json({ error: 'У Вас нет доступа' });
    }
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.userId;

        const item = await Tovar.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Товар с введённым id не найден' });
        }

        const existingFavorite = await Favorite.findOne({ where: { userId, itemId } });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Товар уже добавлен в избранное' });
        }

    const favorite = await Favorite.create({ userId, itemId});
        res.json(favorite);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ message: 'Ошибка при добавлении в избранное'});
    }
};

const getUserFavorites = async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(403).json({ error: 'У Вас нет доступа' });
        }
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId;

        const favorites = await Favorite.findAll({
            where: { userId },
            include: Tovar
        });
        res.json(favorites);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Недействительный токен' });
        }
        res.status(500).json({ message: 'Ошибка при получении избранного', error});
    }
};

const removeFavorite = async (req, res) => {
    const { itemId } = req.params;
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
        return res.status(403).json({ error: 'У Вас нет доступа' });
    }
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.userId;

    try {
        const favorite = await Favorite.findOne({ where: { userId, itemId } });
        if (!favorite) {
            return res.status(404).json({ message: 'Товар с введённым id не найден в избранном' });
        }

        await Favorite.destroy({ where: { userId, itemId } });
        res.json({ message: 'Товар удален из избранного' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении из избранного' });
    }
};


module.exports = {
    addToFavorite,
    removeFavorite,
    getUserFavorites,
}
