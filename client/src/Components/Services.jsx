import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Dumbbell,
  HeartPulse,
  Flame,
  Users,
  Apple,
  Timer,
} from "lucide-react";

const services = [
  {
    icon: <Dumbbell size={32} />,
    title: "Strength Training",
    desc: "Build muscle and increase strength with modern equipment and expert guidance.",
  },
  {
    icon: <Flame size={32} />,
    title: "Fat Loss Programs",
    desc: "Customized fat loss workouts designed to help you burn calories effectively.",
  },
  {
    icon: <HeartPulse size={32} />,
    title: "Cardio Training",
    desc: "Improve endurance and heart health with high-intensity cardio sessions.",
  },
  {
    icon: <Users size={32} />,
    title: "Personal Training",
    desc: "Get one-on-one coaching from certified trainers for faster results.",
  },
  {
    icon: <Apple size={32} />,
    title: "Diet & Nutrition",
    desc: "Personalized diet plans to support your fitness and transformation goals.",
  },
  {
    icon: <Timer size={32} />,
    title: "Workout Plans",
    desc: "Workout schedules designed to match your daily routine and lifestyle.",
  },
];

function Services() {
  return (
    <section
      id="services"
      className="bg-[#0c0c0c] text-white py-20 px-6 md:px-20"
    >
      {/* Section Header */}
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          Our <span className="text-purple-600">Services</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
          We provide a wide range of fitness services to help you achieve your goals.
        </p>
      </Motion.div>
 
      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="bg-[#111] border border-white/5 rounded-xl p-8 
                       hover:border-purple-600/50 transition-all duration-300 group cursor-pointer"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              {service.icon}
            </div>
 
            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-white">
              {service.title}
            </h3>
 
            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {service.desc}
            </p>
          </Motion.div>
        ))}
      </div>
    </section>
  );
}

export default Services;