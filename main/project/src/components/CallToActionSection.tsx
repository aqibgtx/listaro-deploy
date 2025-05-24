import React, { useRef } from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import { useInView } from '../utils/useInView';

const CallToActionSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardInView] = useInView(cardRef, { direction: 'up', distance: 100 });

  return (
    <section className="min-h-[80vh] bg-[#F5F7FA] py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <div 
          ref={cardRef}
          className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
            cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100px]'
          }`}
        >
          <div className="md:flex">
            <div className="md:w-1/2 p-12">
              <h2 className="text-4xl font-bold mb-6">We Only Work With a Few Dealers at a Time</h2>
              <p className="text-lg mb-8 leading-relaxed">
                We don't take hundreds of clients. We pick a few each month and help them set it up 
                the right way. If you want help getting your Facebook under control, book a short call. 
                We'll show you how it works. If you like it, we'll install everything for you.
              </p>
              
              <button className="bg-[#1F51FF] hover:bg-[#0033cc] text-white uppercase font-bold tracking-wider py-4 px-8 rounded-md text-base transition-all duration-300 flex items-center group shadow-lg">
                <Phone className="mr-2 w-5 h-5" />
                Book a Free Setup Call
                <ChevronRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="md:w-1/2 bg-gradient-to-br from-[#1F51FF] to-[#39FF14] p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">We Install It For You</h3>
                <p className="text-white text-lg opacity-90">No technical knowledge required</p>
                
                <div className="mt-8 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <ul className="text-left text-white">
                    <li className="mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Full setup assistance
                    </li>
                    <li className="mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      One-on-one training
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ongoing support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;