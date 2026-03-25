const Product = require('../models/Product');

// @desc    Get all products (For Flutter Home Screen)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) { next(error); }
};

// @desc    Get single product details
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (product) res.json(product);
        else { res.status(404); throw new Error('Product not found'); }
    } catch (error) { next(error); }
};

// @desc    Create a product (ADMIN ONLY)
// @route   POST /api/products
// const createProduct = async (req, res, next) => {
//     try {
//         const { name, price, description, images, category, quantity, color } = req.body;
//         const product = new Product({ name, price, description, images, category, quantity, color });
//         const createdProduct = await product.save();
//         res.status(201).json(createdProduct);
//     } catch (error) { next(error); }
// };

// const createProduct = async (req, res, next) => {
//     try {
//         const { name, price, description, category, quantity, color } = req.body;

//         // Map the uploaded file paths from Cloudinary to an array of strings
//         const imagePaths = req.files ? req.files.map(file => file.path) : [];

//         const product = new Product({
//             name,
//             price,
//             description,
//             category,
//             quantity,
//             color,
//             images: imagePaths, // Save the actual Cloudinary URLs here
//         });

//         const createdProduct = await product.save();
//         res.status(201).json(createdProduct);
//     } catch (error) {
//         next(error);
//     }
// };

const createProduct = async (req, res, next) => {
    try {
        // req.files is an array because we used upload.array()
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const product = await Product.create({
            ...req.body,
            images: imageUrls // Save array of URLs to DB
        });
        res.status(201).json(product);
    } catch (error) { next(error); }
};

// @desc    Update a product (ADMIN ONLY)
// @route   PUT /api/products/:id
// @desc    Update product details (Text only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update only the text fields
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            // Handle price (allowing 0 or decimals)
            if (req.body.price !== undefined) {
                product.price = Number(req.body.price); // ADD THIS
            }
            
            // Handle quantity (allowing 0)
            if (req.body.quantity !== undefined) {
                product.quantity = Number(req.body.quantity);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) { next(error); }
};

// @desc    Update product images alone
// @route   PUT /api/products/:id/images
const updateProductImages = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if files were uploaded
            if (!req.files || req.files.length === 0) {
                res.status(400);
                throw new Error('Please upload at least one image');
            }

            // Map new Cloudinary URLs to the images array
            const imageUrls = req.files.map(file => file.path);
            product.images = imageUrls;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) { next(error); }
};

// @desc    Delete a product (ADMIN ONLY)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else { res.status(404); throw new Error('Product not found'); }
    } catch (error) { next(error); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct,updateProductImages };