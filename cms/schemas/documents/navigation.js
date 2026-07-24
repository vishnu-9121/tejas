export const navigation = {
  name: 'navigation',
  title: 'Header Navigation',
  type: 'document',
  fields: [
    { name: 'logoText', title: 'Header Logo Text', type: 'string', initialValue: 'TEJAS ACADEMY' },
    { name: 'logoImage', title: 'Header Logo Image', type: 'image', options: { hotspot: true } },
    {
      name: 'menuItems',
      title: 'Main Header Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Menu Label', type: 'string' },
            { name: 'url', title: 'Route Path', type: 'string' },
            {
              name: 'dropdownItems',
              title: 'Sub-menu Dropdown Items (Optional)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Sub-menu Item Label', type: 'string' },
                    { name: 'url', title: 'Sub-menu Route Path', type: 'string' },
                    { name: 'description', title: 'Short Description Teaser', type: 'string' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'headerCta',
      title: 'Header Call-to-Action Button',
      type: 'object',
      fields: [
        { name: 'buttonText', title: 'Button Label', type: 'string', initialValue: 'Apply for Admissions' },
        { name: 'buttonLink', title: 'Target Path', type: 'string', initialValue: '/admissions' }
      ]
    }
  ]
};
