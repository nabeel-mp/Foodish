const Product = require('../models/Product');

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

// Get All Items
exports.getProducts = async (req, res) => {
  try {
    const includeUnavailable = req.query.includeUnavailable === 'true';
    const filter = includeUnavailable ? {} : {
      $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }]
    };
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Item
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

// Create Product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { title, category, price, desc, isAvailable, available } = req.body;

    const imgUrl = req.file ? `${process.env.BACKEND_URL || 'https://foodish-backend-iovp.onrender.com'}/uploads/${req.file.filename}` : ''; const newProduct = new Product({
      title,
      category,
      price,
      desc,
      isAvailable: parseBoolean(isAvailable ?? available, true),
      img: imgUrl
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, desc, isAvailable, available } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (desc !== undefined) updateData.desc = desc;
    if (isAvailable !== undefined || available !== undefined) {
      updateData.isAvailable = parseBoolean(isAvailable ?? available, true);
    }

    // If a new image was uploaded, update the image field
    if (req.file) {
      updateData.img = `http://localhost:3002/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
