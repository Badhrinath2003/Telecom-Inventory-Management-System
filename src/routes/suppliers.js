const express = require('express');
const router = express.Router();
// Fix the path to point to supplierController.js
const { 
    getAllSuppliers, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier 
} = require('../controllers/supplierController.js');
const auth = require('../middleware/auth');

router.get('/', auth, getAllSuppliers);
router.post('/', auth, addSupplier);
router.put('/:id', auth, updateSupplier);
router.delete('/:id', auth, deleteSupplier);

module.exports = router;