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
        list: [
          'General Information',
          'Learning Format & Experience',
          'Enrolment & Registration',
          'Certification & Assessment',
          'Career & Professional Development',
          'Institutional & Corporate Programs',
          'Workshops & Program Types',
          'Fees & Policies',
          'Technical & Access',
          'Support & Contact'
        ]
      },
      initialValue: 'General Information'
    },
    { name: 'order', title: 'Sort Order Index', type: 'number', initialValue: 0 },
    { name: 'isActive', title: 'Is Active / Published', type: 'boolean', initialValue: true }
  ]
};
