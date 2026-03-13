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
            className="bg-[#0c0c0c] text-white py-20 px-6 md:px-20"
        >
            <Motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto"
            >
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Contact <span className="text-purple-600">Us</span>
                    </h2>
                    <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
                        Have questions or need assistance? Feel free to reach out to us.
                    </p>
                </div>
 
                <div className="grid md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
 
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        <div className="bg-[#111] p-8 rounded-xl border border-white/5 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-600">
                                    <FaMapMarkerAlt size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Our Location</h4>
                                    <p className="text-white text-sm">
                                        Laksmi Nagar Parvti Pune 411009
                                    </p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-600">
                                    <FaPhoneAlt size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Call Us</h4>
                                    <p className="text-white text-sm">+91 7822061312</p>
                                </div>
                            </div>
 
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-600">
                                    <FaEnvelope size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Email Us</h4>
                                    <p className="text-white text-sm">lonkarkrushna13@gmail.com</p>
                                </div>
                            </div>
 
                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-4">Follow Us</h4>
                                <div className="flex gap-3">
                                    {[
                                        { icon: <FaFacebookF />, link: "#" },
                                        { icon: <FaInstagram />, link: "#" },
                                        { icon: <FaTwitter />, link: "#" }
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.link}
                                            className="w-10 h-10 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div className="w-full">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-[#111] p-8 rounded-xl border border-white/5 space-y-4"
                        >
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-600 focus:outline-none text-sm text-white transition-all"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-600 focus:outline-none text-sm text-white transition-all"
                            />
                            <textarea
                                name="message"
                                rows="4"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-600 focus:outline-none text-sm text-white transition-all resize-none"
                            />
 
                            {error && (
                                <p className="text-red-500 text-xs py-2">{error}</p>
                            )}
 
                            {success && (
                                <p className="text-green-500 text-xs py-2">{success}</p>
                            )}
 
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                            >
                                {submitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </Motion.div>
        </section>
    );
}

export default Contact;