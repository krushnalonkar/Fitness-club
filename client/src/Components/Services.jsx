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
    icon: <Dumbbell size={40} />,
    title: "Strength Training",
    desc: "Build muscle and increase strength with modern equipment and expert guidance.",
  },
  {
    icon: <Flame size={40} />,
    title: "Fat Loss Programs",
    desc: "Customized fat loss workouts designed to help you burn calories effectively.",
  },
  {
    icon: <HeartPulse size={40} />,
    title: "Cardio Training",
    desc: "Improve endurance and heart health with high-intensity cardio sessions.",
  },
  {
    icon: <Users size={40} />,
    title: "Personal Training",
    desc: "Get one-on-one coaching from certified trainers for faster results.",
  },
  {
    icon: <Apple size={40} />,
    title: "Diet & Nutrition",
    desc: "Personalized diet plans to support your fitness and transformation goals.",
  },
  {
    icon: <Timer size={40} />,
    title: "Flexible Workout Plans",
    desc: "Workout schedules designed to match your daily routine and lifestyle.",
  },
];

function Services() {
  return (
    <section
      id="services"
      className="bg-dark-300 text-white py-24 px-6 md:px-20"
    >
      {/* Section Header */}
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Elite Capabilities</p>
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
          Our <span className="text-purple">Performance</span>
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
          Shattering boundaries with world-class facilities and expert engineering.
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
            className="bg-dark-200 border border-white/5 rounded-[2rem] p-10 
                       hover:border-purple/30 hover:shadow-2xl hover:shadow-purple/10
                       transition-all duration-500 group cursor-pointer relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Icon */}
            <div className="w-16 h-16 bg-dark-300 rounded-2xl flex items-center justify-center text-purple mb-8 group-hover:bg-purple group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-xl">
              {service.icon}
            </div>
 
            {/* Title */}
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-white group-hover:text-purple transition-colors">
              {service.title}
            </h3>
 
            {/* Description */}
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              {service.desc}
            </p>
          </Motion.div>
        ))}
      </div>
    </section>
  );
}

export default Services;