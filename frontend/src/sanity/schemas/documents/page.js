export const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'string', validation: (Rule) => Rule.required() },
    { 
      name: 'slug', 
      title: 'Slug Route', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Keywords (Comma separated)', type: 'string' },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image' }
      ]
    },
    {
      name: 'pageBuilder',
      title: 'Page Builder Sections',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'richTextBlock' },
        { type: 'cardsBlock' },
        { type: 'statsBlock' },
        { type: 'ctaBlock' },
        { type: 'faqBlock' }
      ]
    }
  ]
};
