import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../storecontext/StoreContext";
import { FaHeartCirclePlus, FaHeart } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../../api/axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();
  const { user, wishlist, removeFromWishlist, addToWishlist } =
    useContext(StoreContext);

 useEffect(() => {
  AOS.init({
    duration: 100,
    easing: "ease-out", 
    once: true,    
    offset: 50,    
  });
}, []);


  useEffect(() => {
    api.get("/menuItems")
      .then((res) => {
        const data = res.data;
        const uniqueItems = data.filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.title === item.title)
        );
        setMenuItems(uniqueItems);
        setFilteredItems(uniqueItems);
      })
      .catch((err) => {
        console.error("Error fetching menu Items:", err);
      });
  }, []);

  useEffect(() => {
    let result = [...menuItems];

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(result);
  }, [search, category, sort, menuItems]);

  const categories = [
    "All",
    "Biriyani",
    "Burger",
    "Dessert",
    "Drinks",
    "Pizza",
    "Mandhi",
    "Snacks",
    "Others",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6 sm:px-10">
      <h2
        className="text-4xl font-bold text-yellow-400 text-center mb-8"
        data-aos="fade-down"
      >
        Explore Our Menu
      </h2>
      <p
        className="text-1xl text-center mb-8 font-medium"
        data-aos="fade-up"
      >
        explore our tasty dishes near you.
      </p>

      {/* Filters */}
      <div
        className="flex flex-wrap justify-center gap-5 mb-6"
        data-aos="zoom-in"
      >
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border border-yellow-400 w-60 text-white bg-transparent"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded border border-yellow-400 bg-yellow-400 font-semibold text-black"
        >
          {categories.map((item) => (
            <option key={item} value={item} className="bg-yellow-400 text-black">
              {item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 rounded border border-yellow-400 bg-yellow-400 font-semibold text-black"
        >
          <option value="" className="bg-yellow-400 text-black">
            Sort by
          </option>
          <option value="low" className="bg-yellow-400 text-black">
            Price: Low to High
          </option>
          <option value="high" className="bg-yellow-400 text-black">
            Price: High to Low
          </option>
        </select>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredItems.length === 0 ? (
          <p
            className="text-center text-gray-400 col-span-full mt-8"
            data-aos="fade-in"
          >
            No matching items found.
          </p>
        ) : (
          filteredItems.map((item, index) => {
            const itemId = item._id || item.id; 
            
            return (
              <div
                key={itemId || index} 
                className="bg-gray-700 p-4 rounded-bl-4xl rounded-tr-4xl rounded-br-xl rounded-tl-2xl shadow hover:shadow-lg transition"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={item.img}
                  alt={item.title || "Food item"}
                  className="w-full h-40 object-cover rounded mb-2 hover:scale-105 transition duration-200"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-yellow-400 font-bold">₹{item.price}</p>
                <p className="text-gray-400 capitalize">{item.category}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${itemId}`);
                  }}
                  className="mt-2 bg-yellow-400 text-black py-1 px-3 rounded hover:bg-yellow-300 cursor-pointer transition"
                >
                  View Details
                </button>

                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isWishlisted = wishlist.find(
                        (i) => (i._id || i.id) === itemId
                      );
                      
                      isWishlisted
                        ? removeFromWishlist(itemId)
                        : addToWishlist(item);
                    }}
                    className={`mt-2 ml-45 py-2 px-3 rounded cursor-pointer transition ${
                      wishlist.find((i) => (i._id || i.id) === itemId)
                        ? "bg-transparent text-red-400 hover:text-gray-600 hover:scale-50"
                        : "bg-transparent hover:scale-120 hover:text-green-300"
                    }`}
                  >
                    {wishlist.find((i) => (i._id || i.id) === itemId) ? (
                      <FaHeart size={30} />
                    ) : (
                      <FaHeartCirclePlus size={30} />
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Menu;