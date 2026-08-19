import React from "react";
import { HeroSlider } from "../components/home/HeroSlider";
import { Stats } from "../components/home/Stats";
import { WhyTejas } from "../components/home/WhyTejas";
import { MissionVision } from "../components/home/MissionVision";
import { Pillars } from "../components/home/Pillars";
import { Journey } from "../components/home/Journey";
import { ProgramsSection } from "../components/home/ProgramsSection";
import { ExcellenceFactor } from "../components/admissions/ExcellenceFactor";
import { EventsSection } from "../components/home/EventsSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { ImpactSection } from "../components/home/ImpactSection";
import { FAQSection } from "../components/home/FAQSection";
import { CollaborationMarquee } from "../components/home/CollaborationMarquee";
import { FinalCTA } from "../components/home/FinalCTA";
import { SEO } from "../components/ui/SEO";

export function Home() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://unlocktejas.com/#organization",
        "name": "Tejas Academy of Excellence Private Limited",
        "alternateName": ["Tejas Academy of Excellence", "Tejas Academy"],
        "url": "https://unlocktejas.com",
        "logo": "https://unlocktejas.com/logo.png",
        "description": "Tejas Academy of Excellence is an educational and capability-development institution focused on Business, Entrepreneurship, Leadership, AI Literacy, Career Readiness, and Human Excellence.",
        "email": "support@unlocktejas.com",
        "telephone": "+91 83310 51327",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Beside L K Towers, Roy Nagar",
          "addressLocality": "Gannavaram, Vijayawada, Amaravathi",
          "postalCode": "521101",
          "addressRegion": "Andhra Pradesh",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://twitter.com/unlocktejas",
          "https://linkedin.com/company/unlocktejas",
          "https://instagram.com/unlocktejas",
          "https://youtube.com/@unlocktejas",
          "https://facebook.com/unlocktejas"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://unlocktejas.com/#website",
        "url": "https://unlocktejas.com",
        "name": "Tejas Academy of Excellence",
        "publisher": {
          "@id": "https://unlocktejas.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://unlocktejas.com/programs?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <SEO 
        pageKey="homepage"
        title="Tejas Academy of Excellence | Business, Entrepreneurship, Leadership & Career Skills"
        description="Tejas Academy of Excellence delivers practical capability-building programs in business, entrepreneurship, leadership, AI literacy, career readiness, and future skills."
        keywords="Tejas Academy, Tejas Academy of Excellence, Business School India, Entrepreneurship Academy, Leadership Training, AI Literacy, Career Readiness, Future Skills, Employability Skills, Human Excellence"
        canonical="https://unlocktejas.com/"
        schema={homeSchema}
      />
      <HeroSlider />
      <Stats />
      <WhyTejas />
      <MissionVision />
      <Pillars />
      <Journey />
      <ProgramsSection />
      <ExcellenceFactor />
      <EventsSection />
      <TestimonialsSection />
      <ImpactSection />
      <FAQSection />
      <CollaborationMarquee />
      <FinalCTA />
    </>
  );
}

export default Home;
