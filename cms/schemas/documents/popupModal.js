export default {
  name: 'popupModal',
  title: 'Popups, Modals & Banners',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Popup Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'popupType',
      title: 'Popup Type / Placement',
      type: 'string',
      options: {
        list: [
          { title: 'Exit Intent Modal', value: 'exitIntent' },
          { title: 'Welcome / Admission Popup', value: 'welcome' },
          { title: 'Scholarship Offer Modal', value: 'scholarship' },
          { title: 'Floating Announcement Bar', value: 'announcementBar' },
          { title: 'WhatsApp Quick Connect Widget', value: 'quickConnect' }
        ]
      },
      initialValue: 'exitIntent',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isEnabled',
      title: 'Enable Popup Modal',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Highlight Badge',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description Content',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Promotional Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'primaryCtaText',
      title: 'Primary Button Text',
      type: 'string',
      initialValue: 'Claim Scholarship',
    },
    {
      name: 'primaryCtaLink',
      title: 'Primary Button Destination URL',
      type: 'string',
      initialValue: '/admissions',
    },
    {
      name: 'secondaryCtaText',
      title: 'Secondary Button Text',
      type: 'string',
    },
    {
      name: 'secondaryCtaLink',
      title: 'Secondary Button URL',
      type: 'string',
    },
    {
      name: 'displayFrequency',
      title: 'Display Frequency',
      type: 'string',
      options: {
        list: [
          { title: 'Every Visit', value: 'always' },
          { title: 'Once Per Session', value: 'once_session' },
          { title: 'Once Per Day', value: 'once_day' }
        ]
      },
      initialValue: 'once_session',
    },
    {
      name: 'targetPages',
      title: 'Target Pages (Leave empty for All Pages)',
      type: 'array',
      of: [{ type: 'string' }],
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'popupType',
      enabled: 'isEnabled'
    },
    prepare({ title, subtitle, enabled }) {
      return {
        title: title || 'Untitled Popup',
        subtitle: `${subtitle || 'general'} | ${enabled ? '🟢 Active' : '🔴 Disabled'}`,
      };
    }
  }
};
