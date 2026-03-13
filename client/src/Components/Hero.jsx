import React, { useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import banner1 from "../assets/banner-1.jpg";
import banner2 from "../assets/banner-2.jpg";
import banner3 from "../assets/banner-3.jpg";

const slides = [
    {
        img: banner1,
        title: "Transform Your Body",
        desc: "Join our gym today and get access to world-class equipment and trainers.",
    },
    {
        img: banner2,
        title: "Build Strength",
        desc: "Personalized workout plans to help you achieve your goals faster.",
    },
    {
        img: banner3,
        title: "Stay Fit & Healthy",
        desc: "Train with the best coaches and improve your lifestyle.",
    },
];

function Hero() {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const { user } = useContext(AuthContext);

    return (
        <div id="hero" className="relative">
            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={1500}
                loop={true}
                navigation={true}
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== "boolean") {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }
                }}
                className="h-screen"  // 🔥 Height increased from 80vh to 90vh
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full h-full relative">
                            <img
                                src={slide.img}
                                alt="gym banner"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80 flex flex-col justify-center items-center text-center px-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-4xl"
                                >
                                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                                        {user ? `Welcome, ${user.name.split(' ')[0]}!` : slide.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="text-purple">{word} </span> : word + ' ')}
                                    </h1>
                                    <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                                        {user ? "Ready to crush your goals today? Let's make every workout count and keep pushing forward." : slide.desc}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
                                        {user ? (
                                            <>
                                                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="w-full sm:w-auto px-10 py-4 bg-purple hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-2xl shadow-purple/40 text-xs">
                                                    Go to Dashboard
                                                </Link>
                                                <a href="#plans" className="w-full sm:w-auto px-10 py-4 border border-white/20 hover:border-white/40 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 backdrop-blur-md text-xs">
                                                    Explore Plans
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-purple hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-2xl shadow-purple/40 text-xs">
                                                    Launch Transformation
                                                </Link>
                                                <Link to="/login" className="w-full sm:w-auto px-10 py-4 border border-white/20 hover:border-white/40 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 backdrop-blur-md text-xs">
                                                    Client Portal
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Plain Arrows - hidden on mobile */}
            <div
                ref={prevRef}
                className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer text-white text-3xl"
            >
                <FaChevronLeft />
            </div>
            <div
                ref={nextRef}
                className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer text-white text-3xl"
            >
                <FaChevronRight />
            </div>
        </div>
    );
}

export default Hero;