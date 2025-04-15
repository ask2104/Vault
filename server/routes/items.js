const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const Item = require('../models/Item');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images and PDFs only!');
        }
    }
});

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid item ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/items
// @desc    Create a new item
// @access  Public
router.post('/', 
    upload.single('receipt'),
    [
        check('title', 'Title is required').not().isEmpty(),
        check('purchaseDate', 'Purchase date is required').not().isEmpty(),
        check('category', 'Category is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newItem = new Item({
                title: req.body.title,
                description: req.body.description,
                purchaseDate: req.body.purchaseDate,
                expiryDate: req.body.expiryDate,
                category: req.body.category,
                receiptPath: req.file ? req.file.path : null
            });

            const item = await newItem.save();
            res.json(item);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Public
router.put('/:id', 
    upload.single('receipt'),
    async (req, res) => {
        try {
            console.log('Update request received for item:', req.params.id);
            console.log('Request body:', req.body);
            console.log('File:', req.file);

            let item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }

            // Create update object with all fields
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                purchaseDate: req.body.purchaseDate,
                expiryDate: req.body.expiryDate || null,
                category: req.body.category
            };

            // Only update receipt path if a new file is uploaded
            if (req.file) {
                updateData.receiptPath = `/uploads/${req.file.filename}`;
            }

            console.log('Updating with data:', updateData);

            // Update the item
            item = await Item.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }

            console.log('Item updated successfully:', item);
            res.json(item);
        } catch (err) {
            console.error('Update error:', err);
            res.status(500).json({ 
                msg: 'Server Error', 
                error: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }
);

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        await Item.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
