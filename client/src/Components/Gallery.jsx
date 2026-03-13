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
        <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Visual Excellence</p>
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
          The <span className="text-purple">Aesthetics</span>
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
          Premium atmosphere engineered for peak human performance.
        </p>
      </Motion.div>
 
      {/* 🏷️ Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveCategory(cat);
              setShowAll(false); // reset when category changes
            }}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95
              ${
                activeCategory === cat
                  ? "bg-purple text-white shadow-xl shadow-purple/30"
                  : "bg-dark-200 text-gray-500 border border-white/5 hover:border-purple/30 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
 
      {/* 🖼️ Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((item, index) => (
          <Motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl
            border border-white/5 hover:border-purple/30
            cursor-pointer aspect-square"
          >
            <img
              src={item.image}
              alt={item.category}
              className="w-full h-full object-cover object-center
              group-hover:scale-110 transition-transform duration-1000 filter grayscale group-hover:grayscale-0"
            />
 
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
              <div className="p-6 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] font-black text-purple uppercase tracking-[0.3em] mb-1">
                  {item.category}
                </p>
                <div className="h-0.5 w-8 bg-purple/50"></div>
              </div>
            </div>
          </Motion.div>
        ))}
      </div>
 
      {/* 🔥 View All Button */}
      {activeCategory === "All" && (
        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-10 py-4 bg-dark-200 border border-white/5 hover:border-purple/30
            rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            {showAll ? "Collapse Collection" : "Expand Collection"}
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;