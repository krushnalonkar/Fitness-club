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
        <h2 className="text-3xl md:text-5xl font-bold">
          Our <span className="text-purple-500">Services</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          We provide world-class fitness services to help you achieve your dream
          physique and live a healthier lifestyle.
        </p>
      </Motion.div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-dark-200 border border-dark-400 rounded-2xl p-8 
                       hover:border-purple-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
                       transition duration-300 group cursor-pointer"
          >
            {/* Icon */}
            <div className="text-purple-500 mb-6 group-hover:scale-110 transition duration-300">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3">
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