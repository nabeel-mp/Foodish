import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const DeliveryBoysManagement = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const fetchDeliveryBoys = async () => {
    try {
      const res = await api.get('/admin/delivery-boys');
      setDeliveryBoys(res.data);
    } catch (error) {
      console.error("Error fetching delivery boys", error);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/delivery-boys', formData);
      alert('Delivery Boy created successfully!');
      setFormData({ name: '', email: '', password: '', phone: '' }); // Reset form
      fetchDeliveryBoys(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error creating delivery boy");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Delivery Personnel Management</h2>

      {/* Add New Delivery Boy Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Delivery Boy</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="border p-2 rounded" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="border p-2 rounded" />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="border p-2 rounded" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded md:col-span-2 hover:bg-blue-700">
            Create Account
          </button>
        </form>
      </div>

      {/* Delivery Boys Availability Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Availability Status</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.map((boy) => (
              <tr key={boy._id} className="hover:bg-gray-50">
                <td className="p-3 border-b font-medium">{boy.name}</td>
                <td className="p-3 border-b">{boy.phone}</td>
                <td className="p-3 border-b">{boy.email}</td>
                <td className="p-3 border-b">
                  {boy.isAvailable ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      🟢 Available
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      🔴 Busy (On Delivery)
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {deliveryBoys.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">No delivery personnel found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryBoysManagement;