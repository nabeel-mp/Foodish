import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { FaUsers, FaUtensils, FaShoppingCart, FaWallet } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import api from "../../api/axios";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    menus: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [usersRes, menusRes, ordersRes] = await Promise.all([
          api.get("/userDetails"),
          api.get("/menuItems"),
          api.get("/orders"),
        ]);

        const totalRevenue = ordersRes.data.reduce(
          (acc, order) => acc + (order.total || 0),
          0
        );

        setStats({
          users: usersRes.data.length,
          menus: menusRes.data.length,
          orders: ordersRes.data.length,
          revenue: totalRevenue,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Chart Configuration ---
  const chartData = {
    labels: ["Users", "Menu Items", "Total Orders", "Revenue (x100)"],
    datasets: [
      {
        label: "Platform Metrics",
        data: [
          stats.users, 
          stats.menus, 
          stats.orders, 
          stats.revenue / 100 // Scaled down for visual balance if revenue is huge
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",   // Blue (Users)
          "rgba(234, 179, 8, 0.8)",    // Yellow (Menu)
          "rgba(249, 115, 22, 0.8)",   // Orange (Orders)
          "rgba(34, 197, 94, 0.8)",    // Green (Revenue)
        ],
        borderRadius: 8,
        barThickness: 50,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "System Overview",
        font: { size: 16, family: "'Poppins', sans-serif" },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { color: "#6b7280", font: { family: "'Poppins', sans-serif" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { family: "'Poppins', sans-serif" } },
      },
    },
  };

  // --- Stat Cards Data ---
  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <FaUsers />,
      color: "bg-blue-100 text-blue-600",
      border: "border-blue-200",
    },
    {
      title: "Menu Items",
      value: stats.menus,
      icon: <FaUtensils />,
      color: "bg-yellow-100 text-yellow-600",
      border: "border-yellow-200",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <FaShoppingCart />,
      color: "bg-orange-100 text-orange-600",
      border: "border-orange-200",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <FaWallet />,
      color: "bg-green-100 text-green-600",
      border: "border-green-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Admin <span className="text-yellow-500">Dashboard</span>
            </h2>
            <p className="text-gray-500 mt-1">Overview of your restaurant's performance.</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full shadow hover:bg-yellow-500 hover:text-gray-900 transition-colors">
            <HiTrendingUp /> View Reports
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${card.border} hover:shadow-lg transition-shadow duration-300 flex items-center justify-between`}
            >
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {loading ? "..." : card.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${card.color}`}>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Analytics Overview</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-[400px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading Chart Data...
              </div>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;