
import React, { useState, useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { registerUser } = useContext(StoreContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => { 
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };


  const validateEmail =(email)=>{
    return /\S+@\S+\.\S+/.test(email)
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    const {name, email, password, role} =userData;

    if(!name || !email || !password){
        setError("All fields are required");
        return;
    }
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
  setError("Name should only contain letters and single spaces.");
  return;
}


    if(!validateEmail(email)){
        setError("Enter a valid Email");
        return;
    }

    if(password.length < 6){
        setError("password must be atlease 6 characters");
        return;
    }

    
const uppercase = /[A-Z]/
const symbol = /[!@#$%^&*(),.?":{}|<>]/

if (!uppercase.test(password)) {
  setError("Password must include at least one uppercase letter");
  return;
}

if (!symbol.test(password)) {
  setError("Password must include at least one special symbol");
  return;
}

    const success = await registerUser(userData);

    if (success) {
      navigate("/login");
    } else {
      setError("Email already exists.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-gray-800">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={userData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={userData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={userData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded text-white"
          />
          

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black cursor-pointer font-bold py-2 rounded hover:bg-yellow-500"
          >
            Register
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

