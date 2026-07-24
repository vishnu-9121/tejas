export const recognition = {
  name: 'recognition',
  title: 'Recognitions & Awards',
  type: 'document',
  fields: [
    { name: 'title', title: 'Award / Honor Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'issuingBody', title: 'Issuing Organization / Authority', type: 'string', initialValue: 'Government / Academic Body' },
    { name: 'year', title: 'Year Awarded', type: 'string', initialValue: '2025' },
    { name: 'description', title: 'Details', type: 'text' },
    { name: 'image', title: 'Certificate / Trophy Photo', type: 'image', options: { hotspot: true } }
  ]
};
