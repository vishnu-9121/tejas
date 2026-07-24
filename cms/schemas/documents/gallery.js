export const gallery = {
  name: 'gallery',
  title: 'Campus & Event Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Media Title / Event Name', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'category',
      title: 'Gallery Category',
      type: 'string',
      options: { list: ['Campus Infrastructure', 'Convocations', 'Labs & Tech', 'Student Life', 'Cultural Events'] }
    },
    { name: 'image', title: 'High-Res Photo', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() },
    { name: 'caption', title: 'Photo Caption Teaser', type: 'string' }
  ]
};
