export const blog = {
  name: 'blog',
  title: 'Tejas Insights Article',
  type: 'document',
  fields: [
    { name: 'title', title: 'Article Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    { name: 'author', title: 'Author Name', type: 'string', initialValue: 'Editorial Team' },
    { name: 'publishedAt', title: 'Publication Date', type: 'datetime' },
    { name: 'excerpt', title: 'Excerpt Summary', type: 'text' },
    { name: 'readTime', title: 'Reading Time (e.g. 5 min read)', type: 'string', initialValue: '5 min read' },
    { name: 'content', title: 'Article Full Body', type: 'text' },
    { name: 'mainImage', title: 'Featured Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'status', title: 'Publishing Status', type: 'string', initialValue: 'published', options: { list: ['draft', 'published', 'archived'] } }
  ]
};
