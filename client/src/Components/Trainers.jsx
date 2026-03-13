import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";

function Trainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await axios.get('/api/trainers');
                setTrainers(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch Trainers Public Error:", error);
                setLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    return (
        <section
            id="trainers"
            className="bg-dark-200 text-white py-20 px-6 md:px-20"
        >
            {/* Section Header */}
            <Motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <h2 className="text-3xl md:text-4xl font-bold">
                    Meet Our <span className="text-purple-500">Expert Trainers</span>
                </h2>

                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                    Our certified trainers guide you with proper technique,
                    motivation, and personalized workout plans to achieve your dream physique.
                </p>
            </Motion.div>

            {/* Trainers Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-400">Loading our experts...</div>
                ) : (
                    trainers.map((trainer, index) => (
                        <Motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-dark-300 rounded-2xl overflow-hidden
                            hover:-translate-y-2 transition-all duration-300
                            border border-dark-400 hover:border-purple-500
                            hover:shadow-lg cursor-pointer"
                        >
                            {/* IMAGE - FACE WILL BE VISIBLE */}
                            <div className="h-80 overflow-hidden">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            {/* CONTENT - COMPACT LIKE REFERENCE CARD */}
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-semibold mb-1">
                                    {trainer.name}
                                </h3>

                                <p className="text-purple-500 font-medium text-sm mb-1">
                                    {trainer.specialty}
                                </p>

                                <p className="text-gray-400 text-sm mb-2">
                                    {trainer.experience} Experience
                                </p>
                            </div>
                        </Motion.div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Trainers;