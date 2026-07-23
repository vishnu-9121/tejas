import React from "react";
import { Hero } from "../components/home/Hero";
import { Stats } from "../components/home/Stats";
import { WhyTejas } from "../components/home/WhyTejas";
import { MissionVision } from "../components/home/MissionVision";
import { Pillars } from "../components/home/Pillars";
import { Journey } from "../components/home/Journey";
import { ProgramsSection } from "../components/home/ProgramsSection";
import { EventsSection } from "../components/home/EventsSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { ImpactSection } from "../components/home/ImpactSection";
import { GallerySection } from "../components/home/GallerySection";
import { BlogsSection } from "../components/home/BlogsSection";
import { FAQSection } from "../components/home/FAQSection";
import { PartnerLogos } from "../components/home/PartnerLogos";
import { FinalCTA } from "../components/home/FinalCTA";
import { SEO } from "../components/ui/SEO";

export function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Tejas Academy of Excellence",
    "description": "Transforming education through values, ethics, and leadership.",
    "url": "https://tejasacademy.edu.in",
    "logo": "https://res.cloudinary.com/dvfpt33g3/image/upload/v1731671239/tejas_logo_main.png"
  };

  return (
    <>
      <SEO 
        title="Home"
        description="Tejas Academy of Excellence: Transforming education through values, ethics, and leadership. Discover our premium programs."
        keywords="Tejas Academy, Education, Leadership, Excellence, Premium Education"
        schema={schema}
      />
      <Hero />
      <Stats />
      <WhyTejas />
      <MissionVision />
      <Pillars />
      <Journey />
      <ProgramsSection />
      <EventsSection />
      <TestimonialsSection />
      <ImpactSection />
      <GallerySection />
      <BlogsSection />
      <FAQSection />
      <PartnerLogos />
      <FinalCTA />
    </>
  );
}
