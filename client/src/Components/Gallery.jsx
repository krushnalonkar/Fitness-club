import React, { useState } from "react";
import { motion as Motion } from "framer-motion";

// 🔥 Images
import gym1 from "../assets/Gallery/interior1.jpg";
import gym2 from "../assets/Gallery/interior2.jpg";
import gym3 from "../assets/Gallery/interior3.jpg";
import gym4 from "../assets/Gallery/interior4.jpg";
import equip1 from "../assets/Gallery/equip1.jpg";
import equip2 from "../assets/Gallery/equip2.jpg";
import equip3 from "../assets/Gallery/equip3.jpg";
import trainer1 from "../assets/Gallery/traner1.jpg";
import trainer2 from "../assets/Gallery/traner2.jpg";
import workout1 from "../assets/Gallery/workout1.jpg";
import transform1 from "../assets/Gallery/transform1.jpg";
import transform2 from "../assets/Gallery/transform2.jpg";

// 🧠 Static data
const galleryData = [
  { id: 1, category: "Interior", image: gym1 },
  { id: 2, category: "Interior", image: gym2 },
  { id: 3, category: "Equipment", image: equip1 },
  { id: 4, category: "Equipment", image: equip2 },
  { id: 5, category: "Trainers", image: trainer1 },
  { id: 6, category: "Workout", image: workout1 },
  { id: 7, category: "Transformations", image: transform1 },
  { id: 8, category: "Transformations", image: transform2 },
  { id: 9, category: "Interior", image: gym3 },
  { id: 10, category: "Equipment", image: equip3 },
  { id: 11, category: "Interior", image: gym4 },
  { id: 12, category: "Trainers", image: trainer2 },
];

const categories = [
  "All",
  "Interior",
  "Equipment",
  "Trainers",
  "Workout",
  "Transformations",
];

function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  // 🔎 Filter Logic
  const filteredImages =
    activeCategory === "All"
      ? showAll
        ? galleryData
        : galleryData.slice(0, 8)
      : galleryData.filter((item) => item.category === activeCategory);

  return (
    <section
      id="gallery"
      className="bg-dark-300 text-white py-20 px-6 md:px-20"
    >
      {/* 🧾 Heading */}
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Our <span className="text-purple-500">Gym Gallery</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Explore our gym interior, equipment, trainers, workout sessions and
          real member transformations.
        </p>
      </Motion.div>

      {/* 🏷️ Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveCategory(cat);
              setShowAll(false); // reset when category changes
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-dark-300 text-gray-300 border border-dark-400 hover:border-purple-500 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🖼️ Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((item, index) => (
          <Motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl
            border border-dark-400 hover:border-purple-500
            cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.category}
              className="w-full h-64 object-cover object-center
              group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
              <div className="p-4 w-full bg-linear-to-t from-black/70 to-transparent">
                <p className="text-sm font-semibold text-purple-400">
                  {item.category}
                </p>
              </div>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* 🔥 View All Button */}
      {activeCategory === "All" && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 
            rounded-full text-white font-semibold transition duration-300"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;