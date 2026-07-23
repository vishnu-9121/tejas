export const themeSettings = {
  name: 'themeSettings',
  title: 'Global Theme & Design Manager',
  type: 'document',
  fields: [
    { name: 'primaryColor', title: 'Primary Brand Color (Hex)', type: 'string', initialValue: '#0f172a' },
    { name: 'secondaryColor', title: 'Secondary Accent Color (Hex)', type: 'string', initialValue: '#d97706' },
    { name: 'accentColor', title: 'Highlight Accent Color (Hex)', type: 'string', initialValue: '#f59e0b' },
    { name: 'borderRadius', title: 'Global Border Radius (e.g. 0.75rem)', type: 'string', initialValue: '0.75rem' },
    { name: 'fontFamily', title: 'Primary Font Family', type: 'string', initialValue: 'Inter, sans-serif' },
    { name: 'enableDarkMode', title: 'Enable Dark Mode Support', type: 'boolean', initialValue: false }
  ]
};
