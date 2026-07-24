export const testimonial = {
  name: 'testimonial',
  title: 'Student Testimonials',
  type: 'document',
  fields: [
    { name: 'name', title: 'Student Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'role', title: 'Degree / Current Role (e.g. B.Tech Graduate, AI Engineer at Google)', type: 'string' },
    { name: 'programName', title: 'Enrolled Program', type: 'string' },
    { name: 'company', title: 'Company / Placement', type: 'string' },
    { name: 'quote', title: 'Student Review Quote', type: 'text', validation: (Rule) => Rule.required() },
    { name: 'rating', title: 'Star Rating (1 to 5)', type: 'number', initialValue: 5 },
    { name: 'avatar', title: 'Student Photo', type: 'image', options: { hotspot: true } }
  ]
};
