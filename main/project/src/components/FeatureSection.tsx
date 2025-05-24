import React, { useRef } from 'react';
import { ChevronRight, FileText, Calendar, BarChart3, RefreshCw, MessageSquare } from 'lucide-react';
import { useInView } from '../utils/useInView';

const FeatureItem: React.FC<{ 
  icon: React.ReactNode; 
  text: string; 
  delay: number;
  direction: 'left' | 'right';
}> = ({ 
  icon, 
  text, 
  delay,
  direction
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isInView] = useInView(itemRef, { 
    direction, 
    distance: 50, 
    delay 
  });

  return (
    <div 
      ref={itemRef}
      className={`flex items-center mb-6 transition-all duration-700`}
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView 
          ? 'translateX(0)' 
          : `translateX(${direction === 'left' ? '-50px' : '50px'})`
      }}
    >
      <div className="w-12 h-12 rounded-full bg-[#1F51FF]/10 flex items-center justify-center text-[#1F51FF] mr-4">
        {icon}
      </div>
      <p className="text-lg">{text}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [titleInView] = useInView(titleRef, { direction: 'down', distance: 50 });
  const [descInView] = useInView(descRef, { direction: 'up', distance: 50, delay: 200 });
  const [buttonInView] = useInView(buttonRef, { direction: 'up', distance: 30, delay: 600 });

  return (
    <section ref={sectionRef} className="min-h-[80vh] bg-white py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 
            ref={titleRef}
            className={`text-4xl md:text-5xl font-bold mb-6 text-center transition-all duration-700 ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
            }`}
          >
            A Posting Assistant That Works Every Day Without You Touching It
          </h2>
          
          <p 
            ref={descRef}
            className={`text-xl text-center max-w-3xl mx-auto mb-16 transition-all duration-700 delay-200 ${
              descInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            }`}
          >
            Listaro handles all your Facebook Marketplace listings. It uploads your phone details, 
            spaces out the posts, reposts automatically, and filters out the junk messages so you 
            can focus on the real buyers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
            <div>
              <FeatureItem 
                icon={<FileText size={24} />} 
                text="Add your stock in, by spreadsheet or manual input" 
                delay={100}
                direction="left"
              />
              <FeatureItem 
                icon={<Calendar size={24} />} 
                text="Listaro writes and schedules the posts for you" 
                delay={200}
                direction="left"
              />
              <FeatureItem 
                icon={<BarChart3 size={24} />} 
                text="Posts go up one by one without spam triggers" 
                delay={300}
                direction="left"
              />
            </div>
            
            <div>
              <FeatureItem 
                icon={<RefreshCw size={24} />} 
                text="Old phones get removed, new ones get posted" 
                delay={400}
                direction="right"
              />
              <FeatureItem 
                icon={<MessageSquare size={24} />} 
                text="Messages from buyers come to one inbox" 
                delay={500}
                direction="right"
              />
            </div>
          </div>
          
          <div 
            ref={buttonRef}
            className={`flex justify-center transition-all duration-700 delay-600 ${
              buttonInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            }`}
          >
            <button className="bg-[#39FF14] hover:bg-[#20e000] text-black uppercase font-bold tracking-wider py-4 px-8 rounded-md text-base transition-all duration-300 flex items-center group shadow-lg">
              Try a Demo Walkthrough
              <ChevronRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;