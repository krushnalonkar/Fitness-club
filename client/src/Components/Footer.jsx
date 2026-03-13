import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaDumbbell, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-100 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-purple rounded-xl flex items-center justify-center text-white text-xl group-hover:rotate-12 transition-transform duration-300">
                <FaDumbbell />
              </div>
              <span className="text-2xl font-bold text-white tracking-wider">Fitness<span className="text-purple">Club</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering your fitness journey with state-of-the-art facilities and world-class expert coaching. Join our community and transform your life today.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 bg-dark-300 rounded-full flex items-center justify-center text-gray-400 hover:bg-purple hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              {['About', 'Services', 'Trainers', 'Plans', 'Gallery'].map((text) => (
                <li key={text}>
                  <Link to={`/#${text.toLowerCase()}`} className="text-gray-400 hover:text-purple transition-colors duration-300 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple/40 rounded-full"></div>
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">User Support</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-gray-400 hover:text-purple text-sm transition-colors">Login to Account</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-purple text-sm transition-colors">Create Member Profile</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-purple text-sm transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-purple text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-purple text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="text-purple mt-1"><FaMapMarkerAlt /></div>
                <p className="text-gray-400 text-sm">Laksmi Nagar, Parvati, Pune 411009</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-purple"><FaPhoneAlt /></div>
                <p className="text-gray-400 text-sm">+91 7822061312</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-purple"><FaEnvelope /></div>
                <p className="text-gray-400 text-sm truncate">lonkarkrushna13@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-gray-300 font-medium">FitnessClub</span>. Created by <span className="text-purple font-semibold italic">Lonkar Krushna</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
