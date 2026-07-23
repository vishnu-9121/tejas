import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AdmissionsForm } from '@/components/forms/AdmissionsForm';
import { Award, BookOpen, Clock, CalendarDays } from 'lucide-react';

export const Admissions = () => {
  return (
    <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="Admissions 2026-2027" 
          description="Take the first step towards a transformative educational journey at Tejas Academy of Excellence." 
        />

        {/* Scholarship Test Banner */}
        <div className="mt-12 mb-20 relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-900 to-slate-900 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-400 font-bold text-sm mb-6 uppercase tracking-wider">
                <Award className="w-4 h-4" /> Nationwide Talent Hunt
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-6">Tejas Scholarship Test 2026</h2>
              <p className="text-lg text-primary-100 mb-8 max-w-xl leading-relaxed">
                We believe that financial constraints should never stand in the way of true potential. Apply for our upcoming National Scholarship Test and secure up to 100% tuition waiver for our flagship programs.
              </p>
              
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Test Date</p>
                    <p className="font-bold">August 25, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Duration</p>
                    <p className="font-bold">120 Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Format</p>
                    <p className="font-bold">Online Proctored</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center">
              <h3 className="text-xl font-bold mb-2">Register for the Test</h3>
              <p className="text-sm text-primary-100 mb-6">Last date to apply is August 20th.</p>
              <a href="#application-form" className="block w-full py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-accent-500/25">
                Apply for Scholarship
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mb-10" id="application-form">
          <h2 className="text-3xl font-bold font-outfit text-gray-900 mb-4">Common Application Form</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use this unified portal to apply for our Undergraduate, Postgraduate programs, or register for the Scholarship Test. Ensure you have your academic records handy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10">
          <AdmissionsForm />
        </div>
      </div>
    </div>
  );
};
