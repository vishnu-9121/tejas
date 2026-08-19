/**
 * Production-Grade Idempotent Sanity CMS Automatic Seeding Script (Backend Runner)
 * 
 * Pre-populates a brand-new or existing Sanity project with all 23+ required document types.
 * Safe to execute multiple times (uses createOrReplace to ensure exact schema compliance).
 * 
 * Usage:
 *   node backend/scripts/seedSanity.js
 *   npm run seed:sanity
 */

import 'dotenv/config';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || '6nl927hv';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.SANITY_API_VERSION || '2023-01-01';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || process.env.VITE_SANITY_API_TOKEN;

const SEED_DOCUMENTS = [
  // 1. Site Settings (Singleton)
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Tejas Academy of Excellence',
    siteTagline: 'Born from the Spark of Brilliance',
    contactEmail: 'support@unlocktejas.com',
    contactPhone: '+91 83310 51327',
    whatsappNumber: '+91 83310 51327',
    physicalAddress: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    googleMapsUrl: 'https://maps.google.com',
    googleAnalyticsId: 'G-TEJAS2026',
    socialLinks: [
      { _type: 'socialLink', platform: 'Facebook', url: 'https://facebook.com/unlocktejas' },
      { _type: 'socialLink', platform: 'Twitter', url: 'https://twitter.com/unlocktejas' },
      { _type: 'socialLink', platform: 'Instagram', url: 'https://instagram.com/unlocktejas' },
      { _type: 'socialLink', platform: 'LinkedIn', url: 'https://linkedin.com/company/unlocktejas' }
    ],
    metaDefaults: {
      _type: 'metaDefaults',
      metaTitle: 'Tejas Academy of Excellence | Higher Education & Leadership',
      metaDescription: 'Empowering India\'s next generation with industry-aligned B.Tech, MBA, Data Science, and AI degree programs.',
      keywords: 'Tejas Academy, Engineering, MBA, Data Science, AI, Gannavaram Admissions'
    }
  },

  // 2. Homepage (Singleton)
  {
    _id: 'homepage',
    _type: 'homepage',
    hero: {
      _type: 'heroBlock',
      title: 'Developing Leaders, Innovators & Entrepreneurs',
      subtitle: '🎓 Admissions Open for Academic Year 2026-27',
      description: 'Tejas Academy of Excellence cultivates human potential, real-world skills, and character fortitude to accelerate your career.',
      primaryCtaText: 'Apply for Admissions',
      primaryCtaLink: '/admissions',
      secondaryCtaText: 'Explore Programs',
      secondaryCtaLink: '/programs'
    },
    stats: [
      { _type: 'statItem', label: 'Career Readiness Rate', value: '98.4%', icon: 'Award' },
      { _type: 'statItem', label: 'Highest Package Potential', value: '₹42.5 LPA', icon: 'TrendingUp' },
      { _type: 'statItem', label: 'Enterprise Network & Alliances', value: '250+', icon: 'Building' },
      { _type: 'statItem', label: 'Global Active Learners', value: '12,000+', icon: 'Users' }
    ],
    whyChooseUs: {
      _type: 'whyChooseUsBlock',
      title: 'Redefining Professional Education',
      subtitle: 'Built on rigour, industry mentorship, and cutting-edge practical infrastructure.',
      features: [
        { _type: 'featureItem', title: 'Practical Case-Based Learning', description: 'Acquire real skills via live corporate challenges, simulations, and tech clinics.', icon: 'BookOpen' },
        { _type: 'featureItem', title: '1-on-1 Executive Mentorship', description: 'Get weekly coaching from engineering and product leaders at Fortune 500 firms.', icon: 'Users' },
        { _type: 'featureItem', title: 'Career Readiness Track', description: 'Continuous readiness validation securing smooth professional transitions.', icon: 'TrendingUp' },
        { _type: 'featureItem', title: 'Human Excellence Core', description: 'Ground yourself in human excellence values defining long-term leaders.', icon: 'Shield' }
      ]
    },
    impactMetrics: [
      { _type: 'statItem', label: 'Career Readiness Rate', value: '98%' },
      { _type: 'statItem', label: 'Average Starting Potential', value: '₹18.5 LPA' },
      { _type: 'statItem', label: 'Corporate Partners & Alliances', value: '500+' }
    ],
    finalCta: {
      _type: 'finalCtaBlock',
      title: 'Ready to Transform Your Professional Journey?',
      description: 'Speak with our admissions counselors today and secure your seat in our flagship 2026 degree programs.',
      buttonText: 'Start Application Now',
      buttonLink: '/admissions'
    }
  },

  // 3. About Page (Singleton)
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    heroTitle: 'Shaping Leaders of Academic & Industry Innovation',
    heroSubtitle: 'Tejas Academy of Excellence was founded to bridge the gap between academic theory and real-world industrial impact.',
    storyText: 'Over the years, our institution has evolved into a sprawling campus with state-of-the-art AI labs, robotics centers, and executive learning suites.',
    missionText: 'To nurture intellectual curiosity, foster technological innovation, and empower individuals to harmonize human excellence with technical mastery.',
    visionText: 'To be a globally recognized educational ecosystem cultivating ethical leaders, researchers, and entrepreneurs building the future.',
    leadershipMessage: 'To be a globally recognized institution that nurtures intellectual curiosity, fosters innovation, and empowers individuals to harmonize human excellence with technical mastery.',
    founderMessage: {
      _type: 'founderMessageBlock',
      founderName: 'Dr. V. R. Sharma',
      founderTitle: 'Founder & Managing Chancellor',
      messageText: 'Education is not merely the transmission of knowledge; it is the ignition of character, resilience, and ethical leadership.'
    },
    timeline: [
      { _type: 'timelineItem', year: '2015', title: 'Foundation', description: 'Established as an elite technical research initiative.' },
      { _type: 'timelineItem', year: '2020', title: 'AI & Data Expansion', description: 'Launched flagship AI research labs and corporate alliances.' },
      { _type: 'timelineItem', year: '2026', title: 'Global Excellence Campus', description: 'Over 12,000+ alumni leading tech enterprises worldwide.' }
    ]
  },

  // 4. Contact Page (Singleton)
  {
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Get in Touch with Tejas Academy',
    heroTitle: 'Connect with Our Academic Counselors',
    subtitle: 'Our admissions and academic support teams are available 6 days a week.',
    heroSubtitle: 'Have questions about admissions, fee structures, or campus visits?',
    email: 'support@unlocktejas.com',
    generalEmail: 'support@unlocktejas.com',
    supportEmail: 'support@unlocktejas.com',
    admissionsEmail: 'support@unlocktejas.com',
    phone: '+91 83310 51327',
    helplinePhone: '+91 83310 51327',
    whatsappSupport: '+91 83310 51327',
    address: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    campusAddress: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM IST',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    mapEmbedUrl: 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed'
  },

  // 5. Navigation (Singleton)
  {
    _id: 'navigation',
    _type: 'navigation',
    logoText: 'TEJAS ACADEMY',
    menuItems: [
      { _type: 'menuItem', label: 'Home', url: '/' },
      { _type: 'menuItem', label: 'Programs', url: '/programs' },
      { _type: 'menuItem', label: 'Free Programs', url: '/free-programs' },
      { _type: 'menuItem', label: 'For Institutions', url: '/for-institutions' },
      { _type: 'menuItem', label: 'Recognitions', url: '/recognitions' },
      { _type: 'menuItem', label: 'About', url: '/about' },
      { _type: 'menuItem', label: 'Contact', url: '/contact' }
    ],
    headerCta: {
      _type: 'headerCtaBlock',
      buttonText: 'Apply for Admissions',
      buttonLink: '/admissions'
    }
  },

  // 6. Footer (Singleton)
  {
    _id: 'footer',
    _type: 'footer',
    copyrightText: '© 2026 Tejas Academy of Excellence. All Rights Reserved.',
    accreditationText: '',
    quickLinks: [
      { _type: 'quickLink', label: 'Home', url: '/' },
      { _type: 'quickLink', label: 'Academic Programs', url: '/programs' },
      { _type: 'quickLink', label: 'Admissions & Scholarships', url: '/admissions' },
      { _type: 'quickLink', label: 'Free Learning Programs', url: '/free-programs' },
      { _type: 'quickLink', label: 'For Institutions', url: '/for-institutions' },
      { _type: 'quickLink', label: 'Recognitions & Awards', url: '/recognitions' },
      { _type: 'quickLink', label: 'Faculty & Mentors', url: '/mentors' },
      { _type: 'quickLink', label: 'Our Community', url: '/about' }
    ],
    legalLinks: [
      { _type: 'legalLink', label: 'Privacy Policy', url: '/privacy' },
      { _type: 'legalLink', label: 'Terms of Service', url: '/terms' }
    ]
  },

  // 7. Theme Settings (Singleton)
  {
    _id: 'themeSettings',
    _type: 'themeSettings',
    primaryColor: '#0b140c',
    accentColor: '#d49e35',
    enableDarkMode: true
  },

  // 8. Hero Slider (Collection Item 1)
  {
    _id: 'hero-slide-1',
    _type: 'heroSlider',
    title: 'Developing Leaders, Innovators & Entrepreneurs',
    subtitle: '🎓 Admissions Open for Academic Year 2026-27',
    description: 'Tejas Academy of Excellence cultivates human potential, real-world skills, and character fortitude to accelerate your career.',
    primaryCtaText: 'Apply for Admissions',
    primaryCtaLink: '/admissions',
    secondaryCtaText: 'Explore Programs',
    secondaryCtaLink: '/programs',
    isActive: true,
    order: 1
  },

  // 9. Hero Slider (Collection Item 2)
  {
    _id: 'hero-slide-2',
    _type: 'heroSlider',
    title: 'Master Artificial Intelligence & Data Leadership',
    subtitle: '🚀 Flagship B.Tech & Postgraduate Programs',
    description: 'Hands-on learning with neural networks, generative AI, and Cloud architecture co-designed with tech executives.',
    primaryCtaText: 'Download Curriculum',
    primaryCtaLink: '/programs',
    secondaryCtaText: 'Talk to Advisor',
    secondaryCtaLink: '/admissions',
    isActive: true,
    order: 2
  },

  // 10. Collaboration Partners
  {
    _id: 'collab-1',
    _type: 'collaboration',
    name: 'Microsoft for Startups',
    category: 'Technology Partner',
    order: 1
  },
  {
    _id: 'collab-2',
    _type: 'collaboration',
    name: 'Amazon Web Services Educate',
    category: 'Cloud Partner',
    order: 2
  },
  {
    _id: 'collab-3',
    _type: 'collaboration',
    name: 'Google Cloud Academic Program',
    category: 'AI Partner',
    order: 3
  },
  {
    _id: 'collab-4',
    _type: 'collaboration',
    name: 'National Skill Development Corp',
    category: 'Government MoU',
    order: 4
  },
  {
    _id: 'collab-5',
    _type: 'collaboration',
    name: 'NASSCOM FutureSkills Prime',
    category: 'Skill Alliance',
    order: 5
  },

  // 11. Recognitions & Awards
  {
    _id: 'rec-1',
    _type: 'recognition',
    title: 'Best Academic Innovation Institute 2025',
    issuingBody: 'National Education Excellence Leadership Awards',
    year: '2025',
    description: 'Recognized for pioneering industry-aligned curriculum and AI research labs.'
  },
  {
    _id: 'rec-2',
    _type: 'recognition',
    title: 'Top 10 Higher Education Centers in Telangana',
    issuingBody: 'Higher Education Review India',
    year: '2025',
    description: 'Awarded for exceptional graduate career readiness and modern campus infrastructure.'
  },
  {
    _id: 'rec-3',
    _type: 'recognition',
    title: 'Government Skill Alliance Accreditation',
    issuingBody: 'National Skill Development Corporation (NSDC)',
    year: '2024',
    description: 'Official partner institution for advanced tech & AI skill certifications.'
  },

  // 12. Free Programs
  {
    _id: 'free-prog-1',
    _type: 'freeProgram',
    title: 'Foundations of Generative AI & Prompt Engineering',
    slug: { _type: 'slug', current: 'generative-ai-prompt-engineering' },
    category: 'AI & Data',
    duration: '3 Hours',
    shortDescription: 'Learn to leverage LLMs, prompt patterns, and generative tools for technical productivity.',
    modulesCount: 4,
    enrollLink: '/admissions'
  },
  {
    _id: 'free-prog-2',
    _type: 'freeProgram',
    title: 'Executive Leadership & Strategic Decision Making',
    slug: { _type: 'slug', current: 'executive-leadership-strategy' },
    category: 'Leadership',
    duration: '5 Hours',
    shortDescription: 'Frameworks for strategic decision making, negotiation, and high-performance team culture.',
    modulesCount: 6,
    enrollLink: '/admissions'
  },
  {
    _id: 'free-prog-3',
    _type: 'freeProgram',
    title: 'Full-Stack Web Architecture Bootcamp',
    slug: { _type: 'slug', current: 'fullstack-web-architecture' },
    category: 'Software Tech',
    duration: '4 Hours',
    shortDescription: 'Build scalable modern web applications using React, Node.js, and cloud data APIs.',
    modulesCount: 5,
    enrollLink: '/admissions'
  },

  // 13. Institution Services
  {
    _id: 'inst-service-1',
    _type: 'institutionService',
    title: 'Faculty Development Programs (FDP)',
    category: 'Faculty Upskilling',
    description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
    keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery'],
    icon: 'BookOpen'
  },
  {
    _id: 'inst-service-2',
    _type: 'institutionService',
    title: 'Institutional Career Development & Skill Training Bootcamps',
    category: 'Student Competence',
    description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and professional skills.',
    keyBenefits: ['Mock Technical Interviews', 'Career Readiness Assessment Engine', 'Direct Corporate MoUs'],
    icon: 'Briefcase'
  },
  {
    _id: 'inst-service-3',
    _type: 'institutionService',
    title: 'Academic MoUs & Innovation Lab Setup',
    category: 'Campus Infrastructure',
    description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
    keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs'],
    icon: 'Building'
  },

  // 14. Excellence Factor Quiz
  {
    _id: 'excellence-quiz-1',
    _type: 'excellenceFactor',
    questionNumber: 1,
    questionTitle: 'What is your primary professional ambition?',
    questionSubtitle: 'Select the statement that resonates most with your career goals.',
    options: [
      { _type: 'optionItem', label: 'Building High-Scale AI & Software Systems', description: 'Deep technical mastery in AI, Cloud, and Software Architecture', recommendedCategory: 'Engineering', icon: 'Cpu' },
      { _type: 'optionItem', label: 'Leading Tech Products & Business Ventures', description: 'Product management, executive strategy, and scaling teams', recommendedCategory: 'Management', icon: 'TrendingUp' }
    ]
  },

  // 15. Programs Catalog
  {
    _id: 'prog-btech-ai',
    _type: 'program',
    title: 'B.Tech in Artificial Intelligence & Machine Learning',
    slug: { _type: 'slug', current: 'btech-ai-ml' },
    category: 'Undergraduate',
    duration: '4 Years',
    level: 'Undergraduate',
    fee: '₹1,85,000 / Year',
    shortDescription: 'Comprehensive 4-year degree covering Neural Networks, Deep Learning, Computer Vision, and Generative AI.',
    description: 'Full degree curriculum with hands-on labs and capstones.',
    isFeatured: true,
    status: 'published'
  },
  {
    _id: 'prog-global-leadership',
    _type: 'program',
    title: 'Global Leadership Certificate',
    slug: { _type: 'slug', current: 'global-leadership' },
    category: 'Leadership',
    duration: '1 Year',
    level: 'Executive',
    fee: '₹95,000',
    shortDescription: 'Develop advanced vision, executive communication, and high-stakes negotiation skills.',
    description: 'Executive program designed for emerging business and tech leaders.',
    isFeatured: true,
    status: 'published'
  },
  {
    _id: 'prog-startup-eng',
    _type: 'program',
    title: 'Startup Engineering & Venture Creation',
    slug: { _type: 'slug', current: 'startup-engineering' },
    category: 'Entrepreneurship',
    duration: '2 Years',
    level: 'Postgraduate',
    fee: '₹1,40,000 / Year',
    shortDescription: 'From idea to market validation: building and scaling venture-backed tech startups.',
    description: 'Hands-on incubator curriculum with venture capital pitch clinics.',
    isFeatured: true,
    status: 'published'
  },
  {
    _id: 'prog-master-comm',
    _type: 'program',
    title: 'Mastering Executive Communication',
    slug: { _type: 'slug', current: 'mastering-communication' },
    category: 'Communication',
    duration: '6 Months',
    level: 'Certification',
    fee: '₹45,000',
    shortDescription: 'Master boardroom presentations, executive speaking, and team persuasion.',
    description: 'Accelerate your career through high-impact communication.',
    isFeatured: false,
    status: 'published'
  },

  // 16. Course Item
  {
    _id: 'course-ai-101',
    _type: 'course',
    title: 'Deep Learning & Neural Network Architectures',
    slug: { _type: 'slug', current: 'deep-learning-architectures' },
    courseCode: 'AI-401',
    department: 'Artificial Intelligence',
    credits: 4,
    description: 'Master PyTorch, Transformers, CNNs, and LLM fine-tuning.'
  },

  // 17. Faculty & Mentors
  {
    _id: 'mentor-1',
    _type: 'mentor',
    name: 'Dr. Rajesh Sharma',
    slug: { _type: 'slug', current: 'dr-rajesh-sharma' },
    role: 'Head of AI Research & Professor',
    department: 'Computer Science & AI',
    bio: 'Ex-Google Research Director with 15+ years of experience in machine learning and neural systems.',
    experienceYears: 15,
    linkedInUrl: 'https://linkedin.com'
  },
  {
    _id: 'mentor-2',
    _type: 'mentor',
    name: 'Prof. Ananya Sen',
    slug: { _type: 'slug', current: 'prof-ananya-sen' },
    role: 'Director of Executive Management & Strategy',
    department: 'Management',
    bio: 'Ex-McKinsey Strategy Consultant specializing in tech product strategy and scaling.',
    experienceYears: 14,
    linkedInUrl: 'https://linkedin.com'
  },
  {
    _id: 'mentor-3',
    _type: 'mentor',
    name: 'Dr. Rajiv Malhotra',
    slug: { _type: 'slug', current: 'dr-rajiv-malhotra' },
    role: 'Professor of Cloud Data Architecture',
    department: 'Data Science',
    bio: 'Author of 12+ research papers in Distributed Systems and Cloud Analytics.',
    experienceYears: 16,
    linkedInUrl: 'https://linkedin.com'
  },

  // 18. Events
  {
    _id: 'event-summit-2026',
    _type: 'event',
    title: 'Global Leadership & AI Innovation Summit 2026',
    slug: { _type: 'slug', current: 'global-leadership-ai-summit-2026' },
    category: 'Leadership',
    date: '2026-08-15',
    time: '09:00 AM - 05:00 PM IST',
    location: 'Main Auditorium, Tejas Academy Campus, Gannavaram',
    description: 'Join corporate executives, AI researchers, and students for a landmark summit.'
  },
  {
    _id: 'event-masterclass-ai',
    _type: 'event',
    title: 'Generative AI & Cloud Architecture Masterclass',
    slug: { _type: 'slug', current: 'generative-ai-cloud-masterclass' },
    category: 'Technology',
    date: '2026-09-10',
    time: '10:00 AM - 04:00 PM IST',
    location: 'AI Innovation Center, Tejas Campus',
    description: 'Deep dive into Transformer architectures, prompt optimizations, and cloud scaling.'
  },

  // 19. Blog Insight Items
  {
    _id: 'blog-ethical-ai',
    _type: 'blog',
    title: 'The Future of Ethical Leadership in the Age of Generative AI',
    slug: { _type: 'slug', current: 'ethical-leadership-generative-ai' },
    category: 'Leadership',
    excerpt: 'How executive leaders harmonize moral values with high-scale algorithmic automation.',
    content: 'Generative AI is reshaping the corporate landscape...',
    publishedAt: new Date().toISOString(),
    status: 'Published'
  },
  {
    _id: 'blog-cloud-trends',
    _type: 'blog',
    title: 'Top 5 Distributed Systems & Cloud Architecture Trends for 2026',
    slug: { _type: 'slug', current: 'cloud-architecture-trends-2026' },
    category: 'Technology',
    excerpt: 'Architectural patterns for multi-cloud deployments, edge computing, and serverless LLMs.',
    content: 'Cloud computing continues to evolve rapidly...',
    publishedAt: new Date().toISOString(),
    status: 'Published'
  },

  // 20. Gallery Items
  {
    _id: 'gallery-campus-1',
    _type: 'gallery',
    title: 'State-of-the-Art AI Research Laboratory',
    category: 'Infrastructure',
    caption: 'Students working on GPU compute clusters at the Tejas AI Innovation Hub.'
  },
  {
    _id: 'gallery-campus-2',
    _type: 'gallery',
    title: 'Executive Learning & Boardroom Suite',
    category: 'Campus',
    caption: 'Case study presentations and executive masterclasses in session.'
  },

  // 21. Student Testimonials
  {
    _id: 'test-1',
    _type: 'testimonial',
    name: 'Vikram Mehta',
    role: 'AI Research Engineer',
    company: 'Microsoft',
    quote: 'Tejas Academy gave me hands-on project experience in deep learning that directly prepared me for high-scale industry engineering.',
    rating: 5
  },
  {
    _id: 'test-2',
    _type: 'testimonial',
    name: 'Neha Gupta',
    role: 'Product Manager',
    company: 'Amazon',
    quote: 'The dual emphasis on technical rigour and executive leadership gave me the confidence to lead cross-functional product teams.',
    rating: 5
  },
  {
    _id: 'test-3',
    _type: 'testimonial',
    name: 'Arjun Reddy',
    role: 'Founder & CEO',
    company: 'TechVenture Labs',
    quote: 'The incubator and venture mentorship at Tejas Academy helped us raise our first round of angel capital within 6 months of graduation.',
    rating: 5
  },

  // 22. FAQ Registry
  {
    _id: 'faq-1',
    _type: 'faq',
    question: 'How does this specific program directly impact my career or professional growth?',
    answer: 'This program focuses on high-impact skill acquisition designed to bridge the gap between theory and industry needs. By completing it, you gain practical expertise that enhances your resume, improves your employability, and prepares you to tackle complex, real-world challenges immediately, giving you a tangible competitive advantage.',
    category: 'General',
    order: 1
  },
  {
    _id: 'faq-2',
    _type: 'faq',
    question: 'Can you provide real-world examples of how I will apply what I learn?',
    answer: 'Yes. Throughout the program, you will work on capstone projects and case studies based on actual industry scenarios. You will apply tools and methodologies to solve genuine business problems, ensuring you graduate with a portfolio of work that demonstrates your ability to apply knowledge effectively.',
    category: 'General',
    order: 2
  },
  {
    _id: 'faq-3',
    _type: 'faq',
    question: 'What kind of mentorship or doubt-clearing support is available during the program?',
    answer: 'We provide robust support to ensure you are never stuck. You will have access to dedicated mentors for one-on-one guidance, regular Q&A sessions to clear your doubts, and community forums where you can interact with peers and industry experts for collaborative learning.',
    category: 'General',
    order: 3
  },
  {
    _id: 'faq-4',
    _type: 'faq',
    question: 'How flexible are the delivery schedules for someone juggling work or studies?',
    answer: 'Our program is designed with flexibility in mind to accommodate professionals and students. We offer a hybrid learning model with recorded sessions and scheduled live check-ins, allowing you to pace your learning around your existing commitments without compromising on the quality of your education.',
    category: 'General',
    order: 4
  },
  {
    _id: 'faq-5',
    _type: 'faq',
    question: 'What are the specific career outcomes or benefits associated with this certification?',
    answer: 'Beyond gaining a verified certification, you will walk away with a refined skill set that is directly applicable to current market demands. Many of our alumni report improved job performance, clearer career trajectories, and increased confidence in applying for advanced roles within their fields.',
    category: 'General',
    order: 5
  },
  {
    _id: 'faq-6',
    _type: 'faq',
    question: 'What differentiates TEJAS Academy’s teaching methodology from other conventional platforms?',
    answer: 'Unlike platforms that focus solely on passive learning, TEJAS Academy utilizes a "knowledge-to-application" methodology. We prioritize hands-on practice, iterative feedback, and real-world project work, ensuring you don\'t just "know" the subject matter, but can actively implement it to drive results.',
    category: 'General',
    order: 6
  },
  {
    _id: 'faq-7',
    _type: 'faq',
    question: 'Can this program be customized to meet my institution’s or my specific learning objectives?',
    answer: 'Absolutely. For corporate and institutional partners, we offer modular program designs that can be tailored to focus on your specific organizational goals, skill gaps, or learning objectives, ensuring maximum ROI on your investment.',
    category: 'General',
    order: 7
  },
  {
    _id: 'faq-8',
    _type: 'faq',
    question: 'What is the realistic time commitment required per week, including practice and projects?',
    answer: 'On average, we recommend dedicating approximately 5–8 hours per week. This includes watching video modules, attending live sessions, and working on your practical assignments, allowing you to maintain steady progress without being overwhelmed.',
    category: 'General',
    order: 8
  },
  {
    _id: 'faq-9',
    _type: 'faq',
    question: 'Are there any free workshops or trial modules I can experience before enrolling?',
    answer: 'Yes, we invite you to experience our approach firsthand. We regularly host free introductory workshops and offer trial modules for many of our courses so you can assess the teaching quality and curriculum relevance before making a commitment.',
    category: 'General',
    order: 9
  },
  {
    _id: 'faq-10',
    _type: 'faq',
    question: 'What is the enrollment process, and what immediate support can I expect after payment?',
    answer: 'The enrollment process is straightforward: simply visit our website, select your program, and complete the registration. Once payment is confirmed, you will receive immediate access to our onboarding portal, a welcome orientation session, and an invitation to join your specific cohort’s support group to get you started on the right foot.',
    category: 'General',
    order: 10
  },

  // 23. Workshops
  {
    _id: 'workshop-1',
    _type: 'workshop',
    title: 'Executive Prompt Engineering Bootcamp',
    slug: { _type: 'slug', current: 'executive-prompt-engineering' },
    date: '2026-09-01',
    durationHours: 8,
    mode: 'Hybrid',
    mentorName: 'Dr. Rajesh Sharma',
    description: 'Mastering zero-shot, few-shot, and chain-of-thought prompt patterns for productivity.'
  },

  // 24. Popup Modal Item (Disabled)
  {
    _id: 'popup-exit-intent',
    _type: 'popupModal',
    title: '🚀 Secure Your Seat for 2026 Admissions',
    popupType: 'exitIntent',
    isEnabled: false,
    subtitle: 'Limited seats remaining for B.Tech AI & Executive MBA programs.',
    description: 'Download the comprehensive 2026 Prospectus and connect with our academic advisors.',
    primaryCtaText: 'Apply Now',
    primaryCtaLink: '/admissions',
    secondaryCtaText: 'Close',
    displayFrequency: 'once_session'
  }
];

