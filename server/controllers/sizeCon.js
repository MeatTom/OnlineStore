const { Size} = require("../models/db")
const formidable = require("formidable");
const form = new formidable.IncomingForm();

async function getAllSizes(req, res) {
    try {
        const sizes = await Size.findAll();
        res.status(200).json(sizes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get sizes' });
    }
}

async function addSize(req, res) {
    try {
        form.parse(req, async (err, fields) => {
            if (err) {
                console.error(err);
                res.status(500).json({message: 'Server error'});
                return;
            }

            const {size_name} = fields;
            const newSize = await Size.create({size_name});
            res.status(201).json(newSize);
        });
    }
    catch
        (err)
        {
            console.error(err);
            res.status(500).json({error: 'Failed to add size'});
        }
}

async function updateSize(req, res) {
    const { id } = req.params;
    try {
        form.parse(req, async (err, fields) => {
            const {size_name} = fields;
            const [rowsUpdated, [updatedSize]] = await Size.update({ size_name }, { where: { id }, returning: true });
        if (rowsUpdated === 0) {
            res.status(404).json({ error: 'Size not found' });
        } else {
            res.status(200).json(updatedSize);
        }
    }) }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update size' });
    }
}

async function deleteSize(req, res) {
    try {
        const { id } = req.params;
        await Size.destroy({ where: { id } });
        res.status(204).json({message: 'Товар успешно удалён'});
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSize= async (req, res) => {
    try {
        const tovarSize = await Size.findByPk(req.params.id);
        if (!tovarSize) {
            return res.status(404).json({message: 'Size not found'});
        }
        res.status(200).json(tovarSize);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
};

module.exports = {
    getAllSizes,
    updateSize,
    addSize,
    deleteSize,
    getSize
}