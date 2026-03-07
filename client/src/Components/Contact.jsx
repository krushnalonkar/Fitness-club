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
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Get In <span className="text-purple-500">Touch</span>
                    </h2>
                    <p className="text-gray-400 mt-4">
                        Have questions? Contact us anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* ✅ LEFT SIDE */}
                    <div className="space-y-8">

                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className="text-purple-500 text-xl mt-1" />
                            <div>
                                <h4 className="font-semibold">Our Location</h4>
                                <p className="text-gray-400">
                                    Laksmi Nagar Parvti Pune 411009
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <FaPhoneAlt className="text-purple-500 text-xl mt-1" />
                            <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-gray-400">+91 7822061312</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <FaEnvelope className="text-purple-500 text-xl mt-1" />
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <p className="text-gray-400">lonkarkrushna13@gmail.com</p>
                            </div>
                        </div>

                        {/* 🔥 SOCIAL MEDIA ICONS (ADDED AT BOTTOM) */}
                        <div className="pt-4">
                            <h4 className="font-semibold mb-3">Follow Us</h4>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="bg-dark-300 p-3 rounded-full hover:bg-purple-600 transition duration-300 cursor-pointer"
                                >
                                    <FaFacebookF />
                                </a>
                                <a
                                    href="#"
                                    className="bg-dark-300 p-3 rounded-full hover:bg-purple-600 transition duration-300 cursor-pointer"
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href="#"
                                    className="bg-dark-300 p-3 rounded-full hover:bg-purple-600 transition duration-300 cursor-pointer"
                                >
                                    <FaTwitter />
                                </a>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-center">
                        <div className="w-full max-w-lg">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-dark-300/20 p-8 rounded-2xl shadow-xl border border-white/5 space-y-6"
                            >
                                <h3 className="text-xl font-bold text-center mb-4 uppercase tracking-tight">
                                    Send Us a <span className="text-purple">Message</span>
                                </h3>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-dark-400/20 border border-white/5 focus:border-purple focus:outline-none text-sm transition-all duration-300"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-dark-400/20 border border-white/5 focus:border-purple focus:outline-none text-sm transition-all duration-300"
                                    />

                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-dark-400/20 border border-white/5 focus:border-purple focus:outline-none text-sm transition-all duration-300 resize-none"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500/80 text-xs text-center font-medium bg-red-500/5 py-2 rounded-lg">{error}</p>
                                )}

                                {success && (
                                    <p className="text-green-500/80 text-xs text-center font-medium bg-green-500/5 py-2 rounded-lg">{success}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 rounded-xl font-bold bg-purple/90 hover:bg-purple transition text-sm cursor-pointer disabled:opacity-50 shadow-lg shadow-purple/10"
                                >
                                    {submitting ? "Sending..." : "Send Message"}
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