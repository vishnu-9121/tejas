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
      S.divider(),
      S.listItem()
        .title('🏠 Page Builder Pages')
        .child(S.documentTypeList('page').title('Website Pages')),
      S.listItem()
        .title('🎓 Academic Programs')
        .child(S.documentTypeList('program').title('Programs Catalog')),
      S.listItem()
        .title('📅 Events & Workshops')
        .child(S.documentTypeList('event').title('Upcoming Events')),
      S.listItem()
        .title('📝 Tejas Insights')
        .child(S.documentTypeList('blog').title('Articles & News')),
      S.listItem()
        .title('👨‍🏫 Faculty & Mentors')
        .child(S.documentTypeList('mentor').title('Faculty Profiles')),
      S.listItem()
        .title('💬 Testimonials')
        .child(S.documentTypeList('testimonial').title('Student Stories')),
    ]);
