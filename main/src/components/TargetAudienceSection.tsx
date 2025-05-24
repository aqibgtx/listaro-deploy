import React, { useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { useInView } from '../utils/useInView';

const TargetAudienceSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [titleInView] = useInView(titleRef, { direction: 'down', distance: 50 });
  const [itemsInView] = useInView(itemsRef, { direction: 'left', distance: 100, delay: 200 });
  const [infoInView] = useInView(infoRef, { direction: 'up', distance: 50, delay: 400 });

  const audienceItems = [
    "Dealers without digital staff",
    "Salespeople doing everything manually",
    "Shops using personal Facebook to post",
    "Owners who want more time to deal with real customers"
  ];

  return (
    <section className="min-h-[80vh] bg-white py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 
            ref={titleRef}
            className={`text-4xl md:text-5xl font-bold mb-12 text-center transition-all duration-700 ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
            }`}
          >
            If You're the One Posting Phones Yourself, This Is Built for You
          </h2>
          
          <div className="bg-[#F5F7FA] p-10 rounded-2xl shadow-lg">
            <div 
              ref={itemsRef}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-8 transition-all duration-700 delay-200 ${
                itemsInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[100px]'
              }`}
            >
              {audienceItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center"
                >
                  <CheckCircle className="w-8 h-8 text-[#39FF14] mr-4 flex-shrink-0" />
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
            
            <div 
              ref={infoRef}
              className={`mt-12 pt-8 border-t border-gray-200 transition-all duration-700 delay-400 ${
                infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
              }`}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-[#1F51FF]/10 flex items-center justify-center text-[#1F51FF] mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold mb-2">Why It Matters</h3>
                  <p className="text-lg leading-relaxed">
                    When you're handling listings manually, you're spending hours each week on tasks 
                    that don't directly sell phones. Listaro automates the posting process, helping you 
                    focus on what really matters: talking to customers and closing deals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;