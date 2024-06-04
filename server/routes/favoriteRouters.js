const express = require('express');
const router = express.Router();
const { addToFavorite, removeFavorite, getUserFavorites } = require('../controllers/favoriteCon');

router.post('/add-to-favorites', addToFavorite);
router.delete('/favorites/:itemId', removeFavorite);
router.get('/favorites',  getUserFavorites);

module.exports = router;
