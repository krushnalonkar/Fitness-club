import React from "react";
import { motion as Motion } from "framer-motion";
import aboutImg from "../assets/banner1.jpg";

function About() {
    return (
        <section
            id="about"
            className="bg-[#050505] text-white py-20 px-6 md:px-20"
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
                    About <span className="text-purple-600">Our Gym</span>
                </h2>

                <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
                    Get to know more about our background, trainers and passion for fitness.
                </p>
            </Motion.div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

                {/* Left Image */}
                <Motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="w-full h-80 md:h-120 overflow-hidden rounded-xl"
                >
                    <img
                        src={aboutImg}
                        alt="Gym About"
                        className="w-full h-full object-cover"
                    />
                </Motion.div>

                {/* Right Content */}
                <Motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-3xl md:text-5xl font-bold mb-6">
                        Build Your <span className="text-purple-600">Perfect</span> Body
                    </h3>
 
                    <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                        Our gym is equipped with state-of-the-art machines, elite trainers, and a
                        motivating powerhouse atmosphere to help you shatter your limits.
                        Whether you're aiming for muscle mass, fat loss, or peak athletic performance, we provide
                        the blueprint for your success.
                    </p>
 
                    <p className="text-gray-500 mb-8 text-sm italic border-l-2 border-purple-600 pl-4 py-1">
                        "Your fitness journey is not a sprint, it's a transformation into a better version of yourself."
                    </p>
 
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                            <h2 className="text-2xl font-bold text-white">10+</h2>
                            <p className="text-gray-500 text-[10px] uppercase font-semibold mt-1">Years Experience</p>
                        </div>
 
                        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                            <h2 className="text-2xl font-bold text-white">25+</h2>
                            <p className="text-gray-500 text-[10px] uppercase font-semibold mt-1">Certified Coaches</p>
                        </div>
 
                        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center">
                            <h2 className="text-2xl font-bold text-white">500+</h2>
                            <p className="text-gray-500 text-[10px] uppercase font-semibold mt-1">Happy Members</p>
                        </div>
                    </div>
 
                    {/* Button */}
                    <div className="flex justify-start">
                        <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition">
                            Learn More
                        </button>
                    </div>
                </Motion.div>
            </div>
        </section>
    );
}

export default About;