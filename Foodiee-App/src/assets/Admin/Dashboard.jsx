import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";
import { FaUsers, FaUtensils, FaShoppingCart, FaWallet } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import api from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    counts: { users: 0, products: 0, orders: 0, revenue: 0 },
    charts: { monthlyRevenue: [], ordersByStatus: [] },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to convert Mongo month number (1-12) to short name
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 15 seconds for real-time updates
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  // --- Chart Data Configuration ---
  const overviewChartData = {
    labels: ["Users", "Menu Items", "Total Orders", "Revenue (x100)"],
    datasets: [
      {
        label: "Platform Metrics",
        data: [
          stats.counts.users, 
          stats.counts.products, 
          stats.counts.orders, 
          stats.counts.revenue / 100 // Scaled for visualization
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const revenueTrendData = {
    // Map _id (month number) to a readable name
    labels: stats.charts.monthlyRevenue.map(item => getMonthName(item._id)),
    datasets: [
      {
        label: "Revenue (₹)",
        data: stats.charts.monthlyRevenue.map(item => item.total),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.counts.users,
      icon: <FaUsers />,
      color: "bg-blue-100 text-blue-600",
      border: "border-blue-200",
    },
    {
      title: "Menu Items",
      value: stats.counts.products,
      icon: <FaUtensils />,
      color: "bg-yellow-100 text-yellow-600",
      border: "border-yellow-200",
    },
    {
      title: "Total Orders",
      value: stats.counts.orders,
      icon: <FaShoppingCart />,
      color: "bg-orange-100 text-orange-600",
      border: "border-orange-200",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.counts.revenue.toLocaleString()}`,
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
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Overview of your restaurant's performance. 
              {!loading && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </p>
          </div>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">System Overview</h3>
            <div className="h-[300px] w-full">
              {loading ? <p className="text-center text-gray-400">Loading...</p> : <Bar data={overviewChartData} options={chartOptions} />}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Trends</h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : stats.charts.monthlyRevenue.length > 0 ? (
                <Bar data={revenueTrendData} options={chartOptions} />
              ) : (
                 <div className="h-full flex items-center justify-center text-gray-400">
                  Not enough data for trends yet.
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;