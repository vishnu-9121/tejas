export const excellenceFactor = {
  name: 'excellenceFactor',
  title: 'Excellence Factor Diagnostic Wizard',
  type: 'document',
  fields: [
    { name: 'questionNumber', title: 'Step Number (1, 2, 3...)', type: 'number', validation: (Rule) => Rule.required() },
    { name: 'questionTitle', title: 'Question Heading', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'questionSubtitle', title: 'Helper Subtitle', type: 'string' },
    {
      name: 'options',
      title: 'Selectable Choice Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Option Title', type: 'string' },
            { name: 'description', title: 'Option Description', type: 'string' },
            { name: 'recommendedCategory', title: 'Recommended Stream (Engineering, MBA, Data Science, Executive)', type: 'string' },
            { name: 'icon', title: 'Lucide Icon Name', type: 'string' }
          ]
        }
      ]
    }
  ]
};
