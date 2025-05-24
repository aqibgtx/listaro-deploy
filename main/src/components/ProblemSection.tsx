import React, { useRef } from 'react';
import { useInView } from '../utils/useInView';

const ProblemSection: React.FC = () => {
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
            Every Dealer Knows This Problem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div 
              ref={contentLeftRef}
              className={`transition-all duration-700 delay-200 ${
                contentLeftInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[100px]'
              }`}
            >
              <p className="text-lg leading-relaxed mb-6">
                You post your phones on Facebook using your own profile. You do it again and again every week. 
                Sometimes posts get removed. Sometimes buyers ghost you. Sometimes Facebook hides your listings for no reason.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                And when you're busy with customers, nothing gets posted at all.
              </p>
              <p className="text-lg leading-relaxed font-medium">
                This is what we heard from other dealers. So we built a tool that solves it.
              </p>
            </div>
            
            <div 
              ref={contentRightRef}
              className={`transition-all duration-700 delay-400 ${
                contentRightInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
              }`}
            >
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg">Manual reposting every week</p>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg">Dealing with spam messages</p>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg">Facebook bans and restrictions</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg">No time to post when busy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;