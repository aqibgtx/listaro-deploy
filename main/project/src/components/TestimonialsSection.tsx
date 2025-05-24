import React, { useRef } from 'react';
import { useInView } from '../utils/useInView';
import { ClientReviews } from './ui/client-reviews';

const testimonials = [
  {
    rating: 5,
    reviewer: "Hafiz",
    roleReviewer: "Used Phone Dealer",
    review: "I don't need to keep reposting phones every week anymore. I upload one time, and it just works. More time to close deals.",
    date: "2024-03-15",
  },
  {
    rating: 4.8,
    reviewer: "Faizal",
    roleReviewer: "Phone Reseller",
    review: "My Facebook got flagged before because I posted too many phones at once. Listaro spaces everything out properly, no problems since.",
    date: "2025-03-14",
  },
  {
    rating: 5,
    reviewer: "Nizam",
    roleReviewer: "Phone Dealer",
    review: "It's like having someone do all the Facebook work for me. I open WhatsApp, talk to serious buyers, and that's it.",
    date: "2025-03-13",
  },
  {
    rating: 4.9,
    reviewer: "Ahmad",
    roleReviewer: "Dealership Owner",
    review: "Best decision I made for my company this year. My sales team can focus on customers instead of Facebook posting.",
    date: "2025-03-12",
  }
];

const TestimonialsSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [titleInView] = useInView(titleRef, { direction: 'down', distance: 50 });
  const [reviewsInView] = useInView(reviewsRef, { direction: 'up', distance: 50, delay: 300 });

  return (
    <section className="min-h-[80vh] bg-white py-20 px-4 md:px-8 flex items-center">
      <div className="container mx-auto">
        <h2 
          ref={titleRef}
          className={`text-4xl md:text-5xl font-bold mb-16 text-center transition-all duration-700 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
          }`}
        >
          What Other Dealers Say About Listaro
        </h2>
        
        <div 
          ref={reviewsRef}
          className={`max-w-4xl mx-auto transition-all duration-700 delay-300 ${
            reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
          }`}
        >
          <ClientReviews reviews={testimonials} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;