export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero Section Block',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Main Heading', type: 'string' },
    { name: 'subheading', title: 'Subheading', type: 'string' },
    { name: 'description', title: 'Description Text', type: 'text' },
    { name: 'primaryCtaText', title: 'Primary CTA Text', type: 'string' },
    { name: 'primaryCtaLink', title: 'Primary CTA Link', type: 'string' },
    { name: 'secondaryCtaText', title: 'Secondary CTA Text', type: 'string' },
    { name: 'secondaryCtaLink', title: 'Secondary CTA Link', type: 'string' },
    { 
      name: 'bgImage', 
      title: 'Background Image', 
      type: 'image', 
      options: { hotspot: true }
    }
  ]
};

export const richTextBlock = {
  name: 'richTextBlock',
  title: 'Rich Text Block',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Section Heading', type: 'string' },
    { name: 'content', title: 'Body Content (Markdown / HTML)', type: 'text' }
  ]
};

export const cardsBlock = {
  name: 'cardsBlock',
  title: 'Cards Grid Block',
  type: 'object',
  fields: [
    { name: 'title', title: 'Grid Title', type: 'string' },
    { name: 'subtitle', title: 'Grid Subtitle', type: 'string' },
    {
      name: 'cards',
      title: 'Cards Item List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'cardTitle', title: 'Title', type: 'string' },
            { name: 'cardDescription', title: 'Description', type: 'text' },
            { name: 'cardLink', title: 'Target Link', type: 'string' },
            { name: 'cardImage', title: 'Image', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    }
  ]
};

export const statsBlock = {
  name: 'statsBlock',
  title: 'Statistics Counters Block',
  type: 'object',
  fields: [
    { name: 'title', title: 'Section Title', type: 'string' },
    {
      name: 'items',
      title: 'Metric Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Metric Value (e.g. 98%)', type: 'string' }
          ]
        }
      ]
    }
  ]
};

export const ctaBlock = {
  name: 'ctaBlock',
  title: 'Call To Action Block',
  type: 'object',
  fields: [
    { name: 'heading', title: 'CTA Heading', type: 'string' },
    { name: 'description', title: 'CTA Description', type: 'text' },
    { name: 'buttonText', title: 'Button Text', type: 'string' },
    { name: 'buttonLink', title: 'Button Link', type: 'string' }
  ]
};

export const faqBlock = {
  name: 'faqBlock',
  title: 'FAQ Accordion Block',
  type: 'object',
  fields: [
    { name: 'title', title: 'FAQ Title', type: 'string' },
    {
      name: 'items',
      title: 'Questions & Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ]
        }
      ]
    }
  ]
};
