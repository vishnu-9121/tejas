export const program = {
  name: 'program',
  title: 'Academic Program',
  type: 'document',
  fields: [
    { name: 'title', title: 'Program Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Program Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Undergraduate', value: 'Undergraduate' },
          { title: 'Postgraduate', value: 'Postgraduate' },
          { title: 'Engineering & Tech', value: 'Engineering' },
          { title: 'Management & Business', value: 'Management' },
          { title: 'Data Science & AI', value: 'Data Science' },
          { title: 'Executive Coaching', value: 'Executive' },
          { title: 'Certification', value: 'Certification' }
        ]
      }
    },
    { name: 'duration', title: 'Duration (e.g. 4 Years, 2 Years)', type: 'string' },
    { name: 'level', title: 'Degree Level (Undergraduate, Postgraduate, Diploma)', type: 'string' },
    { name: 'fees', title: 'Total Tuition Fee (INR)', type: 'number' },
    { name: 'fee', title: 'Tuition Fee Label', type: 'string' },
    { name: 'intake', title: 'Intake / Total Seats', type: 'number' },
    { name: 'mode', title: 'Mode of Study (On-Campus, Online, Hybrid)', type: 'string' },
    { name: 'eligibility', title: 'Eligibility Criteria', type: 'string' },
    { name: 'shortDescription', title: 'Card Teaser Description', type: 'text' },
    { name: 'description', title: 'Full Program Overview', type: 'text' },
    { name: 'overview', title: 'Comprehensive Overview', type: 'text' },
    {
      name: 'posterImage',
      title: 'Program Poster / Cover Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'image',
      title: 'Cover Image (Fallback)',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'bannerImage',
      title: 'Hero Banner Image',
      type: 'image',
      options: { hotspot: true }
    },
    { name: 'brochureUrl', title: 'Brochure PDF / Download URL', type: 'url' },
    {
      name: 'highlights',
      title: 'Key Program Highlights',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'learningOutcomes',
      title: 'Learning Outcomes',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'careerOpportunities',
      title: 'Career Pathways / Roles',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'curriculum',
      title: 'Curriculum Structure',
      type: 'array',
      of: [
        {
          name: 'curriculumItem',
          type: 'object',
          fields: [
            { name: 'semester', title: 'Semester / Term Title', type: 'string' },
            {
              name: 'courses',
              title: 'Course Titles',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        }
      ]
    },
    {
      name: 'faqs',
      title: 'Program FAQs',
      type: 'array',
      of: [
        {
          name: 'programFaqItem',
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ]
        }
      ]
    },
    { name: 'isFeatured', title: 'Highlight on Homepage?', type: 'boolean', initialValue: false },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'published', options: { list: ['draft', 'published', 'archived'] } }
  ]
};
