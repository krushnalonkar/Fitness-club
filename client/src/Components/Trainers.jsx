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
                className="text-center mb-16"
            >
                <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Elite Coaching</p>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
                   The <span className="text-purple">Architects</span>
                </h2>
                <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                   Mastery in biomechanics, nutrition, and mental fortitude.
                </p>
            </Motion.div>
 
            {/* Trainers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-500 uppercase tracking-widest font-bold text-xs">Synchronizing Experts...</div>
                ) : (
                    trainers.map((trainer, index) => (
                        <Motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-dark-300 rounded-[2.5rem] overflow-hidden
                            hover:shadow-2xl hover:shadow-purple/10 transition-all duration-700
                            border border-white/5 hover:border-purple/30 cursor-pointer relative"
                        >
                            {/* IMAGE - FACE WILL BE VISIBLE */}
                            <div className="h-[28rem] overflow-hidden relative">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-dark-300 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                            </div>
 
                            {/* CONTENT - COMPACT LIKE REFERENCE CARD */}
                            <div className="p-8 text-left absolute bottom-0 left-0 w-full bg-linear-to-t from-dark-300 via-dark-300/90 to-transparent pt-20">
                                <p className="text-purple-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                                    {trainer.specialty}
                                </p>
                                <h3 className="text-2xl font-black mb-1 text-white uppercase tracking-tight">
                                    {trainer.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-purple/50"></div>
                                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                        {trainer.experience} Experience
                                    </p>
                                </div>
                            </div>
                        </Motion.div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Trainers;