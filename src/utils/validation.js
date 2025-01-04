const validateUser = (req, res, next) => {
    const { username, password, email, type } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ 
            message: 'Please provide username, password and email' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'Password must be at least 6 characters long' 
        });
    }

    if (!['Admin', 'Manager', 'Staff'].includes(type)) {
        return res.status(400).json({ 
            message: 'Invalid user type' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Please provide a valid email address' 
        });
    }

    next();
};

const validateProduct = (req, res, next) => {
    const { p_name, stock_level, reorder_point } = req.body;

    if (!p_name) {
        return res.status(400).json({ 
            message: 'Product name is required' 
        });
    }

    if (stock_level < 0) {
        return res.status(400).json({ 
            message: 'Stock level cannot be negative' 
        });
    }

    if (reorder_point < 0) {
        return res.status(400).json({ 
            message: 'Reorder point cannot be negative' 
        });
    }

    next();
};

module.exports = {
    validateUser,
    validateProduct
};