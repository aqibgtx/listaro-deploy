import React, { useRef } from 'react';
import { useInView } from '../utils/useInView';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentLeftRef = useRef<HTMLDivElement>(null);
  const contentRightRef = useRef<HTMLDivElement>(null);

  const [titleInView] = useInView(titleRef, { direction: 'down', distance: 50 });
  const [contentLeftInView] = useInView(contentLeftRef, { direction: 'left', distance: 100, delay: 200 });
  const [contentRightInView] = useInView(contentRightRef, { direction: 'right', distance: 100, delay: 400 });

  return (
    <section ref={sectionRef} className="min-h-[80vh] bg-[#F5F7FA] py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 
            ref={titleRef}
            className={`text-4xl md:text-5xl font-bold mb-10 text-center transition-all duration-700 ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
            }`}
          >
            We Don't Build Fancy Apps. We Solve Daily Headaches.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div 
              ref={contentLeftRef}
              className={`transition-all duration-700 delay-200 ${
                contentLeftInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[100px]'
              }`}
            >
              <p className="text-lg leading-relaxed mb-6">
                Listaro App is not just a software company. We're a team that builds systems to reduce 
                manual work for real businesses. Right now, we're focused on solving the exact problem 
                phone dealers face with Facebook listings.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We work directly with local dealers and adjust the tool based on real feedback. This isn't 
                theory. This is built from the ground.
              </p>
            </div>
            
            <div 
              ref={contentRightRef}
              className={`transition-all duration-700 delay-400 ${
                contentRightInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
              }`}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#1F51FF]/10 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#39FF14]/10 rounded-full"></div>
                
                <div className="relative bg-white p-8 rounded-xl shadow-lg z-10">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#1F51FF]/10 flex items-center justify-center text-[#1F51FF] mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Built From Experience</h3>
                      <p className="text-base">Designed based on real phone seller pain points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-green-600 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Practical Solutions</h3>
                      <p className="text-base">Focused on saving time and increasing sales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;