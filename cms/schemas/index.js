import { siteSettings } from './documents/siteSettings';
import { themeSettings } from './documents/themeSettings';
import { homepage } from './documents/homepage';
import { heroSlider } from './documents/heroSlider';
import { collaboration } from './documents/collaboration';
import { excellenceFactor } from './documents/excellenceFactor';
import { freeProgram } from './documents/freeProgram';
import { institutionService } from './documents/institutionService';
import { recognition } from './documents/recognition';
import { navigation } from './documents/navigation';
import { aboutPage } from './documents/aboutPage';
import { contactPage } from './documents/contactPage';
import { footer } from './documents/footer';
import { program } from './documents/program';
import { course } from './documents/course';
import { workshop } from './documents/workshop';
import { event } from './documents/event';
import { blog } from './documents/blog';
import { mentor } from './documents/mentor';
import { testimonial } from './documents/testimonial';
import { faq } from './documents/faq';
import { gallery } from './documents/gallery';
import { page } from '../../frontend/src/sanity/schemas/documents/page';
import { 
  heroBlock, 
  richTextBlock, 
  cardsBlock, 
  statsBlock, 
  ctaBlock, 
  faqBlock 
} from '../../frontend/src/sanity/schemas/objects/pageBuilderBlocks';

import popupModal from './documents/popupModal';

export const schemaTypes = [
  siteSettings,
  themeSettings,
  homepage,
  heroSlider,
  collaboration,
  excellenceFactor,
  freeProgram,
  institutionService,
  recognition,
  popupModal,
  navigation,
  aboutPage,
  contactPage,
  footer,
  program,
  course,
  workshop,
  event,
  blog,
  mentor,
  testimonial,
  faq,
  gallery,
  page,
  heroBlock,
  richTextBlock,
  cardsBlock,
  statsBlock,
  ctaBlock,
  faqBlock
];
