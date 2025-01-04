const express = require('express');
const router = express.Router();
const { 
    getAllTransactions, 
    getTransactionsByProduct, 
    createTransaction 
} = require('../controllers/stockTransactionController');
const auth = require('../middleware/auth');

// Get all stock transactions
router.get('/', auth, getAllTransactions);

// Get transactions for a specific product
router.get('/product/:productId', auth, getTransactionsByProduct);

// Add a new stock transaction (for stock in or stock out)
router.post('/', auth, createTransaction);

module.exports = router;
