import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Static UI Data (Default placeholders)
import member1 from "../assets/trainer1.png";
import member2 from "../assets/trainer2.png";
import member3 from "../assets/trainer3.png";

const staticTestimonials = [
  {
    id: 1,
    name: "Rahul Patil",
    role: "Member - 6 Months",
    feedback: "Joining this gym was the best decision. Trainers are supportive and the workout environment is very motivating.",
    rating: 5,
    image: member1,
  },
  {
    id: 2,
    name: "Sneha Sharma",
    role: "Weight Loss Client",
    feedback: "I lost 12kg in 4 months. Proper training guidance and diet planning helped me transform completely.",
    rating: 5,
    image: member2,
  },
  {
    id: 3,
    name: "Amit Deshmukh",
    role: "Premium Member",
    feedback: "Best gym experience so far. Clean equipment, professional trainers and great vibe daily.",
    rating: 4,
    image: member3,
  },
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('/api/testimonials');
        if (res.data && res.data.length > 0) {
          const dbTestimonials = res.data.map((t) => ({
            id: t._id,
            name: t.name,
            role: t.role || 'Member',
            feedback: t.feedback,
            rating: t.rating,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=8b5cf6&color=fff&size=150`
          }));
          // Show DB items first, then static ones
          setTestimonials([...dbTestimonials, ...staticTestimonials]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      }
    };
    fetchTestimonials();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const current = testimonials[currentIndex];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
    ));
  };

  return (
    <section id="testimonials" className="bg-dark-200 text-white py-24 px-6 md:px-20">
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Member <span className="text-purple-500">Testimonials</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Real feedback from our members about their fitness journey and gym experience.
        </p>
      </Motion.div>

      <div
        className="max-w-5xl mx-auto relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={current.id || currentIndex}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="bg-dark-300 border border-dark-400 rounded-3xl p-8 md:p-12 shadow-xl hover:border-purple-500/70 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-purple-500">
                  <img src={current.image} alt={current.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-3">{renderStars(current.rating)}</div>
                <p className="text-gray-300 text-lg leading-relaxed mb-5 italic">“{current.feedback}”</p>
                <h3 className="text-xl font-semibold">{current.name}</h3>
                <p className="text-purple-500 text-sm mt-1">{current.role}</p>
              </div>
            </div>
          </Motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8 gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-purple-500" : "w-3 bg-gray-600"}`}
            />
          ))}
        </div>
      </div>

      {/* 🔥 View More Reviews Button Restored */}
      <div className="text-center mt-14">
        <button
          className="
            px-8 py-3 rounded-2xl
            bg-purple-600 hover:bg-purple-700
            font-semibold
            transition-all duration-300
            shadow-lg hover:shadow-purple-500/30 cursor-pointer"
        >
          View More Reviews
        </button>
      </div>
    </section>
  );
}

export default Testimonials;