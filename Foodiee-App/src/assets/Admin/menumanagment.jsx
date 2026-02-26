import React, { useEffect, useState, useMemo } from "react";
import { 
  FaCloudArrowUp, 
  FaPenToSquare, 
  FaTrash, 
  FaMagnifyingGlass, 
  FaPlus, 
  FaCircleCheck, 
  FaCircleXmark, 
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Menu <span className="text-orange-500">Studio</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Manage your culinary items and stock availability.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-11 pr-4 py-3 w-full md:w-64 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-slate-200"
            >
              <FaPlus /> Add New Dish
            </button>
          </div>
        </header>

        {/* Table Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Kitchen...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Item Details</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Price</th>
                    <th className="px-6 py-5">Availability</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentProducts.map((p) => (
                    <tr key={p.id || p._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.img} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-1 ring-slate-100" />
                          <div>
                            <p className="font-black text-slate-900 leading-tight">{p.title}</p>
                            <p className="text-xs text-slate-400 italic line-clamp-1 max-w-[200px]">{p.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-black text-slate-900">₹{p.price}</td>
                      <td className="px-6 py-5">
                        {/* IOS TOGGLE SWITCH */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => toggleAvailability(p.id || p._id, p.isAvailable)}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${p.isAvailable ? 'bg-orange-500' : 'bg-slate-300'}`}
                            >
                                <motion.div 
                                    animate={{ x: p.isAvailable ? 24 : 2 }}
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                />
                            </button>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.isAvailable ? 'text-orange-600' : 'text-slate-400'}`}>
                                {p.isAvailable ? 'In Stock' : 'Out'}
                            </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-orange-500 hover:border-orange-200 transition-all">
                            <FaPenToSquare size={14} />
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, productId: p.id || p._id, productTitle: p.title })} 
                            className="p-3 bg-white border border-slate-200 text-rose-400 rounded-xl hover:bg-rose-50 hover:border-rose-100 transition-all">
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
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><FaChevronRight className="rotate-180"/></button>
            <span className="flex items-center px-4 font-black text-xs text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><FaChevronRight /></button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-8 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Modify Item' : 'Create New Item'}</h3>
                  <p className="text-slate-400 text-sm font-medium italic">Newly added items are 'In Stock' by default.</p>
                </div>
                <button onClick={closeModal} className="p-3 bg-slate-100 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                  <FaXmark size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className={`relative h-64 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all
                    ${imagePreview ? 'border-orange-500' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <FaCloudArrowUp size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <input 
                    name="title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required
                    placeholder="Dish Name"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      name="category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required
                      className="p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      name="price" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required
                      placeholder="Price (₹)"
                      className="p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm"
                    />
                  </div>
                  <textarea 
                    name="desc" rows="4" value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} required
                    placeholder="Short description..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold shadow-sm resize-none"
                  />
                  
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                    {editingId ? "Save Changes" : "Publish Dish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTrash size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900">Remove Item?</h4>
              <p className="text-slate-400 text-sm mt-2 mb-8">Are you sure you want to delete <span className="text-slate-900 font-bold">{deleteModal.productTitle}</span>?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteModal({ open: false })} className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold">Cancel</button>
                <button onClick={handleDeleteConfirmed} className="py-3 rounded-xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-200">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;
