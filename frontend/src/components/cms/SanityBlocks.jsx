import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { urlForSanityImage } from '@/utils/sanityImage';

export function HeroBlock({ block }) {
  if (!block) return null;
  const { heading, subheading, description, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, bgImage } = block;
  const imageUrl = urlForSanityImage(bgImage);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-900 text-white px-6 md:px-12 overflow-hidden">
      {imageUrl && imageUrl !== '/placeholder.png' && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="max-w-4xl mx-auto text-center gap-6 relative z-10 space-y-6">
        {subheading && (
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary-600/20 text-primary-300 text-xs font-bold uppercase tracking-widest border border-primary-500/30">
            {subheading}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold font-serif leading-tight">{heading || 'Tejas Academy of Excellence'}</h1>
        {description && <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{description}</p>}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          {primaryCtaText && (
            <Button variant="gold" size="lg" as={Link} to={primaryCtaLink || '/admissions'} rightIcon={<ArrowRight />}>
              {primaryCtaText}
            </Button>
          )}
          {secondaryCtaText && (
            <Button variant="outline" size="lg" as={Link} to={secondaryCtaLink || '/programs'} className="text-white border-white/30 hover:bg-white/10">
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function RichTextBlock({ block }) {
  if (!block) return null;
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto font-inter">
      {block.heading && <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">{block.heading}</h2>}
      <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: block.content || block.description || '' }} />
    </section>
  );
}

export function CardsBlock({ block }) {
  if (!block) return null;
  const cards = block.cards || [];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {block.title && <h2 className="text-3xl font-bold text-center font-serif text-gray-900 mb-4">{block.title}</h2>}
      {block.subtitle && <p className="text-center text-gray-500 max-w-xl mx-auto mb-12">{block.subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{card.cardTitle}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.cardDescription}</p>
            {card.cardLink && (
              <Link to={card.cardLink} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function StatsBlock({ block }) {
  if (!block) return null;
  const items = block.items || [];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="text-4xl font-extrabold text-amber-400 font-outfit">{item.value}</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTABlock({ block }) {
  if (!block) return null;
  return (
    <section className="py-20 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white text-center px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold font-serif">{block.heading}</h2>
        {block.description && <p className="text-slate-300">{block.description}</p>}
        {block.buttonText && (
          <Button variant="gold" size="lg" as={Link} to={block.buttonLink || '/admissions'}>
            {block.buttonText}
          </Button>
        )}
      </div>
    </section>
  );
}

export function FAQBlock({ block }) {
  if (!block) return null;
  const items = block.items || [];

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      {block.title && <h2 className="text-3xl font-bold text-center font-serif text-gray-900 mb-10">{block.title}</h2>}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary-600 shrink-0" />
              {item.question}
            </h4>
            <p className="text-sm text-gray-600 pl-6 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
