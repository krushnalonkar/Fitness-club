import React, { useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
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
                className="h-[80vh]"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full h-full relative">
                            <img
                                src={slide.img}
                                alt="gym banner"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-2xl px-4"
                                >
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                        {user ? `Welcome, ${user.name.split(' ')[0]}!` : slide.title}
                                    </h1>
                                    <p className="text-gray-300 text-sm md:text-lg mb-8">
                                        {user ? "Ready to crush your goals today? Let's make every workout count." : slide.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {user ? (
                                            <>
                                                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition text-sm">
                                                    Go to Dashboard
                                                </Link>
                                                <a href="#plans" className="px-6 py-3 border border-white hover:bg-white hover:text-black text-white font-bold rounded-lg transition text-sm">
                                                    Explore Plans
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/signup" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition text-sm">
                                                    Get Started
                                                </Link>
                                                <Link to="/login" className="px-6 py-3 border border-white hover:bg-white hover:text-black text-white font-bold rounded-lg transition text-sm">
                                                    Login
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