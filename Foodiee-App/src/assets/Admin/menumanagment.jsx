import React, { useEffect, useState, useRef, useMemo } from "react";
import { FaCloudUploadAlt, FaEdit, FaTrash, FaSearch, FaPlus, FaUtensils, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../api/axios";

const MenuManagement = () => {
  const initialFormState = {
    title: "",
    category: "",
    price: "",
    desc: "",
    available: true, 
  };

  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, productId: null, productTitle: "" });
  const [currentPage, setCurrentPage] = useState(1);
  
  const productsPerPage = 8;
  const formRef = useRef(null);
  const categories = ["Biriyani", "Burger", "Pizza", "Drinks", "Dessert", "Mandhi", "Snacks", "Others"];

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menuItems");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Search & Filter Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      newErrors.price = "Valid price is required.";
    }
    if (!form.desc.trim()) newErrors.desc = "Description is required.";
    if (!editingId && !imageFile) newErrors.image = "Image is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await api.put(`/menuItems/${editingId}`, formData, config);
      } else {
        await api.post("/menuItems", formData, config);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert("Failed to save. Check console for details.");
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      desc: product.desc,
      available: product.available ?? true,
    });
    setImagePreview(product.img);
    setImageFile(null);
    setEditingId(product.id || product._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/menuItems/${deleteModal.productId}`);
      fetchProducts();
      setDeleteModal({ open: false, productId: null, productTitle: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Menu Studio</h2>
            <p className="text-slate-500 font-medium">Manage your culinary offerings with precision.</p>
          </div>
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
            <input
              type="text"
              placeholder="Search dishes, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 w-full md:w-80 rounded-2xl border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
        </header>

        {/* --- Form Card --- */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10 mb-12" ref={formRef}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              {editingId ? <FaEdit size={20}/> : <FaPlus size={20}/>}
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {editingId ? "Modify Existing Dish" : "Create New Dish"}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Image Upload Area */}
            <div className="lg:col-span-4">
              <div className={`group relative h-72 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                ${errors.image ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-yellow-400 hover:bg-yellow-50/30'}`}>
                
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <p className="text-white font-bold px-4 py-2 border-2 border-white rounded-full">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                      <FaCloudUploadAlt className="text-3xl text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-700">Upload Image</p>
                    <p className="text-xs text-slate-400 mt-1">High-res JPG or PNG</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {errors.image && <p className="text-red-500 text-xs font-bold mt-3 ml-2 italic">*{errors.image}</p>}
            </div>

            {/* Inputs Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Dish Name</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Truffle Pizza" 
                    className="w-full px-5 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 transition-all outline-none" />
                  {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none">
                    <option value="">Choose...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00"
                    className="w-full px-5 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none" />
                  {errors.price && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.price}</p>}
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 ring-1 ring-slate-200 rounded-2xl h-[60px] mt-auto">
                  <span className="text-sm font-bold text-slate-700">Availability</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                <textarea name="desc" rows="3" value={form.desc} onChange={handleChange} placeholder="What makes this dish special?"
                  className="w-full px-5 py-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none" />
                {errors.desc && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.desc}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
                  {editingId ? "Update Menu Item" : "Publish to Menu"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Fetching your menu...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center">
              <FaUtensils className="mx-auto text-5xl text-slate-200 mb-4" />
              <h4 className="text-xl font-bold text-slate-800">No dishes found</h4>
              <p className="text-slate-500">Try adjusting your search or add a new item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-[0.1em]">
                    <th className="px-8 py-5">Dish Details</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Price</th>
                    <th className="px-8 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentProducts.map((p) => (
                    <tr key={p.id || p._id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.img} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-900">{p.title}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 max-w-[180px]">{p.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {p.available ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                            <FaCheckCircle /> Live
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                            <FaTimesCircle /> Hidden
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 font-black text-slate-900">₹{p.price}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, productId: p.id || p._id, productTitle: p.title })} 
                            className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <FaTrash size={14} />
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition-all">
                  Previous
                </button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black disabled:opacity-40 transition-all shadow-md shadow-slate-200">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaTrash size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Remove Item?</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.productTitle}"</span>? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeleteModal({ open: false, productId: null, productTitle: "" })}
                className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
                Keep it
              </button>
              <button onClick={handleDeleteConfirmed}
                className="py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95">
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