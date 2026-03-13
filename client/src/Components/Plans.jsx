import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import PaymentModal from "./PaymentModal";

function Plans() {
    const { user, bookPlan } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState({ type: '', message: '' });
    const [isBooking, setIsBooking] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get('/api/plans');
                setPlans(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch Plans Error:", error);
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const activePlan = user?.bookedPlans?.find(p => {
        if (!p.endDate) return false;
        return new Date(p.endDate) > new Date();
    });

    const handleBookPlan = (plan) => {
        setSelectedPlanForPayment(plan);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async () => {
        setIsPaymentModalOpen(false);
        setIsBooking(true);
        setBookingStatus({ type: '', message: '' });
        try {
            await bookPlan({
                planName: selectedPlanForPayment.name,
                price: selectedPlanForPayment.price,
                duration: selectedPlanForPayment.duration
            });
            setBookingStatus({ type: 'success', message: `Successfully booked ${selectedPlanForPayment.name}!` });
        } catch (error) {
            setBookingStatus({ type: 'error', message: error });
            alert(error);
        } finally {
            setIsBooking(false);
            setSelectedPlanForPayment(null);
        }
    };

    return (
        <section
            id="plans"
            className="bg-dark-300 text-white py-20 px-4 sm:px-10 md:px-20"
        >
            <Motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <p className="text-purple font-black uppercase tracking-[0.3em] text-[10px] mb-4">Investment Strategy</p>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
                   Membership <span className="text-purple">Blueprints</span>
                </h2>
 
                <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">
                   High-performance access protocols for serious athletes only.
                </p>
 
                {bookingStatus.message && (
                    <div className={`mt-8 px-6 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest border max-w-md mx-auto ${bookingStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                        {bookingStatus.message}
                    </div>
                )}
            </Motion.div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500 uppercase tracking-widest font-bold text-xs">Syncing Plan Data...</div>
                ) : plans.length > 0 ? (
                    plans.map((plan, index) => (
                        <Motion.div
                            key={plan._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-[2.5rem] p-10 border transition-all duration-700 cursor-pointer flex flex-col h-full group
                ${plan.popular
                                    ? "bg-dark-200 border-purple/30 shadow-2xl shadow-purple/10 scale-105 z-10"
                                    : "bg-dark-200 border-white/5 hover:border-purple/20"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple text-white text-[9px] px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] shadow-xl shadow-purple/20">
                                    Primary Choice
                                </div>
                            )}
 
                            <h3 className="text-[10px] font-black mb-6 text-center uppercase tracking-[0.3em] text-gray-500 group-hover:text-purple transition-colors">
                                {plan.name}
                            </h3>
 
                            <div className="text-center mb-10">
                                <span className="text-5xl font-black text-white group-hover:scale-110 inline-block transition-transform duration-500">
                                    {plan.price}
                                </span>
                                <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-2">{plan.duration} ACCESS</div>
                            </div>
 
                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
                                    >
                                        <div className="w-1 h-1 bg-purple rounded-full"></div> {feature}
                                    </li>
                                ))}
                            </ul>
 
                            {user ? (
                                <button
                                    onClick={() => handleBookPlan(plan)}
                                    disabled={isBooking || !!activePlan}
                                    className={`w-full text-center py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${activePlan?.planName === plan.name
                                        ? 'bg-dark-300 text-gray-600 border border-white/5 cursor-not-allowed'
                                        : (!!activePlan || isBooking)
                                            ? 'bg-purple/20 text-purple/40 cursor-not-allowed'
                                            : 'bg-purple hover:bg-purple-700 text-white cursor-pointer shadow-xl shadow-purple/10'
                                        }`}
                                >
                                    {activePlan?.planName === plan.name
                                        ? 'Active Authorization'
                                        : isBooking ? 'Processing...' : 'Authorize Plan'}
                                </button>
                            ) : (
                                <Link to="/login" className="w-full text-center py-4 rounded-2xl bg-purple hover:bg-purple-700 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl shadow-purple/10 cursor-pointer">
                                    Initialize Access
                                </Link>
                            )}
                        </Motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500 uppercase tracking-widest font-black text-xs">
                        Deployment Pending. Check Back Soon.
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                plan={selectedPlanForPayment}
                onPaymentSuccess={handlePaymentComplete}
            />
        </section>
    );
}

export default Plans;