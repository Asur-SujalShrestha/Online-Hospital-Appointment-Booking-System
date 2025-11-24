import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { hospitalInfo } from '../../data/dummyData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">{hospitalInfo.name}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {hospitalInfo.mission}
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{hospitalInfo.founded}</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">Established</p>
                <p className="text-gray-300">Since {hospitalInfo.founded}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/doctors" className="text-gray-300 hover:text-white transition-colors">Find Doctors</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Patient Login</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Emergency Care</li>
              <li className="text-gray-300">Cardiology</li>
              <li className="text-gray-300">Pediatrics</li>
              <li className="text-gray-300">Orthopedics</li>
              <li className="text-gray-300">Neurology</li>
              <li className="text-gray-300">Dermatology</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{hospitalInfo.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{hospitalInfo.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{hospitalInfo.email}</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Emergency: 24/7</p>
                  <p>OPD: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {hospitalInfo.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;