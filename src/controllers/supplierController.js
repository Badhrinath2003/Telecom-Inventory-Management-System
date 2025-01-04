const db = require('../config/db');

const getAllSuppliers = async (req, res) => {
    try {
        const [suppliers] = await db.query('SELECT * FROM suppliers');
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
};

const addSupplier = async (req, res) => {
    try {
        const { s_name, contact_email, contact_phone } = req.body;
        const [result] = await db.execute(
            'INSERT INTO suppliers (s_name, contact_email, contact_phone) VALUES (?, ?, ?)',
            [s_name, contact_email, contact_phone]
        );
        res.status(201).json({ 
            message: 'Supplier added successfully', 
            s_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding supplier', error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { s_name, contact_email, contact_phone } = req.body;
        const { id } = req.params;
        const [result] = await db.execute(
            'UPDATE suppliers SET s_name = ?, contact_email = ?, contact_phone = ? WHERE s_id = ?',
            [s_name, contact_email, contact_phone, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM suppliers WHERE s_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
};

module.exports = {
    getAllSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
};