import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./foodiee.jpeg";
import { StoreContext } from "../storecontext/Storecontext";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCartShopping, FaBasketShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";

const Navbar = () => {
  const { user, logout, cartItems, wishlist } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 py-2 shadow-md"
          : "bg-white/90 dark:bg-gray-900/90 py-4"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-gray-800 dark:text-white"
        >
          <img
            src={Logo}
            alt="Foodiee"
            className="w-10 h-10 rounded-full object-cover shadow-md"
          />
          <span className="text-yellow-500 drop-shadow">foodish.</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center font-medium text-gray-800 dark:text-white">
          {["/", "/menu", "/about", "/contact"].map((path, i) => (
            <li key={i}>
              <Link
                to={path}
                className={`transition ${
                  isActive(path)
                    ? "text-yellow-500 font-semibold"
                    : "hover:text-yellow-500"
                }`}
              >
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").charAt(0).toUpperCase() +
                    path.replace("/", "").slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <>
              {/* Cart */}
              <Link to="/cart" className="relative hover:text-yellow-500">
                <FaCartShopping size={23} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-black rounded-full px-1.5">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-red-400 hover:text-red-500"
              >
                <IoMdHeart size={23} />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-black rounded-full px-1.5">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Orders */}
              <Link
                to="/myorders"
                className={`hover:text-yellow-500 ${
                  isActive("/myorders") ? "text-yellow-500 font-semibold" : ""
                }`}
              >
                <FaBasketShopping size={23} />
              </Link>

              <span className="text-yellow-400 font-semibold">
                Hi, {user.name}
              </span>
            </>
          )}

          {/* Auth Button */}
          {user ? (
            <button onClick={handleLogout}>
              <RiAccountPinCircleFill
                size={32}
                className="text-yellow-500 cursor-pointer hover:scale-110 transition"
              />
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-300 font-medium text-black px-6 py-2 rounded-full hover:scale-105 transition shadow-md">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <span className="text-yellow-400 font-semibold text-sm">
              Hi, {user.name}
            </span>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-yellow-500 text-3xl transition-transform duration-300 hover:scale-110"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

    {/* Mobile Dropdown */}
{menuOpen && (
  <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700">
    <ul className="flex flex-col items-start px-6 py-4 space-y-4 font-medium text-gray-800 dark:text-white">
      <li>
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={isActive("/") ? "text-yellow-500 font-semibold" : ""}
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          to="/menu"
          onClick={() => setMenuOpen(false)}
          className={isActive("/menu") ? "text-yellow-500 font-semibold" : ""}
        >
          Menu
        </Link>
      </li>

      {/* Show only when logged in */}
      {user && (
        <>
          <li>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={isActive("/cart") ? "text-yellow-500 font-semibold" : ""}
            >
              Cart{" "}
              {cartItems?.length > 0 && (
                <span className="ml-2 bg-yellow-500 text-xs text-black rounded-full px-1.5">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </li>

          <li>
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={isActive("/wishlist") ? "text-yellow-500 font-semibold" : ""}
            >
              Favourites{" "}
              {wishlist?.length > 0 && (
                <span className="ml-2 bg-yellow-500 text-xs text-black rounded-full px-1.5">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </li>

          <li>
            <Link
              to="/myorders"
              onClick={() => setMenuOpen(false)}
              className={isActive("/myorders") ? "text-yellow-500 font-semibold" : ""}
            >
              My Orders
            </Link>
          </li>
        </>
      )}

      <li>
        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
          className={isActive("/about") ? "text-yellow-500 font-semibold" : ""}
        >
          About
        </Link>
      </li>

      <li>
        <Link
          to="/contact"
          onClick={() => setMenuOpen(false)}
          className={isActive("/contact") ? "text-yellow-500 font-semibold" : ""}
        >
          Contact
        </Link>
      </li>

      {/* Auth Button */}
      {user ? (
        <li>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left text-red-500 hover:underline"
          >
            Logout
          </button>
        </li>
      ) : (
        <li>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-4 py-2 rounded-md shadow hover:scale-105 transition"
          >
            Login
          </Link>
        </li>
      )}
    </ul>
  </div>
)}

    </header>
  );
};

export default Navbar;
