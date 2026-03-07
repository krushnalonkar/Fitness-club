import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaCheckCircle, FaTimes, FaLock, FaSpinner, FaChevronRight, FaRegCheckCircle, FaQrcode } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm, SiVisa, SiMastercard } from 'react-icons/si';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, plan, onPaymentSuccess }) => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState('method'); // method, processing, success
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setStep('method');
            setSelectedMethod(null);
            setLoading(false);
            setError('');
        }
    }, [isOpen]);

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);
            setError('');

            // 1. Create Order on Backend
            const amountStr = plan?.price.replace(/[^0-9]/g, '');
            const amount = parseInt(amountStr);

            const { data } = await axios.post('/api/payments/create-order', {
                amount,
                planId: plan?._id
            });

            const options = {
                key: 'rzp_test_6pG8AasXwVn53F', // This should match backend or come from config
                amount: data.amount,
                currency: 'INR',
                name: 'Antigravity Gym',
                description: `Payment for ${plan?.name} Membership`,
                image: '/logo.png', // Add your logo path
                order_id: data.orderId,
                handler: async function (response) {
                    // This is called after successful payment at Razorpay
                    setStep('processing');
                    try {
                        const verifyRes = await axios.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planDetails: plan,
                            userId: user?._id
                        });

                        if (verifyRes.data.success) {
                            setStep('success');
                            setTimeout(() => {
                                onPaymentSuccess();
                                onClose();
                            }, 3000);
                        }
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                        setStep('method');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: '9999999999' // Optional
                },
                notes: {
                    address: 'Gym Portal Office'
                },
                theme: {
                    color: '#8b5cf6' // Purple theme
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(response.error.description);
                setLoading(false);
            });
            rzp.open();
            setLoading(false);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const paymentMethods = [
        { id: 'upi', name: 'UPI Apps', icon: <FaMobileAlt className="text-purple" />, desc: 'GPay, PhonePe, Paytm' },
        { id: 'card', name: 'Debit/Credit Card', icon: <FaCreditCard className="text-purple" />, desc: 'Visa, Mastercard, RuPay' },
        { id: 'netbanking', name: 'Net Banking', icon: <FaUniversity className="text-purple" />, desc: 'All Indian Banks' },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-[420px] bg-[#0c0c0e] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#111114]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase font-sans">Razorpay Gateway</h3>
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition p-2 bg-white/5 rounded-xl">
                            <FaTimes size={16} />
                        </button>
                    </div>

                    <div className="p-7 min-h-[380px] flex flex-col">
                        {step === 'method' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                                <div className="bg-gradient-to-br from-purple/20 to-pink-500/5 p-5 rounded-3xl border border-white/5 mb-8 flex justify-between items-center group">
                                    <div className="relative z-10">
                                        <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mb-1 leading-none">Checkout Value</p>
                                        <h2 className="text-2xl font-black text-white italic tracking-tighter">{plan?.price}</h2>
                                    </div>
                                    <div className="text-right leading-tight relative z-10">
                                        <p className="text-white font-black text-sm uppercase italic">{plan?.name}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{plan?.duration}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl opacity-60 hover:opacity-100 transition cursor-default"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-dark-400 rounded-xl flex items-center justify-center text-xl">
                                                    {method.icon}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-black text-sm tracking-tight">{method.name}</p>
                                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">{method.desc}</p>
                                                </div>
                                            </div>
                                            <FaRegCheckCircle className="text-gray-700" />
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="text-red-500 text-[9px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl text-center mb-4 border border-red-500/20">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleRazorpayPayment}
                                    disabled={loading}
                                    className="w-full py-5 bg-purple hover:bg-purple-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-purple/30 text-xs uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <>
                                            Secure Pay {plan?.price}
                                            <FaChevronRight size={12} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[9px] text-gray-600 mt-4 font-bold uppercase tracking-widest">Powered by Razorpay Fintech</p>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center space-y-8">
                                <div className="relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-20 h-20 border-[6px] border-purple border-t-white rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                                    <FaLock className="absolute inset-0 m-auto text-purple/40" size={24} />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Verifying Payment</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 max-w-[200px] leading-relaxed">Securing your membership details...</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
                                <div className="w-24 h-24 bg-green-500 text-dark-100 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] border-[8px] border-green-400/20">
                                    <FaCheckCircle size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Success!</h4>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Plan Activated: {plan?.name}</p>
                                </div>
                                <div className="w-full bg-white/[0.03] p-5 rounded-3xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-600">
                                        <span>Invoice Ref.</span>
                                        <span className="text-gray-300 font-mono italic">#FIT-990{Math.floor(Math.random() * 100)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center leading-none">
                                        <p className="text-[11px] text-green-500 font-black uppercase tracking-[0.3em] italic">Full Paid</p>
                                        <p className="text-white font-black text-2xl italic tracking-tighter">{plan?.price}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer Branding */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between opacity-40 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0">
                        <div className="flex items-center gap-6">
                            <SiVisa size={28} className="text-white" />
                            <SiMastercard size={28} className="text-white" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/UPI-Logo.png/640px-UPI-Logo.png" alt="UPI" className="h-3.5 invert" />
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegCheckCircle className="text-green-500 text-xs" />
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none">PCI-DSS Secured</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
