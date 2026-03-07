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
                    <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
                        Build Your Body & Transform Your Life
                    </h1>

                    <p className="text-gray-300 mb-6">
                        Our gym is equipped with modern machines, expert trainers, and a
                        motivating environment to help you achieve your fitness goals.
                        Whether you want to gain muscle, lose weight, or stay fit, we provide
                        personalized training programs for everyone.
                    </p>

                    <p className="text-gray-400 mb-8">
                        Join our fitness community and experience world-class training,
                        premium equipment, and a healthy lifestyle like never before.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5 shadow-lg">
                            <h2 className="text-2xl font-bold text-purple-500">10+</h2>
                            <p className="text-gray-400 text-sm">Years Experience</p>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5 shadow-lg">
                            <h2 className="text-2xl font-bold text-purple-500">25+</h2>
                            <p className="text-gray-400 text-sm">Expert Trainers</p>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5 shadow-lg">
                            <h2 className="text-2xl font-bold text-purple-500">500+</h2>
                            <p className="text-gray-400 text-sm">Happy Members</p>
                        </div>
                    </div>

                    {/* Button */}
                    <button className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition duration-300">
                        Learn More
                    </button>
                </Motion.div>
            </div>
        </section>
    );
}

export default About;