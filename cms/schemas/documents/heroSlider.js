export const heroSlider = {
  name: 'heroSlider',
  title: 'Homepage Hero Slider',
  type: 'document',
  fields: [
    { name: 'title', title: 'Slide Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'subtitle', title: 'Badge / Subtitle', type: 'string', initialValue: '🎓 Admissions Open for 2026-27' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'primaryCtaText', title: 'Primary Button Label', type: 'string', initialValue: 'Apply for Admissions' },
    { name: 'primaryCtaLink', title: 'Primary Button Path', type: 'string', initialValue: '/admissions' },
    { name: 'secondaryCtaText', title: 'Secondary Button Label', type: 'string', initialValue: 'Explore Programs' },
    { name: 'secondaryCtaLink', title: 'Secondary Button Path', type: 'string', initialValue: '/programs' },
    { name: 'bgImage', title: 'Background Slide Photo', type: 'image', options: { hotspot: true } },
    { name: 'overlayColor', title: 'Overlay Density (e.g. dark, medium, light)', type: 'string', initialValue: 'dark' },
    { name: 'order', title: 'Display Order', type: 'number', initialValue: 0 },
    { name: 'isActive', title: 'Active Slide', type: 'boolean', initialValue: true }
  ]
};
