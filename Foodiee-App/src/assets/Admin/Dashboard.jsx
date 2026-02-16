import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [users, setUsers] =useState([])
  const [menus, setMenus]= useState([])
  const [orders, setOrders] =useState([])
  const navigate =useNavigate()


  useEffect(() => {
    const fetch =async ()=>{
      const user =await axios.get("http://localhost:3002/userDetails")
      const menus =await axios.get("http://localhost:3002/menuItems")
      const orders =await axios.get("http://localhost:3002/orders") 

      setUsers(user.data)
      setMenus(menus.data)
      setOrders(orders.data)
    }

    fetch()
  }, []);

  const totalusers= users.length
  const totalmenus =menus.length
  const totalordes =orders.length
  const totalrevenue =orders.reduce((acc,order)=>acc + order.total, 0)

  const data = {
    labels: ["Users", "Dishes", "Orders", "Revenue"],
    datasets: [
      {
        label: "Dashboard Stats",
        data: [totalusers, totalmenus, totalordes, totalrevenue],
        backgroundColor: ["#facc15", "#facc15", "#facc15", "#4ade80"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "yellow"
        }
      },
      x: {
        ticks: {
          color: "white"
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-6 sm:px-10">
    <div className=" space-y-5">
      <h2 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h2>
     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
  <div className="bg-yellow-400 p-4 rounded shadow">
    <h3 className="font-semibold">Users</h3>
    <p className="text-2xl">{totalusers}</p>
  </div>
  <div className="bg-yellow-400 p-4 rounded shadow">
    <h3 className="font-semibold">Dishes</h3>
    <p className="text-2xl">{totalmenus}</p>
  </div>
  <div className="bg-yellow-400 p-4 rounded shadow">
    <h3 className="font-semibold">Orders</h3>
    <p className="text-2xl">{totalordes}</p>
  </div>
  <div className="bg-yellow-400 p-4 rounded shadow">
    <h3 className="font-semibold">Revenue</h3>
    <p className="text-2xl text-green-600">₹{totalrevenue.toLocaleString()}</p>
  </div>
</div>
<div className="bg-gray-800 rounded-lg p-4 shadow-lg h-[400px]">
          <h3 className="text-yellow-400 font-semibold text-xl mb-3">Visual Summary</h3>
          <Bar data={data} options={options} />
        </div>

    </div>
    </div>
  );
};

export default Dashboard;
