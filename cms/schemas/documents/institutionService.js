export const institutionService = {
  name: 'institutionService',
  title: 'For Institutions Solutions',
  type: 'document',
  fields: [
    { name: 'title', title: 'Service Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'category', title: 'Service Category (Faculty Development, Skill Training, MoUs)', type: 'string' },
    { name: 'description', title: 'Detailed Service Description', type: 'text' },
    {
      name: 'keyBenefits',
      title: 'Key Benefits List',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { name: 'icon', title: 'Lucide Icon Name', type: 'string' }
  ]
};
