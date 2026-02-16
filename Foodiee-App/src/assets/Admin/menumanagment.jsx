import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const MenuManagement = () => {
  const initialFormState = {
    title: "",
    category: "",
    price: "",
    img: "",
    desc: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    productId: null,
    productTitle: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const formRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3002/menuItems");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!form.img) newErrors.img = "Image URL is required.";
    if (!form.desc) newErrors.desc = "Description is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const data = { ...form, price: parseFloat(form.price) };
    try {
      if (editingId) {
        await axios.put(`http://localhost:3002/menuItems/${editingId}`, data);
      } else {
        await axios.post("http://localhost:3002/menuItems", data);
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving Dish:", err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const confirmDelete = (id, title) => {
    setDeleteModal({ open: true, productId: id, productTitle: title });
  };

  const handleDeleteConfirmed = async (e) => {
    e.preventDefault();
    if (!deleteModal.productId) return;
    try {
      await axios.delete(
        `http://localhost:3002/menuItems/${deleteModal.productId}`
      );
      fetchProducts();
      setDeleteModal({ open: false, productId: null, productTitle: "" });
      const lastPage = Math.ceil((products.length - 1) / productsPerPage);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      console.error("Error deleting Dish:", err);
    }
  };

  const handleDeleteCancel = (e) => {
    e.preventDefault();
    setDeleteModal({ open: false, productId: null, productTitle: "" });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 text-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400">
        Menu Management
      </h2>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mb-6 space-y-4 bg-gray-800 p-4 rounded-lg shadow-md text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Item Name"
              className="border p-2 rounded w-full "
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 rounded w-full font-medium"
              required
            >
              <option className="bg-amber-200 text-black font-medium" value="" >-- Select Category --</option>
              <option className="bg-amber-200 text-black font-medium" value="Biriyani">Biriyani</option>
              <option className="bg-amber-200 text-black font-medium" value="Burger">Burger</option>
              <option className="bg-amber-200 text-black font-medium" value="Pizza">Pizza</option>
              <option className="bg-amber-200 text-black font-medium" value="Drinks">Drinks</option>
              <option className="bg-amber-200 text-black font-medium" value="Dessert">Dessert</option>
              <option className="bg-amber-200 text-black font-medium" value="Mandhi">Mandhi</option>
              <option className="bg-amber-200 text-black font-medium" value="Snacks">Snacks</option>
              <option className="bg-amber-200 text-black font-medium" value="Others">Others</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="border p-2 rounded w-full "
              required
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              name="img"
              value={form.img}
              onChange={handleChange}
              placeholder="Image URL"
              className="border p-2 rounded w-full "
              required
            />
            {errors.img && (
              <p className="text-red-500 text-sm mt-1">{errors.img}</p>
            )}
          </div>
        </div>

        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
          required
        />
        {errors.desc && (
          <p className="text-red-500 text-sm mt-1">{errors.desc}</p>
        )}

        <button
          type="submit"
          className="bg-yellow-600 text-black font-semibold px-4 sm:px-6 py-2 rounded hover:bg-yellow-700 w-full sm:w-auto"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-3 sm:px-4 border text-black">Image</th>
                  <th className="py-2 px-3 sm:px-4 border text-black">Title</th>
                  <th className="py-2 px-3 sm:px-4 border text-black">
                    Category
                  </th>
                  <th className="py-2 px-3 sm:px-4 border text-black">Price</th>
                  <th className="py-2 px-3 sm:px-4 border text-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((p) => (
                  <tr key={p.id} className="bg-gray-900 text-white">
                    <td className="py-2 px-3 sm:px-4 border">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />
                    </td>
                    <td className="py-2 px-3 sm:px-4 border">{p.title}</td>
                    <td className="py-2 px-3 sm:px-4 border">{p.category}</td>
                    <td className="py-2 px-3 sm:px-4 border">₹{p.price}</td>
                    <td className="py-2 px-3 sm:px-4 border space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-300 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm text-black hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(p.id, p.title)}
                        className="bg-red-500 text-black px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded text-sm sm:text-base ${
                  currentPage === 1
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  type="button"
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm sm:text-base ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded text-sm sm:text-base ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-black">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-900">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {deleteModal.productTitle}
              </span>
              ?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
