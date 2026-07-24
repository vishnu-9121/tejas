export const workshop = {
  name: 'workshop',
  title: 'Workshops & Bootcamps',
  type: 'document',
  fields: [
    { name: 'title', title: 'Workshop Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    { name: 'durationHours', title: 'Duration (Hours)', type: 'number', initialValue: 12 },
    { name: 'mode', title: 'Mode of Delivery', type: 'string', options: { list: ['Hands-on Lab', 'Live Virtual', 'Hybrid Boot Camp'] } },
    { name: 'description', title: 'Detailed Agenda & Overview', type: 'text' },
    { name: 'mentorName', title: 'Lead Industry Mentor', type: 'string' },
    { name: 'bannerImage', title: 'Banner Photo', type: 'image', options: { hotspot: true } }
  ]
};
