const db = require('../config/db');

const createTransaction = async (req, res) => {
    const { productId, quantity, transactionType, transactionDate } = req.body;

    // Validate transaction type
    if (transactionType !== 'in' && transactionType !== 'out') {
        return res.status(400).json({
            message: 'Invalid transaction type.',
        });
    }

    try {
        // Step 1: Find the product by ID
        const [product] = await db.execute('SELECT * FROM products WHERE p_id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        // Step 2: Ensure sufficient stock for stock-out transactions
        if (transactionType === 'out' && product[0].stock_level < quantity) {
            return res.status(400).json({
                message: 'Not enough stock.',
            });
        }

        // Step 3: Update the product stock level based on the transaction type
        let updatedStockLevel = product[0].stock_level;
        if (transactionType === 'in') {
            updatedStockLevel += quantity;
        } else if (transactionType === 'out') {
            updatedStockLevel -= quantity;
        }

        // Step 4: Create the stock transaction record (INSERT into stock_transactions)
        const transactionDateToUse = transactionDate || new Date().toISOString().slice(0, 19).replace('T', ' '); // Default to current date if not provided
        const [transactionResult] = await db.execute(
            `INSERT INTO stock_transactions (product_id, quantity, transaction_type, transaction_date)
            VALUES (?, ?, ?, ?)`,
            [productId, quantity, transactionType, transactionDateToUse]
        );

        // Step 5: Update the product stock level (UPDATE products)
        await db.execute('UPDATE products SET stock_level = ? WHERE p_id = ?', [updatedStockLevel, productId]);

        // Return the success response
        return res.status(201).json({
            message: 'Transaction created successfully.',
            transactionId: transactionResult.insertId,
            updatedStockLevel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
        });
    }
};
// Get all stock transactions
const getAllTransactions = async (req, res) => {
    try {
        // Step 1: Query all transactions with product details
        const [transactions] = await db.query(`
            SELECT st.transaction_id, st.product_id, st.quantity, st.transaction_type, 
                   st.transaction_date, p.p_name AS product_name, c.category_name AS category
            FROM stock_transactions st
            LEFT JOIN products p ON st.product_id = p.p_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            ORDER BY st.transaction_date DESC
        `);

        return res.status(200).json({
            transactions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
        });
    }
};

// Get transactions for a specific product
const getTransactionsByProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Step 1: Validate if the product exists (this can also be done as part of the query itself)
        const [product] = await db.execute('SELECT * FROM products WHERE p_id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).json({
                message: 'Product not found.',
            });
        }

        // Step 2: Query transactions for the specific product
        const [transactions] = await db.query(`
            SELECT st.transaction_id, st.product_id, st.quantity, st.transaction_type, 
                   st.transaction_date, p.p_name AS product_name, c.category_name AS category
            FROM stock_transactions st
            LEFT JOIN products p ON st.product_id = p.p_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE st.product_id = ?
            ORDER BY st.transaction_date DESC
        `, [productId]);

        return res.status(200).json({
            transactions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error.',
        });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionsByProduct
};

/*
CREATE TABLE stock_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT,
    transaction_type ENUM('in', 'out'),
    transaction_date DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(p_id)
);
*/
