export const course = {
  name: 'course',
  title: 'Courses Catalog',
  type: 'document',
  fields: [
    { name: 'title', title: 'Course Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    { name: 'courseCode', title: 'Course Code (e.g. AI-401, DS-202)', type: 'string' },
    { name: 'department', title: 'Academic Department', type: 'string' },
    { name: 'credits', title: 'Credit Hours', type: 'number', initialValue: 4 },
    { name: 'description', title: 'Course Overview', type: 'text' },
    { name: 'instructor', title: 'Primary Instructor Name', type: 'string' },
    { name: 'coverImage', title: 'Course Cover Image', type: 'image', options: { hotspot: true } }
  ]
};
