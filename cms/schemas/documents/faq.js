export const faq = {
  name: 'faq',
  title: 'Frequently Asked Questions',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'answer', title: 'Detailed Answer', type: 'text', validation: (Rule) => Rule.required() },
    {
      name: 'category',
      title: 'FAQ Category',
      type: 'string',
      options: {
        list: ['General', 'Admissions', 'Programs', 'Placements', 'Scholarships', 'Campus Life']
      },
      initialValue: 'General'
    },
    { name: 'order', title: 'Sort Order Index', type: 'number', initialValue: 0 }
  ]
};
