export const aboutPage = {
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  fields: [
    { name: 'heroTitle', title: 'Header Title', type: 'string', initialValue: 'Shaping Leaders of Academic & Industry Innovation' },
    { name: 'heroSubtitle', title: 'Header Subtitle', type: 'text', initialValue: 'Tejas Academy of Excellence was founded to bridge the gap between academic theory and real-world industrial impact.' },
    { name: 'storyText', title: 'Our Story', type: 'text' },
    { name: 'missionText', title: 'Mission Statement', type: 'text' },
    { name: 'visionText', title: 'Vision Statement', type: 'text' },
    {
      name: 'founderMessage',
      title: 'Founder\'s Message Section',
      type: 'object',
      fields: [
        { name: 'founderName', title: 'Founder Name', type: 'string', initialValue: 'Dr. V. R. Sharma' },
        { name: 'founderTitle', title: 'Founder Designation', type: 'string', initialValue: 'Founder & Managing Chancellor' },
        { name: 'messageText', title: 'Founder\'s Message', type: 'text' },
        { name: 'founderPhoto', title: 'Founder Photo', type: 'image', options: { hotspot: true } }
      ]
    },
    {
      name: 'timeline',
      title: 'Milestones & History Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timelineItem',
          fields: [
            { name: 'year', title: 'Year (e.g. 2018)', type: 'string' },
            { name: 'title', title: 'Milestone Title', type: 'string' },
            { name: 'description', title: 'Details', type: 'text' }
          ]
        }
      ]
    }
  ]
};
