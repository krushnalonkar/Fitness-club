import React from "react";
import { motion as Motion } from "framer-motion";
import aboutImg from "../assets/banner1.jpg";

function About() {
    return (
        <section
            id="about"
            className="bg-dark-200 text-white py-20 px-6 md:px-20"
        >
            {/* 🔥 Animated Section Header (Same as Services) */}
            <Motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
                    About <span className="text-purple-500">Our Gym</span>
                </h2>

                <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
                    Get to know more about our background, trainers and passion for fitness.
                </p>
            </Motion.div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Left Image with Animation */}
                <Motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="w-full h-100 md:h-125 overflow-hidden rounded-2xl"
                >
                    <img
                        src={aboutImg}
                        alt="Gym About"
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                </Motion.div>

                {/* Right Content with Animation */}
                <Motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h1 className="text-3xl md:text-6xl font-black mb-8 leading-[1.1] uppercase tracking-tighter text-left">
                        Build Your <span className="text-purple">Legendary</span> Body
                    </h1>
 
                    <p className="text-gray-400 mb-6 text-base leading-relaxed text-left">
                        Our gym is equipped with state-of-the-art machines, elite trainers, and a
                        motivating powerhouse atmosphere to help you shatter your limits.
                        Whether you're aiming for muscle mass, fat incineration, or peak athletic performance, we provide
                        the blueprint for your success.
                    </p>
 
                    <p className="text-gray-500 mb-10 text-sm italic border-l-2 border-purple pl-6 py-2 text-left">
                        "Your fitness journey is not a sprint, it's a transformation into a better version of yourself."
                    </p>
 
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div className="bg-dark-300 p-6 rounded-3xl border border-white/5 shadow-xl hover:border-purple/30 transition duration-500">
                            <h2 className="text-3xl font-black text-white">10+</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Years Legacy</p>
                        </div>
 
                        <div className="bg-dark-300 p-6 rounded-3xl border border-white/5 shadow-xl hover:border-purple/30 transition duration-500">
                            <h2 className="text-3xl font-black text-white">25+</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Master Coaches</p>
                        </div>
 
                        <div className="bg-dark-300 p-6 rounded-3xl border border-white/5 shadow-xl hover:border-purple/30 transition duration-500">
                            <h2 className="text-3xl font-black text-white">500+</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Active Athletes</p>
                        </div>
                    </div>
 
                    {/* Button */}
                    <div className="flex justify-start">
                        <button className="px-10 py-4 bg-purple hover:bg-purple-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-purple/20">
                            Discover More
                        </button>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
}

export default About;