async function seedSanity() {
  console.log(`\n=============================================================`);
  console.log(`🚀 TEJAS ACADEMY SANITY CMS AUTOMATIC SEEDING UTILITY`);
  console.log(`=============================================================`);
  console.log(`📍 Project ID: ${SANITY_PROJECT_ID}`);
  console.log(`📍 Dataset: ${SANITY_DATASET}`);
  console.log(`📍 Documents to Seed: ${SEED_DOCUMENTS.length}`);

  if (!SANITY_API_TOKEN) {
    console.warn(`\n⚠️  WARNING: SANITY_API_TOKEN is not defined in environment variables.`);
    console.warn(`   Unauthenticated write requests will fail unless your dataset write permissions allow it.`);
  }

  const mutations = SEED_DOCUMENTS.map(doc => ({
    createOrReplace: doc
  }));

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (SANITY_API_TOKEN) {
    headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mutations })
    });

    const result = await response.json();

    if (result.results) {
      console.log(`\n=============================================================`);
      console.log(`✅ SANITY CMS SEED SUCCESSFUL!`);
      console.log(`=============================================================`);
      result.results.forEach((res, idx) => {
        const doc = SEED_DOCUMENTS[idx];
        console.log(`   [+] [${res.operation}] ${doc._type} (ID: ${doc._id})`);
      });
      console.log(`\n🎉 All ${SEED_DOCUMENTS.length} document types exist in Sanity Studio!`);
      console.log(`   Open Sanity Studio at http://localhost:3333 or https://cms.unlocktejas.com`);
    } else {
      console.error(`\n❌ Sanity Mutation Failed:`, JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error(`\n❌ Network Error during Sanity Seeding:`, err.message);
  }
}

seedSanity();
