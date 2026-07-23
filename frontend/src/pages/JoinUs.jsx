import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MessageCircle, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

export const JoinUs = () => {
  const communities = [
    {
      name: 'WhatsApp Community',
      icon: <MessageCircle className="w-8 h-8 text-green-500" />,
      description: 'Join our active WhatsApp group for daily updates, scholarship alerts, and direct interaction with counselors.',
      link: '#',
      color: 'hover:border-green-500'
    },
    {
      name: 'LinkedIn Network',
      icon: <Linkedin className="w-8 h-8 text-blue-600" />,
      description: 'Connect with alumni, industry mentors, and follow our professional achievements.',
      link: '#',
      color: 'hover:border-blue-600'
    },
    {
      name: 'Instagram Campus Life',
      icon: <Instagram className="w-8 h-8 text-pink-600" />,
      description: 'Experience daily campus life, events, and student takeovers.',
      link: '#',
      color: 'hover:border-pink-600'
    },
    {
      name: 'YouTube Masterclasses',
      icon: <Youtube className="w-8 h-8 text-red-600" />,
      description: 'Watch free masterclasses from our global faculty and guest speakers.',
      link: '#',
      color: 'hover:border-red-600'
    },
    {
      name: 'Twitter / X Updates',
      icon: <Twitter className="w-8 h-8 text-blue-400" />,
      description: 'Follow us for quick announcements, thought leadership, and live event coverage.',
      link: '#',
      color: 'hover:border-blue-400'
    }
  ];

  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <SectionHeader 
        title="Join Our Community" 
        description="Become a part of the Tejas ecosystem even before you apply. Connect, learn, and grow with our vibrant network of future leaders." 
      />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((comm, idx) => (
          <a 
            key={idx}
            href={comm.link}
            className={`block bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${comm.color}`}
          >
            <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              {comm.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{comm.name}</h3>
            <p className="text-gray-600 leading-relaxed">{comm.description}</p>
          </a>
        ))}
      </div>
      
      <div className="mt-20 bg-primary-900 text-white rounded-3xl p-10 md:p-14 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take the next step?</h2>
        <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
          If you have explored our communities and are ready to apply for our programs or the scholarship test, head over to the Admissions portal.
        </p>
        <a 
          href="/admissions" 
          className="inline-block bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold px-8 py-4 rounded-full transition-colors"
        >
          Go to Admissions
        </a>
      </div>
    </div>
  );
};
