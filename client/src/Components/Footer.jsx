import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaDumbbell, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-300 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-8 text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-purple rounded-2xl flex items-center justify-center text-white text-xl group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-purple/20">
                <FaDumbbell />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter uppercase">Fitness<span className="text-purple">Club</span></span>
            </Link>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Precision engineering for human evolution. State-of-the-art facilities and tactical coaching systems designed to shatter biological limits.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 bg-dark-200 border border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-purple hover:text-white hover:border-purple transition-all duration-500 shadow-xl">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
 
          {/* Quick Links */}
          <div className="text-left">
            <h4 className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="space-y-4">
              {['About', 'Services', 'Trainers', 'Plans', 'Gallery'].map((text) => (
                <li key={text}>
                  <Link to={`/#${text.toLowerCase()}`} className="text-gray-500 hover:text-purple transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group">
                    <div className="w-1 h-1 bg-purple/20 rounded-full group-hover:w-3 transition-all"></div>
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* User Support */}
          <div className="text-left">
            <h4 className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Protocols</h4>
            <ul className="space-y-4">
              {[
                { label: 'Member Access', path: '/login' },
                { label: 'Initialize Account', path: '/signup' },
                { label: 'Tactical Support', path: '/support' },
                { label: 'Privacy Cryptography', path: '/privacy-policy' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-gray-500 hover:text-purple transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group">
                    <div className="w-1 h-1 bg-purple/20 rounded-full group-hover:w-3 transition-all"></div>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Contact Info */}
          <div className="text-left">
            <h4 className="text-white font-black text-[10px] mb-8 uppercase tracking-[0.3em]">Base Operations</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 bg-dark-200 rounded-lg flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all shadow-lg"><FaMapMarkerAlt size={14} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Laksmi Nagar, Parvati, Pune 411009</p>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 bg-dark-200 rounded-lg flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all shadow-lg"><FaPhoneAlt size={14} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">+91 7822061312</p>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 bg-dark-200 rounded-lg flex items-center justify-center text-purple group-hover:bg-purple group-hover:text-white transition-all shadow-lg"><FaEnvelope size={14} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest truncate">lonkarkrushna13@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>
 
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} <span className="text-gray-400">FitnessClub</span> Systems.
          </p>
          <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
            Developed by <span className="text-purple italic">Lonkar Krushna</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
