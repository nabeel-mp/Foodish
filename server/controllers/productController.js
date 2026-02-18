const Product = require('../models/Product');

// Get All Items
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
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
    const { title, category, price, desc, available } = req.body;

    const imgUrl = req.file ? `http://localhost:3002/uploads/${req.file.filename}` : '';
    const newProduct = new Product({
      title,
      category,
      price,
      desc,
      available: available === 'true' || available === true, // Convert to boolean
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
    const { title, category, price, desc, available } = req.body;

    const updateData = {
      title,
      category,
      price,
      desc,
      available: available === 'true' || available === true
    };

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