import { themeSettings } from './documents/themeSettings';
import { page } from '../../frontend/src/sanity/schemas/documents/page';
import { 
  heroBlock, 
  richTextBlock, 
  cardsBlock, 
  statsBlock, 
  ctaBlock, 
  faqBlock 
} from '../../frontend/src/sanity/schemas/objects/pageBuilderBlocks';

export const schemaTypes = [
  page,
  themeSettings,
  heroBlock,
  richTextBlock,
  cardsBlock,
  statsBlock,
  ctaBlock,
  faqBlock
];
