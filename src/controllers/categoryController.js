const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (Users can see categories in Flutter)
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin

// const createCategory = async (req, res, next) => {
//     try {
//         const { name, description, image } = req.body;

//         const categoryExists = await Category.findOne({ name });
//         if (categoryExists) {
//             res.status(400);
//             throw new Error('Category already exists');
//         }

//         const category = await Category.create({
//             name,
//             description,
//             image // This will be the Cloudinary URL
//         });

//         res.status(201).json(category);
//     } catch (error) {
//         next(error);
//     }
// };
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        // Check if a file was actually uploaded
        const imageUrl = req.file ? req.file.path : ''; 

        const category = await Category.create({
            name,
            description,
            image: imageUrl // Save the URL to DB
        });
        res.status(201).json(category);
    } catch (error) { next(error); }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }

        // Update text fields
        category.name = name || category.name;

        // If a new image was uploaded via Multer/Cloudinary
        if (req.file) {
            category.image = req.file.path; 
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

// Add updateCategory to your exports
module.exports = { getCategories, createCategory, deleteCategory, updateCategory };