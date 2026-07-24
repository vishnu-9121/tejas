export const program = {
  name: 'program',
  title: 'Academic Program',
  type: 'document',
  fields: [
    { name: 'title', title: 'Program Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Program Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Engineering & Tech', value: 'Engineering' },
          { title: 'Management & Business', value: 'Management' },
          { title: 'Data Science & AI', value: 'Data Science' },
          { title: 'Executive Coaching', value: 'Executive' }
        ]
      }
    },
    { name: 'duration', title: 'Duration (e.g. 4 Years, 2 Years)', type: 'string' },
    { name: 'level', title: 'Degree Level (Undergraduate, Postgraduate, Diploma)', type: 'string' },
    { name: 'fee', title: 'Annual Tuition Fee', type: 'string' },
    { name: 'shortDescription', title: 'Card Teaser Description', type: 'text' },
    { name: 'description', title: 'Full Program Overview', type: 'text' },
    {
      name: 'highlights',
      title: 'Key Program Highlights',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    },
    { name: 'isFeatured', title: 'Highlight on Homepage?', type: 'boolean', initialValue: false },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'published', options: { list: ['draft', 'published', 'archived'] } }
  ]
};
