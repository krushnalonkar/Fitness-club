import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaTwitter,
} from "react-icons/fa";
import axios from "axios";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "Inquiry from Website",
        message: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.name.trim().length < 3) {
            setError("Name must be at least 3 characters.");
            return;
        }

        if (!formData.email.includes("@")) {
            setError("Enter valid email address.");
            return;
        }

        if (formData.message.trim().length < 5) {
            setError("Message must be at least 5 characters.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/api/contacts", formData);
            setSuccess("Message sent successfully ✅");
            setFormData({
                name: "",
                email: "",
                subject: "Inquiry from Website",
                message: "",
            });
        } catch (err) {
            console.error("Contact Error:", err);
            setError(err.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setSubmitting(false);
        }

        setTimeout(() => {
            setSuccess("");
            setError("");
        }, 3000);
    };

    return (
        <section
            id="contact"
            className="bg-dark-200 text-white py-20 px-6 md:px-20"
        >
            <Motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto"
            >
                {/* Heading */}
                <div className="text-center mb-16">
                    <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Direct Communication</p>
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
                        Secure <span className="text-purple">Uplink</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                        Establish a direct connection with our tactical support squad.
                    </p>
                </div>
 
                <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
 
                    {/* ✅ LEFT SIDE */}
                    <div className="space-y-6">
                        <div className="bg-dark-300 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/5 rounded-full blur-3xl"></div>
                            
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaMapMarkerAlt size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Deployment Zone</h4>
                                    <p className="text-white font-bold text-sm">
                                        Laksmi Nagar Parvti Pune 411009
                                    </p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaPhoneAlt size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Emergency Line</h4>
                                    <p className="text-white font-bold text-sm">+91 7822061312</p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-dark-200 rounded-2xl flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all duration-500 shadow-lg">
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Data Channel</h4>
                                    <p className="text-white font-bold text-sm">lonkarkrushna13@gmail.com</p>
                                </div>
                            </div>
 
                            {/* 🔥 SOCIAL MEDIA ICONS */}
                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-6">Social Intelligence</h4>
                                <div className="flex gap-4">
                                    {[
                                        { icon: <FaFacebookF />, link: "#" },
                                        { icon: <FaInstagram />, link: "#" },
                                        { icon: <FaTwitter />, link: "#" }
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.link}
                                            className="w-10 h-10 bg-dark-200 border border-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-purple hover:text-white hover:border-purple transition-all duration-500 shadow-xl"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div className="flex justify-center">
                        <div className="w-full">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-dark-300 p-10 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-6 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple/5 rounded-full blur-3xl"></div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="IDENTIFICATION NAME"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-dark-200 border border-white/5 focus:border-purple/50 focus:outline-none text-[10px] font-black tracking-widest uppercase transition-all duration-500"
                                        />
                                    </div>
 
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="SECURE EMAIL ADDRESS"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-dark-200 border border-white/5 focus:border-purple/50 focus:outline-none text-[10px] font-black tracking-widest uppercase transition-all duration-500"
                                        />
                                    </div>
 
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            rows="5"
                                            placeholder="DESCRIBE ENQUIRY PARAMETERS..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-dark-200 border border-white/5 focus:border-purple/50 focus:outline-none text-[10px] font-black tracking-widest uppercase transition-all duration-500 resize-none"
                                        />
                                    </div>
                                </div>
 
                                {error && (
                                    <p className="text-red-500 text-[9px] text-center font-black uppercase tracking-widest bg-red-500/5 py-3 rounded-xl border border-red-500/20">{error}</p>
                                )}
 
                                {success && (
                                    <p className="text-green-500 text-[9px] text-center font-black uppercase tracking-widest bg-green-500/5 py-3 rounded-xl border border-green-500/20">{success}</p>
                                )}
 
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] bg-purple hover:bg-purple-700 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shadow-2xl shadow-purple/20 text-white"
                                >
                                    {submitting ? "Transmitting..." : "Send Intelligence"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </Motion.div>
        </section>
    );
}

export default Contact;