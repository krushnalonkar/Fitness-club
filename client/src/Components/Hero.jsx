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

                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
                                    {user ? `Welcome Back, ${user.name.split(' ')[0]}!` : slide.title}
                                </h1>
                                <p className="text-white text-sm md:text-base max-w-xl mb-8">
                                    {user ? "Ready to crush your goals today? Let's make every workout count and keep pushing forward." : slide.desc}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
                                    {user ? (
                                        <>
                                            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="w-full sm:w-auto px-8 py-3 bg-purple rounded-xl text-white font-semibold hover:bg-purple-700 transition duration-300 text-center">
                                                Go to Dashboard
                                            </Link>
                                            <a href="#plans" className="w-full sm:w-auto px-8 py-3 border border-purple text-white rounded-xl font-semibold hover:bg-purple/20 transition duration-300 text-center">
                                                Explore Plans
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/signup" className="w-full sm:w-auto px-8 py-3 bg-purple rounded-xl text-white font-semibold hover:bg-purple-700 transition duration-300 text-center shadow-lg shadow-purple/20">
                                                Join Now
                                            </Link>
                                            <Link to="/login" className="w-full sm:w-auto px-8 py-3 border border-purple/40 text-white rounded-xl font-semibold hover:bg-purple/10 transition duration-300 text-center backdrop-blur-sm">
                                                Free Trial
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Plain Arrows */}
            <div
                ref={prevRef}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer text-white text-3xl"
            >
                <FaChevronLeft />
            </div>
            <div
                ref={nextRef}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer text-white text-3xl"
            >
                <FaChevronRight />
            </div>
        </div>
    );
}

export default Hero;