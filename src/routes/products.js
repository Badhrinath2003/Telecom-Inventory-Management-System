const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    searchProducts 
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const { validateProduct } = require('../utils/validation');

// Get all products
router.get('/', auth, getAllProducts);

// Search products
router.get('/search', auth, searchProducts);

// Add new product
router.post('/', auth, validateProduct, addProduct);

// Update product
router.put('/:id', auth, validateProduct, updateProduct);

// Delete product
router.delete('/:id', auth, deleteProduct);

module.exports = router;