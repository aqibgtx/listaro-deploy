import React, { useRef } from 'react';
import { ShieldCheck, RefreshCw, Facebook, Tag, MessageSquare, Edit3 } from 'lucide-react';
import { useInView } from '../utils/useInView';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
  delay: number;
  direction: 'left' | 'right';
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, delay, direction }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isInView] = useInView(itemRef, { 
    direction, 
    distance: 50, 
    delay 
  });

  return (
    <div 
      ref={itemRef}
      className="flex items-center mb-6"
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView 
          ? 'translateX(0)' 
          : `translateX(${direction === 'left' ? '-50px' : '50px'})`,
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}
    >
      <div className="w-12 h-12 rounded-full bg-[#1F51FF]/10 flex items-center justify-center text-[#1F51FF] mr-4">
        {icon}
      </div>
      <p className="text-lg">{text}</p>
    </div>
  );
};

const DifferenceSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleInView] = useInView(titleRef, { direction: 'down', distance: 50 });

  return (
    <section className="min-h-[80vh] bg-[#F5F7FA] py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 
            ref={titleRef}
            className={`text-4xl md:text-5xl font-bold mb-12 text-center transition-all duration-700 ${
              titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
            }`}
          >
            Built Around What You Actually Need
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <FeatureItem 
                icon={<RefreshCw size={24} />} 
                text="No more posting one-by-one" 
                delay={100}
                direction="left"
              />
              <FeatureItem 
                icon={<ShieldCheck size={24} />} 
                text="Stops you from getting banned or flagged" 
                delay={200}
                direction="left"
              />
              <FeatureItem 
                icon={<Facebook size={24} />} 
                text="Works with personal Facebook profiles" 
                delay={300}
                direction="left"
              />
            </div>
            
            <div>
              <FeatureItem 
                icon={<Tag size={24} />} 
                text="Post phones automatically" 
                delay={400}
                direction="right"
              />
              <FeatureItem 
                icon={<MessageSquare size={24} />} 
                text="Messages come in clean and easy to track" 
                delay={500}
                direction="right"
              />
              <FeatureItem 
                icon={<Edit3 size={24} />} 
                text="Customizable if you want to change wording or photos" 
                delay={600}
                direction="right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;