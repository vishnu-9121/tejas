export const freeProgram = {
  name: 'freeProgram',
  title: 'Free Learning Programs',
  type: 'document',
  fields: [
    { name: 'title', title: 'Course / Workshop Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    { name: 'category', title: 'Category (Coding, AI, Leadership, Data Science)', type: 'string' },
    { name: 'duration', title: 'Duration (e.g., 2 Hours, 1 Week)', type: 'string', initialValue: 'Self-Paced' },
    { name: 'shortDescription', title: 'Summary Teaser', type: 'text' },
    { name: 'modulesCount', title: 'Number of Modules', type: 'number', initialValue: 5 },
    { name: 'enrollLink', title: 'Direct Access / Registration Link', type: 'string', initialValue: '/admissions' },
    { name: 'coverImage', title: 'Cover Photo', type: 'image', options: { hotspot: true } }
  ]
};
