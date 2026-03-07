import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaHistory } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-dark-200 pt-32 pb-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-12"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 bg-purple/10 rounded-2xl text-purple mb-4">
                        <FaShieldAlt size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Privacy <span className="text-purple">Policy</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Last Updated: March 2024</p>
                </div>

                {/* Content Sections */}
                <div className="grid gap-8">
                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaLock className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">Data Protection</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            At Gym Portal, your privacy is our top priority. We implement state-of-the-art security measures to protect your personal information from unauthorized access, alteration, or destruction.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                            <li>End-to-end encryption for sensitive data</li>
                            <li>Secure payment processing via Razorpay</li>
                            <li>Regular security audits and updates</li>
                        </ul>
                    </section>

                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaUserShield className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">Information Collection</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed space-y-4">
                            We collect only the information necessary to provide you with the best fitness experience. This includes:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                <p className="text-white font-bold text-sm mb-1">Personal Details</p>
                                <p className="text-gray-500 text-xs text-balance leading-relaxed">Name, email, and contact details for account management.</p>
                            </div>
                            <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                <p className="text-white font-bold text-sm mb-1">Fitness Progress</p>
                                <p className="text-gray-500 text-xs text-balance leading-relaxed">Weight, height, and workout history to track your journey.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaHistory className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">Cookie Policy</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            We use essential cookies to maintain your login session and provide a personalized dashboard experience. No third-party tracking cookies are used for advertising.
                        </p>
                    </section>
                </div>

                {/* Contact Footer */}
                <div className="bg-purple/5 border border-purple/20 p-8 rounded-3xl text-center">
                    <p className="text-gray-300 mb-2">Have questions about your data?</p>
                    <p className="text-white font-bold">privacy@gymportal.com</p>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
