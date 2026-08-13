import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Contact = () => {
  const { data: contactData } = useQuery({
    queryKey: ['sanity', 'contactPage'],
    queryFn: () => sanityService.getContactPage(),
    staleTime: 0,
  });

  const title = contactData?.heroTitle || contactData?.title || "Get in Touch with Tejas Academy";
  const subtitle = contactData?.heroSubtitle || contactData?.subtitle || "Our admissions and academic support teams are available 6 days a week.";
  const address = contactData?.campusAddress || contactData?.address || "Beside L K Towers, Roy Nagar, Gannavaram - 521101";
  const phone = contactData?.helplinePhone || contactData?.phone || "+91 98765 43210";
  const email = contactData?.generalEmail || contactData?.email || "info@unlocktejas.com";
  const workingHours = contactData?.workingHours || "Monday - Saturday: 9:00 AM - 6:00 PM IST";
  const mapUrl = contactData?.googleMapsEmbedUrl || contactData?.mapEmbedUrl || "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed";

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 select-none">
      <SectionHeader title={title} align="left" description={subtitle} />

      <div className="grid md:grid-cols-2 gap-12 items-start mt-10">
        <div className="space-y-8">
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Campus Address</h4>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Helpline & Direct Support</h4>
                <p className="text-sm text-gray-600 mt-1">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Official Email</h4>
                <p className="text-sm text-gray-600 mt-1">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Working Hours</h4>
                <p className="text-sm text-gray-600 mt-1">{workingHours}</p>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={mapUrl}></iframe>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200/80 p-6 md:p-8 rounded-3xl shadow-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
