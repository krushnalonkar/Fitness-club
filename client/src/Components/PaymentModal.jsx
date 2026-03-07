import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaCheckCircle, FaTimes, FaLock, FaSpinner, FaChevronRight, FaRegCheckCircle, FaQrcode, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm, SiVisa, SiMastercard } from 'react-icons/si';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, plan, onPaymentSuccess }) => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState('method'); // method, card-details, upi-selection, upi-id, upi-qr, netbanking, processing, success
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Form States
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setStep('method');
            setSelectedMethod(null);
            setLoading(false);
            setErrorMessage('');
            setCardData({ number: '', name: '', expiry: '', cvv: '' });
            setUpiId('');
            setSelectedBank(null);
        }
    }, [isOpen]);

    const handleBack = () => {
        if (step === 'card-details' || step === 'upi-selection' || step === 'netbanking') {
            setStep('method');
        } else if (step === 'upi-id' || step === 'upi-qr') {
            setStep('upi-selection');
        } else if (step === 'netbanking-login') {
            setStep('netbanking');
        }
    };

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        if (methodId === 'card') {
            setStep('card-details');
        } else if (methodId === 'upi') {
            setStep('upi-selection');
        } else if (methodId === 'netbanking') {
            setStep('netbanking');
        }
    };

    const handleFinalSimulation = async () => {
        setStep('processing');
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 3500);
        } catch (err) {
            setErrorMessage('Payment failed. Please try again.');
            setStep('method');
        } finally {
            setLoading(false);
        }
    };

    const handleCardInput = (e) => {
        const { name, value } = e.target;

        // Strictly allow only numbers for sensitive fields
        let numericValue = value;
        if (name === 'number' || name === 'cvv' || name === 'expiry') {
            numericValue = value.replace(/\D/g, ''); // Remove all non-digit characters
        }

        let formattedValue = numericValue;
        if (name === 'number') {
            formattedValue = numericValue.replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
        } else if (name === 'expiry') {
            formattedValue = numericValue.replace(/(\d{2})/g, '$1/').trim().substring(0, 5);
            if (formattedValue.endsWith('/')) formattedValue = formattedValue.slice(0, -1);
        } else if (name === 'cvv') {
            formattedValue = numericValue.substring(0, 3);
        }
        setCardData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const [bankLogin, setBankLogin] = useState({ username: '', password: '' });

    if (!isOpen) return null;

    const paymentMethods = [
        { id: 'upi', name: 'UPI (QR or ID)', icon: <FaQrcode />, desc: 'GPay, PhonePe, Paytm' },
        { id: 'card', name: 'Card Payment', icon: <FaCreditCard />, desc: 'Visa, Mastercard' },
        { id: 'netbanking', name: 'Net Banking', icon: <FaUniversity />, desc: 'Choose from Popular Banks' },
    ];

    const popularBanks = [
        { id: 'sbi', name: 'SBI', logo: '/banks/sbi.svg' },
        { id: 'hdfc', name: 'HDFC', logo: '/banks/hdfc.svg' },
        { id: 'icici', name: 'ICICI', logo: '/banks/icici.svg' },
        { id: 'axis', name: 'Axis', logo: '/banks/axis.svg' },
        { id: 'kotak', name: 'Kotak', logo: '/banks/kotak.svg' },
        { id: 'yes', name: 'Yes Bank', logo: '/banks/yes.svg' },
    ];

    const validateUpi = (id) => {
        return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(id);
    };

    const isCardValid = () => {
        const { number, expiry, cvv, name } = cardData;
        return number.replace(/\s/g, '').length === 16 &&
            /^\d{2}\/\d{2}$/.test(expiry) &&
            cvv.length === 3 &&
            name.trim().length > 2;
    };

    const handleBankSelection = (bank) => {
        setSelectedBank(bank);
        setStep('netbanking-login');
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel this payment?")) {
            onClose();
        }
    };

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] cursor-pointer" />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-[460px] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-200" >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex flex-col items-center gap-4 bg-slate-50/50">
                        <div className="w-full flex justify-between items-center">
                            {step !== 'method' && step !== 'processing' && step !== 'success' && (
                                <button onClick={handleBack} className="text-slate-500 hover:text-blue-600 transition cursor-pointer"><FaArrowLeft size={18} /></button>
                            )}
                            <div className="flex-1 flex justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" /></div>
                            <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition cursor-pointer"><FaTimes size={18} /></button>
                        </div>
                        {step !== 'success' && step !== 'processing' && (
                            <div className="w-full flex justify-between items-center px-2">
                                <div className="text-left"><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pay to</p><h3 className="text-sm font-bold text-slate-800">Antigravity Fitness</h3></div>
                                <div className="text-right"><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total</p><h3 className="text-xl font-bold text-slate-900">{plan?.price}</h3></div>
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        {step === 'method' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h4 className="text-center text-slate-800 font-medium text-lg">Choose a payment method</h4>
                                <div className="space-y-3">
                                    {paymentMethods.map(m => (
                                        <button key={m.id} onClick={() => handleMethodSelect(m.id)} className="w-full flex items-center gap-4 p-5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl transition-all group text-left shadow-sm cursor-pointer">
                                            <div className="text-2xl text-slate-400 group-hover:text-blue-600">{m.icon}</div>
                                            <div className="flex-1 text-sm"><p className="text-slate-900 font-bold">{m.name}</p><p className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5">{m.desc}</p></div>
                                            <FaChevronRight className="text-slate-300 group-hover:text-blue-500" size={12} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'upi-selection' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h4 className="text-center text-slate-800 font-medium text-lg">Select UPI Method</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setStep('upi-qr')} className="flex flex-col items-center gap-3 p-6 border border-slate-200 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer">
                                        <FaQrcode size={32} className="text-blue-500" />
                                        <span className="text-sm font-bold text-slate-700">Scan QR</span>
                                    </button>
                                    <button onClick={() => setStep('upi-id')} className="flex flex-col items-center gap-3 p-6 border border-slate-200 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer">
                                        <FaMobileAlt size={32} className="text-blue-500" />
                                        <span className="text-sm font-bold text-slate-700">UPI ID / Number</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'upi-id' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700">Enter UPI ID or Mobile Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 9876543210@ybl"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className={`w-full h-14 border rounded-lg px-4 text-slate-800 font-medium outline-none transition-all ${upiId && !validateUpi(upiId) ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
                                    />
                                    <p className={`text-[10px] ${upiId && !validateUpi(upiId) ? 'text-red-500' : 'text-slate-400'}`}>
                                        {upiId && !validateUpi(upiId) ? 'Please enter a valid UPI ID (e.g. name@bank)' : 'A payment request will be sent to your UPI app.'}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        disabled={!validateUpi(upiId)}
                                        onClick={handleFinalSimulation}
                                        className="w-full h-14 bg-[#0070ba] hover:bg-[#003087] text-white font-bold rounded-full disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        Verify & Pay
                                    </button>
                                    <button onClick={handleCancel} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center">Cancel Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'upi-qr' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-8">
                                <div className="p-3 border-2 border-slate-100 rounded-2xl bg-white shadow-lg">
                                    <img src="/qr-code.png" className="w-48 h-48" onError={(e) => { e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=simulate@bank&am=" + plan?.price.replace(/[^0-9]/g, ''); }} />
                                </div>
                                <div className="w-full space-y-3">
                                    <button onClick={handleFinalSimulation} className="w-full h-14 bg-[#ffc439] text-[#1e293b] font-bold rounded-full shadow-md hover:bg-[#f2ba36] transition-all cursor-pointer">Verify Payment After Scan</button>
                                    <button onClick={handleCancel} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all text-center cursor-pointer">Cancel Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'netbanking' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h4 className="text-center text-slate-800 font-medium text-md">Select your Bank</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {popularBanks.map(b => (
                                        <button key={b.id} onClick={() => handleBankSelection(b)} className="flex flex-col items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all group min-h-[80px] cursor-pointer">
                                            <div className="h-8 flex items-center justify-center w-full">
                                                <img
                                                    src={b.logo}
                                                    alt={b.name}
                                                    className="max-h-full max-w-[80%] object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = "🏦"; }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{b.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <select onChange={(e) => { if (e.target.value) { handleBankSelection({ name: e.target.value }); } }} className="w-full h-12 border border-slate-200 rounded-lg px-4 text-xs font-medium text-slate-500 cursor-pointer">
                                        <option value="">Choose another bank...</option>
                                        <option value="pnb">Punjab National Bank</option>
                                        <option value="boi">Bank of India</option>
                                        <option value="canara">Canara Bank</option>
                                    </select>
                                    <button onClick={handleCancel} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all text-center cursor-pointer">Cancel Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'netbanking-login' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm overflow-hidden text-blue-600">
                                        {selectedBank?.logo ? <img src={selectedBank.logo} className="w-8 h-8 object-contain" /> : <FaUniversity size={24} />}
                                    </div>
                                    <div className="text-sm font-bold text-slate-700">{selectedBank?.name} Net Banking</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Number / User ID</label>
                                        <input
                                            type="text"
                                            value={bankLogin.username}
                                            onChange={(e) => setBankLogin(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full h-12 border border-slate-300 rounded-lg px-4 text-slate-800 outline-none focus:border-blue-500 transition-all font-medium"
                                            placeholder="Enter your banking ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PIN / Transaction Password</label>
                                        <input
                                            type="password"
                                            value={bankLogin.password}
                                            onChange={(e) => setBankLogin(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full h-12 border border-slate-300 rounded-lg px-4 text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:tracking-widest"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        disabled={!bankLogin.username || !bankLogin.password}
                                        onClick={handleFinalSimulation}
                                        className="w-full h-14 bg-[#0070ba] text-white font-bold rounded-full hover:bg-[#003087] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        Proceed to Pay {plan?.price}
                                    </button>
                                    <button onClick={handleCancel} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all text-center cursor-pointer">Cancel Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'card-details' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input type="text" name="number" placeholder="Card Number" value={cardData.number} onChange={handleCardInput} className="w-full h-14 border border-slate-300 rounded-lg px-4 text-slate-800 font-medium outline-none focus:border-blue-500" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            <SiVisa className={cardData.number.startsWith('4') ? 'text-blue-600' : 'text-slate-200'} size={24} />
                                            <SiMastercard className={cardData.number.startsWith('5') ? 'text-orange-500' : 'text-slate-200'} size={24} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="expiry" placeholder="MM/YY" value={cardData.expiry} onChange={handleCardInput} className="w-full h-14 border border-slate-300 rounded-lg px-4 text-slate-800 focus:border-blue-500" />
                                        <input type="password" name="cvv" placeholder="CVV" value={cardData.cvv} onChange={handleCardInput} className="w-full h-14 border border-slate-300 rounded-lg px-4 text-slate-800 focus:border-blue-500" />
                                    </div>
                                    <input type="text" name="name" placeholder="Full Name" value={cardData.name} onChange={handleCardInput} className="w-full h-14 border border-slate-300 rounded-lg px-4 text-slate-800 uppercase focus:border-blue-500" />
                                </div>
                                <div className="space-y-3">
                                    <button
                                        disabled={!isCardValid()}
                                        onClick={handleFinalSimulation}
                                        className="w-full h-14 bg-[#0070ba] text-white font-bold rounded-full hover:bg-[#003087] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        Pay {plan?.price} Now
                                    </button>
                                    <button onClick={handleCancel} className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all text-center cursor-pointer">Cancel Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                <div className="text-center"><h4 className="text-slate-800 font-bold text-lg mb-1">Verifying...</h4><p className="text-slate-500 text-sm">Securing your transaction</p></div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center space-y-6 text-center min-h-[350px]">
                                <FaCheckCircle size={56} className="text-emerald-500" />
                                <div className="space-y-1"><h4 className="text-2xl font-bold text-slate-900">Success!</h4><p className="text-slate-500 text-sm">Membership activated for {plan?.name}</p></div>
                                <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between text-xs text-slate-400 mb-4"><span>Order ID</span><span className="text-slate-700 font-mono italic">PP-#{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
                                    <div className="flex justify-between items-center"><p className="text-2xl font-bold text-blue-900">{plan?.price}</p><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" /></div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2"><FaLock className="text-slate-300" size={14} /><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secured by PayPal Technology</span></div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
