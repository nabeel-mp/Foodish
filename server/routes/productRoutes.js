const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure a folder named 'uploads' exists in your 'server' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), protect, admin, createProduct);
router.put('/:id', upload.single('image'), protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;