import React from 'react';
import { 
  HeroBlock, 
  RichTextBlock, 
  CardsBlock, 
  StatsBlock, 
  CTABlock, 
  FAQBlock 
} from './SanityBlocks';

const BLOCK_COMPONENTS = {
  heroBlock: HeroBlock,
  hero: HeroBlock,
  richTextBlock: RichTextBlock,
  richText: RichTextBlock,
  cardsBlock: CardsBlock,
  cards: CardsBlock,
  statsBlock: StatsBlock,
  stats: StatsBlock,
  ctaBlock: CTABlock,
  cta: CTABlock,
  faqBlock: FAQBlock,
  faq: FAQBlock
};

export function PageBuilder({ blocks = [] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="sanity-page-builder space-y-0">
      {blocks.map((block, index) => {
        const type = block._type || block.blockType;
        const Component = BLOCK_COMPONENTS[type];

        if (!Component) {
          console.warn(`[PageBuilder] No component found for block type: "${type}"`);
          return null;
        }

        return <Component key={block._key || index} block={block.content || block} />;
      })}
    </div>
  );
}

export default PageBuilder;
