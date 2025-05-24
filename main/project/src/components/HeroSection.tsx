import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useInView } from '../utils/useInView';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [headlineInView] = useInView(headlineRef, { direction: 'left', distance: 100 });
  const [subheadlineInView] = useInView(subheadlineRef, { direction: 'right', distance: 100, delay: 200 });
  const [ctaInView] = useInView(ctaRef, { direction: 'up', distance: 50, delay: 400 });
  const [imageInView] = useInView(imageRef, { direction: 'down', distance: 100, delay: 300 });

  return (
    <section className="min-h-[80vh] bg-white py-16 px-4 md:px-8 flex items-center">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <h1 
            ref={headlineRef}
            className={`text-5xl md:text-6xl font-bold tracking-tight uppercase leading-none mb-6 transition-all duration-700 ${
              headlineInView 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-[100px]'
            }`}
          >
            You Sell Phones.
            <br /> We Handle the Postings.
          </h1>
          <p 
            ref={subheadlineRef}
            className={`text-xl md:text-2xl leading-relaxed mb-10 opacity-90 transition-all duration-700 delay-200 ${
              subheadlineInView 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-[100px]'
            }`}
          >
            Listaro was built for one reason: to help dealers stop wasting hours reposting phones, 
            replying to spam, and worrying about Facebook bans. You focus on closing deals. 
            We'll take care of the listings.
          </p>
          <button 
            ref={ctaRef}
            className={`bg-[#1F51FF] hover:bg-[#0033cc] text-white uppercase font-bold tracking-wider py-4 px-8 rounded-md text-base transition-all duration-700 flex items-center group delay-400 ${
              ctaInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-[50px]'
            }`}
          >
            See How It Works
            <ChevronRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div 
          ref={imageRef}
          className={`relative flex justify-center items-center transition-all duration-700 delay-300 ${
            imageInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-[100px]'
          }`}
        >
          <div className="w-full h-[400px] relative overflow-hidden rounded-lg shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1F51FF]/10 to-[#39FF14]/10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-[#1F51FF] rounded-full flex items-center justify-center relative">
                <div className="w-24 h-24 border-4 border-[#39FF14] rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">AUTO</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 h-20 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4">
              <div className="h-3 w-3/4 bg-[#1F51FF]/20 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-[#39FF14]/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;