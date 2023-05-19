const { Stock, Tovar, Size} = require('../models/db');
const formidable = require("formidable");
const form = new formidable.IncomingForm();

async function addToStock(req, res){
    try {
        form.parse(req, async (err, fields) => {
        const { itemId, sizeId, quantity } = fields;
        const tovar = await Tovar.findByPk(itemId);
        if (!tovar) {
            return res.status(404).json({ error: 'Товар не найден' });
        }

        const size = await Size.findByPk(sizeId);
        if (!size) {
            return res.status(404).json({ error: 'Размер не найден' });
        }

        const stockItem = await Stock.create({
            itemId,
            sizeId,
            quantity,
        });

        res.status(201).json(stockItem);
    })} catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось добавить запись в таблицу stock' });
    }
}

async function updateStockItem(req, res){
    try {
        form.parse(req, async (err, fields) => {
        const { id } = req.params;
        const { quantity } = fields;

        const stockItem = await Stock.findByPk(id);
        if (!stockItem) {
            return res.status(404).json({ error: 'Запись в таблице stock не найдена' });
        }
        stockItem.quantity = quantity;
        await stockItem.save();

        res.status(200).json(stockItem);
    })} catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось обновить запись в таблице stock' });
    }
}

async function deleteStockItem (req, res) {
    try {
        const { id } = req.params;

        const stockItem = await Stock.findByPk(id);
        if (!stockItem) {
            return res.status(404).json({ error: 'Запись в таблице stock не найдена' });
        }

        await stockItem.destroy();

        res.status(200).json({ message: 'Запись успешно удалена из таблицы stock' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Не удалось удалить запись из таблицы stock' });
    }
}

async function getStockItems (req, res) {
    try {
        const stockItems = await Stock.findAll();
        res.status(200).json(stockItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Не удалось получить список записей из таблицы stock'});
    }
}

async function getStockItem (req, res) {
    try {
        const { itemId } = req.params;
        const stockItem = await Stock.findAll({ where: { itemId } });
        res.status(200).json(stockItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Не удалось получить список записей из таблицы stock для этого товара'});
    }
}

async function check_quantity (req, res) {
    const { itemId, sizeId } = req.params;
    try {
        const quantity = await Stock.findAll({
            where: {
                itemId: itemId,
                sizeId: sizeId
            }
        });

        if (quantity) {
            res.json({ quantity: quantity.amount });
        } else {
            res.json({ quantity: 0 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addToStock,
    updateStockItem,
    deleteStockItem,
    getStockItems,
    getStockItem,
    check_quantity
}