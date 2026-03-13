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
                className="text-center mb-14"
            >
                <h2 className="text-3xl md:text-4xl font-bold">
                    Our <span className="text-purple-500">Membership Plans</span>
                </h2>

                <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base px-4">
                    Choose the perfect plan that fits your fitness goals and start your
                    transformation journey with our expert trainers and modern equipment.
                </p>

                {bookingStatus.message && (
                    <div className={`mt-6 px-4 py-3 rounded-lg text-sm border max-w-md mx-auto ${bookingStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                        {bookingStatus.message}
                    </div>
                )}
            </Motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-400">Loading plans...</div>
                ) : plans.length > 0 ? (
                    plans.map((plan, index) => (
                        <Motion.div
                            key={plan._id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col h-full
                ${plan.popular
                                    ? "bg-dark-300 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-105 z-10"
                                    : "bg-dark-300 border-dark-400 hover:border-purple-500 hover:-translate-y-2"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-semibold mb-3 text-center">
                                {plan.name}
                            </h3>

                            <div className="text-center mb-6">
                                <span className="text-3xl font-bold text-purple-500">
                                    {plan.price}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {plan.duration}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="text-gray-300 text-sm flex items-center gap-2"
                                    >
                                        <span className="text-purple-500">✔</span> {feature}
                                    </li>
                                ))}
                            </ul>

                            {user ? (
                                <button
                                    onClick={() => handleBookPlan(plan)}
                                    disabled={isBooking || !!activePlan}
                                    className={`w-full text-center py-2.5 rounded-xl font-semibold transition duration-300 ${activePlan?.planName === plan.name
                                        ? 'bg-dark-400 text-gray-400 cursor-not-allowed'
                                        : (!!activePlan || isBooking)
                                            ? 'bg-purple-600 text-white cursor-not-allowed opacity-50'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-lg shadow-purple/20'
                                        }`}
                                >
                                    {activePlan?.planName === plan.name
                                        ? 'Active Plan Exists'
                                        : isBooking ? 'Processing...' : 'Buy Plan'}
                                </button>
                            ) : (
                                <Link to="/login" className="w-full text-center py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-300 cursor-pointer shadow-lg shadow-purple/20">
                                    Buy Plan
                                </Link>
                            )}
                        </Motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        Stay tuned! Gym plans are coming soon.
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