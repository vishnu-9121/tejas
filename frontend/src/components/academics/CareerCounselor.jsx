import React from 'react';
import { Phone, MessageSquare, Calendar, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function CareerCounselor() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-lg select-none">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        
        {/* Counselor Avatar / Photo */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
              alt="Senior Academic Counselor" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-2 shadow-lg">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Details & CTA */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-widest">
            Academic Advisory Desk
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
            Talk to Our Senior Career Counselor
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Unsure which degree or specialization best matches your career goals? Speak directly with our admissions counselors for personalized guidance on course structures, scholarships, and placement outcomes.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Button
              as="a"
              href="https://wa.me/918331051327?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Tejas%20Academy%20programs"
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
              size="md"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              className="font-bold shadow-md"
            >
              WhatsApp Direct
            </Button>
            <Button
              as="a"
              href="tel:+918331051327"
              variant="outline"
              size="md"
              leftIcon={<Phone className="w-4 h-4" />}
              className="font-bold"
            >
              Call Helpline
            </Button>
            <Button
              as={Link}
              to="/admissions"
              variant="primary"
              size="md"
              leftIcon={<Calendar className="w-4 h-4" />}
              className="font-bold shadow-md shadow-amber-500/20"
            >
              Book Advisory Session
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
