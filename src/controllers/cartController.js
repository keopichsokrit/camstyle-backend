const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (User/Admin)
exports.getCart = async (req, res) => {
    try {
        // Find cart for the logged-in user (from JWT)
        // .populate pulls data from the Product model
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.product',
            select: 'name price quantity' // Only pull the fields you requested
        });

        if (!cart) {
            return res.status(200).json({ items: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
        // 1. Check if product exists and check stock level
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Logic: If current stock is less than requested quantity
        if (product.quantity < quantity || product.quantity <= 0) {
            return res.status(400).json({ message: "Out of stock!" });
        }

        // 3. Subtract from Product Service stock in MongoDB Atlas
        product.quantity -= quantity;
        await product.save();

        // 4. Update or Create the Cart
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
            
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        } else {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
        }

        res.status(201).json(cart);

    } catch (error) {
        res.status(400).json({ message: "Error updating cart", error: error.message });
    }
};