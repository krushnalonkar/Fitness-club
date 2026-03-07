import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaRegCheckCircle, FaExclamationCircle, FaBan } from 'react-icons/fa';

const TermsOfService = () => {
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
                        <FaFileContract size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Terms of <span className="text-purple">Service</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Agreement for Gym Membership</p>
                </div>

                {/* Content Sections */}
                <div className="grid gap-8">
                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaRegCheckCircle className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">1. Membership Rules</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            By joining Gym Portal, you agree to abide by our facility rules and code of conduct.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                            <li>Respect for other members and staff is mandatory.</li>
                            <li>Proper gym attire and footwear are required.</li>
                            <li>Equipment must be handled with care and wiped after use.</li>
                        </ul>
                    </section>

                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaExclamationCircle className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">2. Payments & Cancellations</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Membership fees are billed according to your chosen plan.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                <p className="text-white font-bold text-sm mb-1">Refund Policy</p>
                                <p className="text-gray-500 text-xs">All plan purchases are final. Refunds are only issued in case of billing errors.</p>
                            </div>
                            <div className="bg-dark-300 p-4 rounded-xl border border-dark-400">
                                <p className="text-white font-bold text-sm mb-1">Plan Transfers</p>
                                <p className="text-gray-500 text-xs text-balance">Memberships are non-transferable to other users or accounts.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-dark-100 p-8 rounded-3xl border border-dark-400">
                        <div className="flex items-center gap-4 mb-6">
                            <FaBan className="text-purple" />
                            <h2 className="text-2xl font-bold text-white">3. Termination</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Gym Portal reserves the right to suspend or terminate memberships for violation of facility rules, non-payment, or behavior that compromises the safety of others.
                        </p>
                    </section>
                </div>

                {/* Agreement Footer */}
                <div className="text-center">
                    <p className="text-gray-500 text-xs leading-relaxed max-w-2xl mx-auto">
                        By using this portal, you acknowledge that you have read and understood these terms. Continued use of our facilities constitutes acceptance of any future updates to these terms.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsOfService;
