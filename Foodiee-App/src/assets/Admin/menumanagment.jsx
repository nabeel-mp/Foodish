import React, { useEffect, useState, useRef } from "react";
import { FaCloudUploadAlt, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import api from "../../api/axios";

const MenuManagement = () => {
  const initialFormState = {
    title: "",
    category: "",
    price: "",
    desc: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null); // Stores the actual file object
  const [imagePreview, setImagePreview] = useState(null); // Stores the preview URL
  
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
  const productsPerPage = 8;
  const formRef = useRef(null);

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menuItems");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Handle Image File Selection ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local preview URL
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  // --- Validation ---
  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!form.desc) newErrors.desc = "Description is required.";
    
    // Require image only if creating new, or if user deleted previous image in edit mode
    if (!editingId && !imageFile) {
        newErrors.image = "Product image is required.";
    }

    return newErrors;
  };

  // --- Submit (Add/Edit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("desc", form.desc);
    
    // Append image only if a new file is selected
    if (imageFile) {
      formData.append("image", imageFile); // 'image' key must match backend multer config
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await api.put(`/menuItems/${editingId}`, formData, config);
      } else {
        await api.post("/menuItems", formData, config);
      }

      // Reset
      setForm(initialFormState);
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving Dish:", err);
      alert("Failed to save product. Please check console.");
    }
  };

  // --- Edit Mode ---
  const handleEdit = (product) => {
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      desc: product.desc,
    });
    // Set existing image as preview
    setImagePreview(product.img); 
    setImageFile(null); // Reset file input, we only send if user changes it
    setEditingId(product.id || product._id);
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // --- Delete Logic ---
  const confirmDelete = (id, title) => {
    setDeleteModal({ open: true, productId: id, productTitle: title });
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModal.productId) return;
    try {
      await api.delete(`/menuItems/${deleteModal.productId}`);
      fetchProducts();
      setDeleteModal({ open: false, productId: null, productTitle: "" });
      
      // Adjust pagination if page becomes empty
      const lastPage = Math.ceil((products.length - 1) / productsPerPage);
      if (currentPage > lastPage && lastPage > 0) setCurrentPage(lastPage);

    } catch (err) {
      console.error("Error deleting Dish:", err);
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const categories = ["Biriyani", "Burger", "Pizza", "Drinks", "Dessert", "Mandhi", "Snacks", "Others"];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-3xl font-extrabold text-gray-900">Menu Management</h2>
             <p className="text-gray-500 mt-1">Add, edit, or remove dishes from your menu.</p>
          </div>
        </div>

        {/* --- Form Section --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10" ref={formRef}>
           <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-yellow-500 pl-3">
             {editingId ? "Edit Dish" : "Add New Dish"}
           </h3>
           
           <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Image Upload */}
             <div className="lg:col-span-1">
               <label className="block text-sm font-bold text-gray-700 mb-2">Dish Image</label>
               <div className={`border-2 border-dashed rounded-2xl h-64 flex flex-col justify-center items-center relative overflow-hidden bg-gray-50 transition-colors ${errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:bg-yellow-50 hover:border-yellow-400'}`}>
                 
                 {imagePreview ? (
                   <>
                     <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold">Change Image</p>
                     </div>
                   </>
                 ) : (
                   <div className="text-center p-4">
                     <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                     <p className="text-sm text-gray-500 font-semibold">Click to upload</p>
                     <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                   </div>
                 )}
                 
                 <input 
                   type="file" 
                   name="image"
                   accept="image/*"
                   onChange={handleImageChange}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
               </div>
               {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
             </div>

             {/* Right Column: Inputs */}
             <div className="lg:col-span-2 space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <label className="block text-sm font-semibold text-gray-600 mb-1">Dish Title</label>
                   <input
                     name="title"
                     value={form.title}
                     onChange={handleChange}
                     placeholder="e.g. Chicken Biriyani"
                     className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                   />
                   {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                 </div>

                 <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-600 mb-1">Price (₹)</label>
                   <input
                     name="price"
                     type="number"
                     value={form.price}
                     onChange={handleChange}
                     placeholder="0.00"
                     className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                   />
                   {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                 <textarea
                   name="desc"
                   rows="3"
                   value={form.desc}
                   onChange={handleChange}
                   placeholder="Brief description of the dish..."
                   className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                 />
                 {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
               </div>

               <div className="flex gap-4 pt-2">
                 <button
                   type="submit"
                   className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600 hover:shadow-lg transition-all transform hover:-translate-y-1"
                 >
                   {editingId ? "Update Dish" : "Add Dish"}
                 </button>
                 {editingId && (
                   <button
                     type="button"
                     onClick={() => {
                        setEditingId(null);
                        setForm(initialFormState);
                        setImagePreview(null);
                        setImageFile(null);
                     }}
                     className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                   >
                     Cancel
                   </button>
                 )}
               </div>
             </div>
           </form>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
           {loading ? (
             <div className="p-10 text-center text-gray-500">Loading menu items...</div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                     <th className="p-4 font-semibold">Dish</th>
                     <th className="p-4 font-semibold">Category</th>
                     <th className="p-4 font-semibold">Price</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {currentProducts.map((p) => (
                     <tr key={p.id || p._id} className="hover:bg-yellow-50/50 transition-colors group">
                       <td className="p-4 flex items-center gap-4">
                         <img
                           src={p.img}
                           alt={p.title}
                           className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100"
                         />
                         <div>
                            <p className="font-bold text-gray-800">{p.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{p.desc}</p>
                         </div>
                       </td>
                       <td className="p-4">
                         <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                           {p.category}
                         </span>
                       </td>
                       <td className="p-4 font-bold text-gray-800">₹{p.price}</td>
                       <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button
                             onClick={() => handleEdit(p)}
                             className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                             title="Edit"
                           >
                             <FaEdit />
                           </button>
                           <button
                             onClick={() => confirmDelete(p.id || p._id, p.title)}
                             className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                             title="Delete"
                           >
                             <FaTrash />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
               <button
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(prev => prev - 1)}
                 className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Prev
               </button>
               {[...Array(totalPages)].map((_, i) => (
                 <button
                   key={i}
                   onClick={() => setCurrentPage(i + 1)}
                   className={`w-10 h-10 rounded-lg text-sm font-bold border ${
                     currentPage === i + 1
                       ? "bg-yellow-500 border-yellow-500 text-white"
                       : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
               <button
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(prev => prev + 1)}
                 className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Next
               </button>
             </div>
           )}
        </div>
      </div>

      {/* --- Delete Modal --- */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteModal.productTitle}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModal({ open: false, productId: null, productTitle: "" })}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;