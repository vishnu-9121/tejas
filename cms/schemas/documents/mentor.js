export const mentor = {
  name: 'mentor',
  title: 'Faculty & Mentors',
  type: 'document',
  fields: [
    { name: 'name', title: 'Faculty Name', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug Route',
      type: 'slug',
      options: { source: 'name', maxLength: 96 }
    },
    { name: 'role', title: 'Designation / Role (e.g. Head of AI & Robotics)', type: 'string' },
    { name: 'department', title: 'Department', type: 'string' },
    { name: 'bio', title: 'Professional Biography', type: 'text' },
    { name: 'image', title: 'Profile Photo', type: 'image', options: { hotspot: true } },
    { name: 'experienceYears', title: 'Years of Industry Experience', type: 'number' },
    { name: 'linkedInUrl', title: 'LinkedIn Profile URL', type: 'url' }
  ]
};
