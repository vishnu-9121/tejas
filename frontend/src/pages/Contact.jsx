import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { sanityService } from '@/services/sanityService';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

export const Contact = () => {
  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'contact'],
    queryFn: async () => {
      const res = await cmsService.getCmsData('contact');
      if (res?.data?.publishedData || res?.data?.data) return res;
      return await cmsService.getCmsData('site_settings');
    },
    staleTime: 60 * 1000,
  });

  const { data: contactData } = useQuery({
    queryKey: ['sanity', 'contactPage'],
    queryFn: () => sanityService.getContactPage(),
    staleTime: 0,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;

  const title = cmsData?.heroTitle || cmsData?.title || contactData?.heroTitle || contactData?.title || "Get in Touch with Tejas Academy";
  const subtitle = cmsData?.heroSubtitle || cmsData?.subtitle || contactData?.heroSubtitle || contactData?.subtitle || "Our admissions and academic support teams are available 6 days a week.";
  const address = cmsData?.campusAddress || cmsData?.address || contactData?.campusAddress || contactData?.address || "Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101";
  const phone = cmsData?.helplinePhone || cmsData?.phone || cmsData?.contactPhone || contactData?.helplinePhone || contactData?.phone || "+91 83310 51327";
  const email = cmsData?.generalEmail || cmsData?.email || cmsData?.contactEmail || contactData?.generalEmail || contactData?.email || "support@unlocktejas.com";
  const workingHours = cmsData?.officeHours || cmsData?.workingHours || contactData?.workingHours || "Monday - Saturday: 9:00 AM - 6:00 PM IST";
  const mapUrl = cmsData?.googleMapsEmbedUrl || cmsData?.mapEmbedUrl || contactData?.googleMapsEmbedUrl || contactData?.mapEmbedUrl || "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed";

  const rawPhoneDigits = phone.replace(/[^0-9]/g, '');

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Contact Us & Helpdesk" 
        description="Get in touch with Tejas Academy of Excellence in Gannavaram. Reach our admissions counselors, student support, and campus administration."
        url="https://unlocktejas.com/contact"
      />
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
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">Official Helpline & WhatsApp</h4>
                <div className="flex items-center gap-3 mt-1">
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-primary-700 font-semibold hover:underline">
                    {phone}
                  </a>
                  <span className="text-gray-300">|</span>
                  <a 
                    href={`https://wa.me/${rawPhoneDigits || '918331051327'}?text=Hi%2C%20I%20would%20like%20to%20connect%20with%20Tejas%20Academy`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Official Email</h4>
                <a href={`mailto:${email}`} className="text-sm text-primary-700 font-semibold hover:underline mt-1 inline-block">
                  {email}
                </a>
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
            <iframe 
              title="Tejas Academy Campus Location Map" 
              width="100%" 
              height="100%" 
              className="border-0" 
              src={mapUrl}
            ></iframe>
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
