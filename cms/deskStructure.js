export const deskStructure = (S) =>
  S.list()
    .title('Tejas Academy Studio')
    .items([
      S.listItem()
        .title('⚙️ Global Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('🎨 Global Theme Manager')
        .child(S.document().schemaType('themeSettings').documentId('themeSettings')),
      S.listItem()
        .title('🧭 Header Navigation')
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.listItem()
        .title('🏠 Homepage Manager')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('🎞️ Hero Banner Slider')
        .child(S.documentTypeList('heroSlider').title('Hero Banner Slides')),
      S.listItem()
        .title('🤝 Partners & Marquee')
        .child(S.documentTypeList('collaboration').title('Industry & Academic Partners')),
      S.listItem()
        .title('🧠 Excellence Factor Wizard')
        .child(S.documentTypeList('excellenceFactor').title('Excellence Factor Steps')),
      S.listItem()
        .title('ℹ️ About Page Content')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('📞 Contact Page Info')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.listItem()
        .title('🦶 Footer Content')
        .child(S.document().schemaType('footer').documentId('footer')),
      S.listItem()
        .title('📢 Popups, Modals & Banners')
        .child(S.documentTypeList('popupModal').title('Popups, Modals & Banners')),
      S.divider(),
      S.listItem()
        .title('🎓 Academic Programs Catalog')
        .child(S.documentTypeList('program').title('Programs Catalog')),
      S.listItem()
        .title('🎁 Free Programs & Resources')
        .child(S.documentTypeList('freeProgram').title('Free Programs')),
      S.listItem()
        .title('🏛️ For Institutions Solutions')
        .child(S.documentTypeList('institutionService').title('Institution Services')),
      S.listItem()
        .title('🏆 Recognitions & Awards')
        .child(S.documentTypeList('recognition').title('Recognitions')),
      S.listItem()
        .title('📚 Individual Courses')
        .child(S.documentTypeList('course').title('Courses Catalog')),
      S.listItem()
        .title('🛠️ Workshops & Bootcamps')
        .child(S.documentTypeList('workshop').title('Workshops')),
      S.listItem()
        .title('📅 Events & Masterclasses')
        .child(S.documentTypeList('event').title('Upcoming Events')),
      S.listItem()
        .title('📝 Tejas Insights Articles')
        .child(S.documentTypeList('blog').title('Articles & News')),
      S.listItem()
        .title('👨‍🏫 Faculty & Mentors')
        .child(S.documentTypeList('mentor').title('Faculty Profiles')),
      S.listItem()
        .title('💬 Student Testimonials')
        .child(S.documentTypeList('testimonial').title('Student Stories')),
      S.listItem()
        .title('❓ FAQ Registry')
        .child(S.documentTypeList('faq').title('FAQs List')),
      S.listItem()
        .title('🖼️ Campus Gallery')
        .child(S.documentTypeList('gallery').title('Media Gallery')),
    ]);
