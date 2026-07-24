export const event = {
  name: 'event',
  title: 'Events & Workshops',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Event Slug Route',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Workshop', value: 'Workshop' },
          { title: 'Webinar', value: 'Webinar' },
          { title: 'Masterclass', value: 'Masterclass' },
          { title: 'Campus Seminar', value: 'Seminar' }
        ]
      }
    },
    { name: 'eventDate', title: 'Event Date & Time', type: 'datetime' },
    { name: 'location', title: 'Venue Location / Online URL', type: 'string' },
    { name: 'speaker', title: 'Keynote Speaker', type: 'string' },
    { name: 'description', title: 'Event Description', type: 'text' },
    { name: 'image', title: 'Banner Image', type: 'image', options: { hotspot: true } },
    { name: 'registrationLink', title: 'Registration Link', type: 'string' }
  ]
};
