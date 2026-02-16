const Cart = require('../models/Cart');

// Get Cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if item exists
    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist, push new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    // Return populated cart so frontend can display names/images immediately
    const populatedCart = await cart.populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== req.params.itemId);
      await cart.save();
      const populatedCart = await cart.populate('items.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Quantity
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === req.params.itemId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        // If quantity is 0, remove item
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      const populatedCart = await cart.populate('items.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};