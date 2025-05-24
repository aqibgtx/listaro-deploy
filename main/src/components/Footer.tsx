import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Listaro App</h2>
              <p className="text-lg text-gray-600">Tools That Work the Way You Do</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-[#1F51FF] mr-2" />
                <span className="text-gray-700">Malaysia-Based</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#1F51FF] mr-2" />
                <span className="text-gray-700">WhatsApp Direct</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#1F51FF] mr-2" />
                <a href="mailto:hello@listaro.app" className="text-gray-700 hover:text-[#1F51FF] transition-colors duration-300">
                  support@listaro.app
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Listaro App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;