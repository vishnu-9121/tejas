/**
 * Sanity Studio Initial Dataset Seed & Pre-population Script
 * Pre-fills Sanity documents with all existing website content
 */

export const INITIAL_SANITY_DATASET = {
  siteSettings: {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Tejas Academy of Excellence',
    siteTagline: 'Unlocking Leadership & Academic Excellence',
    contactEmail: 'support@unlocktejas.com',
    contactPhone: '+91 83310 51327',
    whatsappNumber: '+91 83310 51327',
    physicalAddress: 'Beside L K Towers, Roy Nagar, Gannavaram - 521101',
    metaDefaults: {
      metaTitle: 'Tejas Academy of Excellence | Higher Education & Professional Leadership',
      metaDescription: 'Empowering India\'s next generation with industry-aligned B.Tech, MBA, Data Science, and AI degree programs.',
      keywords: 'Tejas Academy, Engineering, MBA, Data Science, AI, Hyderabad Admissions'
    }
  },

  homepage: {
    _id: 'homepage',
    _type: 'homepage',
    hero: {
      title: 'Architect Your Career with Industry-Driven Excellence',
      subtitle: '🚀 Admissions Open for Academic Year 2026-27',
      description: 'Empowering future leaders with cutting-edge engineering, data science, and management degree programs.',
      primaryCtaText: 'Apply for Admissions',
      primaryCtaLink: '/admissions',
      secondaryCtaText: 'Explore Programs',
      secondaryCtaLink: '/programs'
    },
    stats: [
      { label: 'Placement Rate', value: '98.4%', icon: 'Award' },
      { label: 'Highest Package', value: '₹42 LPA', icon: 'TrendingUp' },
      { label: 'Industry Partners', value: '250+', icon: 'Building' },
      { label: 'Active Scholars', value: '5,000+', icon: 'Users' }
    ],
    whyChooseUs: {
      title: 'Why Tejas Academy Leads Higher Education',
      subtitle: 'Built on academic rigour, industry mentorship, and cutting-edge practical infrastructure.',
      features: [
        { title: 'Industry-Curated Curriculum', description: 'Co-developed with tech leaders from Microsoft, Amazon, and Google.', icon: 'BookOpen' },
        { title: 'Global Faculty & Mentors', description: 'Learn directly from PhD scholars and veteran corporate directors.', icon: 'UserCheck' },
        { title: 'Advanced Innovation Labs', description: 'State-of-the-art AI, IoT, and Robotics research laboratories.', icon: 'Cpu' }
      ]
    },
    finalCta: {
      title: 'Ready to Transform Your Professional Journey?',
      description: 'Speak with our admissions counselors today and secure your seat in our flagship 2026 programs.',
      buttonText: 'Start Application Now',
      buttonLink: '/admissions'
    }
  },

  programs: [
    {
      _id: 'prog-btech-ai',
      _type: 'program',
      title: 'B.Tech in Artificial Intelligence & Machine Learning',
      slug: { current: 'btech-ai-ml' },
      category: 'Engineering',
      duration: '4 Years',
      level: 'Undergraduate',
      fee: '₹1,85,000 / Year',
      shortDescription: 'Comprehensive 4-year degree covering Neural Networks, Deep Learning, Computer Vision, and Generative AI.',
      isFeatured: true,
      status: 'published'
    },
    {
      _id: 'prog-mba-tech',
      _type: 'program',
      title: 'MBA in Tech Product Management & Business Analytics',
      slug: { current: 'mba-tech-product' },
      category: 'Management',
      duration: '2 Years',
      level: 'Postgraduate',
      fee: '₹2,50,000 / Year',
      shortDescription: 'Flagship executive MBA building business acumen, product strategy, and data-driven decision capabilities.',
      isFeatured: true,
      status: 'published'
    },
    {
      _id: 'prog-ds-exec',
      _type: 'program',
      title: 'Postgraduate Diploma in Applied Data Science',
      slug: { current: 'pgd-applied-data-science' },
      category: 'Data Science',
      duration: '1 Year',
      level: 'Postgraduate',
      fee: '₹1,20,000 / Total',
      shortDescription: 'Intensive hands-on program in Python, SQL, Cloud Data Engineering, and Predictive Analytics.',
      isFeatured: true,
      status: 'published'
    }
  ],

  faqs: [
    { _id: 'faq-1', _type: 'faq', question: 'What are the eligibility criteria for admissions?', answer: 'For B.Tech programs, candidates must have passed 10+2 with 60% aggregate in PCM. For MBA programs, a valid graduation degree with minimum 50% marks is required.', category: 'Admissions', order: 1 },
    { _id: 'faq-2', _type: 'faq', question: 'Does Tejas Academy offer placement guarantees?', answer: 'Tejas Academy does not offer placement guarantees. We focus on rigorous career development, real-world case challenges, industry mentorship, and continuous readiness validation to equip scholars for successful professional journeys.', category: 'Career Readiness', order: 2 },
    { _id: 'faq-3', _type: 'faq', question: 'Are merit-based scholarships available?', answer: 'Yes, merit scholarships up to 50% tuition waiver are awarded based on entrance score percentile and academic history.', category: 'Scholarships', order: 3 }
  ],

  testimonials: [
    { _id: 'test-1', _type: 'testimonial', name: 'Vikram Mehta', role: 'AI Research Engineer', programName: 'B.Tech AI & ML', company: 'Microsoft', quote: 'Tejas Academy gave me hands-on project experience in deep learning that directly prepared me for high-scale industry engineering.', rating: 5 },
    { _id: 'test-2', _type: 'testimonial', name: 'Ananya Roy', role: 'Senior Product Manager', programName: 'MBA Tech Management', company: 'Amazon', quote: 'The industry-aligned curriculum and mentor network at Tejas accelerated my career transition into tech product leadership.', rating: 5 }
  ]
};

console.log('[SanitySeed] Pre-populated dataset ready with', Object.keys(INITIAL_SANITY_DATASET).length, 'top-level entities.');
