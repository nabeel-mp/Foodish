
import React from 'react';
import './menu.css';
import food1 from './biriyani3-photoroom.png';
import food2 from './burger.png';
import food3 from './dessert.png';
import food4 from './noodles.png';

const Menu1 = ({ category, setCategory }) => {
  const Explore = [
    { id: 1, img: food1, title: "Authentic Biriyani" },
    { id: 2, img: food3, title: "Desserts" },
    { id: 3, img: food2, title: "Burgers" },
    { id: 4, img: food4, title: "Noodless" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-4">
          Explore Our Menu
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">
          Pick your favorite dish and enjoy authentic taste delivered to your doorstep.
        </p>
      </div>

      <div className="explore-menu" id="explore-menu">
        {Explore.map((item, index) => (
          <div
            key={index}
            onClick={() => setCategory(prev => prev === item.title ? "All" : item.title)}
            className="explore-menu-list"
          >
            <img className={category === item.title ? "active" : ""} src={item.img} alt={item.title} />
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default Menu1;
