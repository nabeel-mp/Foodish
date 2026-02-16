const User = require('../models/User');

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    // Check if already in wishlist to prevent duplicates
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    const populatedUser = await user.populate('wishlist');
    res.json(populatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    const populatedUser = await user.populate('wishlist');
    res.json(populatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};