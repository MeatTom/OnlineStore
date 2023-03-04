const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

//Настройка хранилища файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image_storage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

//Проверка типа файлов
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//Создание экземпляра multer
const upload = multer({ storage, fileFilter });

const addProduct = async (req, res) => {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                const { name, description, price } = req.body;
                const image = req.file;

                if (!name || !price) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }

                if (!image) {
                    return res.status(400).json({ message: 'Missing image file' });
                }

                const imagePath = 'http://localhost:5000/' + image.path.replace(/\\/g, '/');

                const result = await pool.query
                ('INSERT INTO online_store.tovar (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, imagePath]);
                const tovar = result.rows[0];

                res.json(tovar);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    };

const getAllTovars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM online_store.tovar');
        const tovary = result.rows;
        res.json(tovary);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTovar = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM online_store.tovar WHERE id = $1', [id]);
        const tovar = result.rows[0];

        if (!tovar) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(tovar);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProductImage = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM online_store.tovar WHERE id = $1', [req.params.id]);
        const tovar = result.rows[0];

        if (!tovar) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const upload = multer({
            storage: multer.diskStorage({
                destination: './image_storage',
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
        }).single('image');

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json({ message: 'Error uploading file' });
            } else if (err) {
                console.log(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Image not found in request' });
            }

            tovar.image = 'http://localhost:5000/' + req.file.path.replace(/\\/g, '/');

            await pool.query('UPDATE online_store.tovar SET image = $1 WHERE id = $2',
                [tovar.image, tovar.id]);

            res.json(tovar);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProductInfo = async (req, res) => {
        try {
            const form = new formidable.IncomingForm();

            form.parse(req, async (err, fields) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Server error' });
                    return;
                }

                const { name, description, price } = fields;

                const result = await pool.query('SELECT * FROM online_store.tovar WHERE id = $1', [req.params.id]);
                const tovar = result.rows[0];

                if (!tovar) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                tovar.name = name || tovar.name;
                tovar.description = description || tovar.description;
                tovar.price = price || tovar.price;

                await pool.query(
                    'UPDATE online_store.tovar SET name = $1, description = $2, price = $3',
                    [tovar.name, tovar.description, tovar.price]
                );
                res.json(tovar);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    };


const deleteTovar = async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM online_store.tovar WHERE id = $1', [req.params.id]);
            const tovar = result.rows[0];

            if (!tovar) {
                return res.status(404).json({message: 'Product not found'});
            }

            if (tovar.image) {
                fs.unlinkSync(path.join(__dirname, '..', tovar.image));
            }

            await pool.query('DELETE FROM online_store.tovar WHERE id = $1', [req.params.id]);
            res.json({message: 'Product deleted successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Server error'});
        }
    };

module.exports = {getAllTovars, deleteTovar, addProduct, updateProductInfo, updateProductImage, getTovar};
