export const footer = {
  name: 'footer',
  title: 'Footer Content',
  type: 'document',
  fields: [
    { name: 'copyrightText', title: 'Copyright Line', type: 'string', initialValue: '© 2026 Tejas Academy of Excellence. All Rights Reserved.' },
    { name: 'accreditationText', title: 'Accreditation Disclaimer', type: 'text', initialValue: 'Approved by UGC & AICTE, Government of India.' },
    {
      name: 'quickLinks',
      title: 'Quick Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Link Label', type: 'string' },
            { name: 'url', title: 'Target Route', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'legalLinks',
      title: 'Legal Policy Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Policy Name', type: 'string' },
            { name: 'url', title: 'Route Path', type: 'string' }
          ]
        }
      ]
    }
  ]
};
