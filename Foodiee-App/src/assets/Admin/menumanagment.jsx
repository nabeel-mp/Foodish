import React, { useEffect, useState, useMemo } from "react";
import { 
  FaCloudArrowUp, 
  FaPenToSquare, 
  FaTrash, 
  FaMagnifyingGlass, 
  FaPlus, 
  FaChevronRight, 
  FaXmark 
} from "react-icons/fa6"; 
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const MenuManagement = () => {
  const initialFormState = {
    title: "",
    category: "",
    price: "",
    desc: "",
    isAvailable: true,
  };

  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, productId: null, productTitle: "" });
  const [currentPage, setCurrentPage] = useState(1);
  
  const productsPerPage = 8;
  const categories = ["Biriyani", "Burger", "Pizza", "Drinks", "Dessert", "Mandhi", "Snacks", "Others"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menuItems?includeUnavailable=true");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      await api.put(`/menuItems/${productId}`, { isAvailable: !currentStatus });
      setProducts(products.map(p => 
        (p.id === productId || p._id === productId) ? { ...p, isAvailable: !currentStatus } : p
      ));
      toast.success(!currentStatus ? "Marked: In Stock" : "Marked: Out of Stock");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? "Updating..." : "Creating...");
    
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await api.put(`/menuItems/${editingId}`, formData, config);
        toast.success("Dish updated successfully", { id: loadingToast });
      } else {
        await api.post("/menuItems", formData, config);
        toast.success("Dish added to menu", { id: loadingToast });
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error("Action failed", { id: loadingToast });
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialFormState);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id || product._id);
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      desc: product.desc,
      isAvailable: product.isAvailable ?? true,
    });
    setImagePreview(product.img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialFormState);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/menuItems/${deleteModal.productId}`);
      toast.success("Item removed");
      fetchProducts();
      setDeleteModal({ open: false, productId: null, productTitle: "" });
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Menu <span className="text-orange-500">Studio</span>
            </h2>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">Manage your culinary items and stock availability.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-11 pr-4 py-3 w-full lg:w-72 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
              <FaPlus /> <span className="whitespace-nowrap">Add New Dish</span>
            </button>
          </div>
        </header>

        {/* Content Area - No Table, Just Flexible Layout */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-200">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Kitchen...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {currentProducts.map((p) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={p.id || p._id} 
                  className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  {/* Category Badge */}
                  <span className="absolute top-6 left-6 z-10 px-2.5 py-1 bg-white/90 backdrop-blur text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm border border-slate-100">
                    {p.category}
                  </span>

                  <div className="relative h-44 mb-4 rounded-2xl overflow-hidden ring-1 ring-slate-100">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-slate-900 leading-tight pr-2">{p.title}</h3>
                      <span className="text-orange-600 font-black whitespace-nowrap">₹{p.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 italic line-clamp-2 min-h-[32px]">{p.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleAvailability(p.id || p._id, p.isAvailable)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${p.isAvailable ? 'bg-orange-500' : 'bg-slate-300'}`}
                      >
                        <motion.div 
                          animate={{ x: p.isAvailable ? 22 : 2 }}
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${p.isAvailable ? 'text-orange-600' : 'text-slate-400'}`}>
                        {p.isAvailable ? 'In Stock' : 'Out'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-all border border-transparent hover:border-orange-100">
                        <FaPenToSquare size={14} />
                      </button>
                      <button onClick={() => setDeleteModal({ open: true, productId: p.id || p._id, productTitle: p.title })} 
                        className="p-2.5 bg-slate-50 text-rose-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 shadow-sm active:scale-90 transition-all"
            >
              <FaChevronRight className="rotate-180"/>
            </button>
            <span className="font-black text-xs text-slate-500 uppercase tracking-widest bg-white px-6 py-4 rounded-2xl border border-slate-200">
              {currentPage} <span className="text-slate-300 mx-2">/</span> {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 shadow-sm active:scale-90 transition-all"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL (Optimized for Mobile) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900">{editingId ? 'Modify Item' : 'Create New Item'}</h3>
                  <p className="text-slate-400 text-xs font-medium italic hidden sm:block">Newly added items are 'In Stock' by default.</p>
                </div>
                <button onClick={closeModal} className="p-3 bg-slate-100 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                  <FaXmark size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div className="relative h-56 md:h-full min-h-[220px] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all
                    ${imagePreview ? 'border-orange-500 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <FaCloudArrowUp size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Dish Image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <input 
                      name="title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required
                      placeholder="Dish Name"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                    />
                    <select 
                      name="category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      name="price" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required
                      placeholder="Price (₹)"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                    />
                  </div>
                </div>

                <textarea 
                  name="desc" rows="3" value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} required
                  placeholder="Short description of the dish..."
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm resize-none"
                />
                
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                  {editingId ? "Save Changes" : "Publish Dish"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL (Z-Index fix and scale) */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrash size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900">Remove Item?</h4>
              <p className="text-slate-400 text-sm mt-2 mb-8 px-4">This action cannot be undone. <span className="text-slate-900 font-bold">{deleteModal.productTitle}</span> will be deleted.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteModal({ open: false })} className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={handleDeleteConfirmed} className="py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;