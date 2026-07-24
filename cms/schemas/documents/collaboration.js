export const collaboration = {
  name: 'collaboration',
  title: 'Industry & Academic Partners',
  type: 'document',
  fields: [
    { name: 'name', title: 'Partner / Company Name', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'category',
      title: 'Partner Category',
      type: 'string',
      options: { list: ['Industry Partner', 'Academic MoU', 'Supporting Organization', 'Recruitment Partner'] },
      initialValue: 'Industry Partner'
    },
    { name: 'logo', title: 'Partner Logo', type: 'image', options: { hotspot: true } },
    { name: 'websiteUrl', title: 'Partner Website Link', type: 'url' },
    { name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }
  ]
};
