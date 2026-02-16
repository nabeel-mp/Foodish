// import React from "react";

// const MenuForm = ({ form, setForm, handleSubmit, isEdit }) => {
//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-[#333] p-6 rounded shadow space-y-4 text-white"
//     >
//       <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit" : "Add"} Item</h2>

//       <input
//         type="text"
//         value={form.id}
//         placeholder="ID (optional)"
//         onChange={(e) => setForm({ ...form, id: e.target.value })}
//         className="w-full p-2 rounded text-black"
//       />

//       <input
//         type="text"
//         value={form.name}
//         placeholder="Item Name"
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         className="w-full p-2 rounded text-black"
//         required
//       />

//       <input
//         type="number"
//         value={form.price}
//         placeholder="Price"
//         onChange={(e) => setForm({ ...form, price: e.target.value })}
//         className="w-full p-2 rounded text-black"
//         required
//       />

//       <input
//         type="text"
//         value={form.category}
//         placeholder="Category"
//         onChange={(e) => setForm({ ...form, category: e.target.value })}
//         className="w-full p-2 rounded text-black"
//         required
//       />

//       <input
//         type="text"
//         value={form.img}
//         placeholder="Image URL"
//         onChange={(e) => setForm({ ...form, img: e.target.value })}
//         className="w-full p-2 rounded text-black"
//       />

//       {form.img && (
//         <img
//           src={form.img}
//           alt="Preview"
//           className="h-24 mt-2 rounded shadow border border-gray-600"
//         />
//       )}

//       <button
//         type="submit"
//         className="bg-yellow-400 px-4 rounded text-black hover:bg-amber-500 cursor-pointer"
//       >
//         {isEdit ? "Update" : "Add"}
//       </button>
//     </form>
//   );
// };

// export default MenuForm;
