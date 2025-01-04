const express = require('express');
const router = express.Router();
const { 
    getAllCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllCategories);
router.post('/', auth, addCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;