import 'dotenv/config';
import mongoose from 'mongoose';
import { ALL_30_FAQS, FAQ_CATEGORIES } from './seed_all_30_faqs.js';

export const OFFICIAL_CMS_DATA = {
  homepage: {
    hero: {
      title: 'Practical Education for Real-World Competence & Leadership',
      subtitle: 'Structured programmes designed to bridge academic knowledge and professional capability with executive faculty and industry projects.',
      backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      videoUrl: '',
      primaryCta: { text: 'Explore Programmes', link: '/programs' },
      secondaryCta: { text: 'Apply for Admission', link: '/admissions' }
    },
    stats: [
      { label: 'Active Programmes', value: '7+' },
      { label: 'Corporate Partners', value: '250+' },
      { label: 'Distinguished Mentors', value: '150+' },
      { label: 'Practical Work Ratio', value: '70%' }
    ],
    missionPreview: {
      title: 'Our Purpose',
      content: 'To empower learners with practical skills, future-ready capabilities, and leadership mindsets through hands-on learning.'
    },
    visionPreview: {
      title: 'Our Vision',
      content: 'To build a global centre of excellence for transformative technology, business innovation, and responsible leadership.'
    },
    partners: [
      { name: 'Google Cloud Partner', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Microsoft Enterprise', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
      { name: 'Amazon Web Services', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
    ],
    footerCta: {
      title: 'Begin Your Learning Journey with Tejas Academy',
      subtitle: 'Enrolment for our upcoming certificate and professional batches is currently active.',
      buttonText: 'Submit Application',
      buttonLink: '/admissions'
    }
  },

  about: {
    hero: {
      title: 'About Tejas Academy of Excellence',
      subtitle: 'Building actionable capabilities, future-ready skills, and visionary leadership.',
      backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'
    },
    overview: 'Tejas Academy of Excellence was founded to bridge the critical gap between academic theory and real-world application. We deliver structured capability-development programmes that help learners think clearly, act responsibly, and build tangible competence.',
    pillars: [
      { title: 'Knowledge to Application', description: 'Transforming theoretical understanding into usable capabilities through hands-on projects.' },
      { title: 'Industry-Aligned Curriculum', description: 'Curricula developed alongside industry specialists and experienced practitioners.' },
      { title: 'Mentorship & Personal Growth', description: 'Individual attention, direct guidance, and actionable feedback.' },
      { title: 'Future-Ready Mindsets', description: 'Fostering adaptability, critical thinking, and responsible innovation.' }
    ],
    timeline: [
      { year: '2020', title: 'Foundation & Academic Charter', description: 'Established with our inaugural cohort in business and modern technology.' },
      { year: '2022', title: 'Capability Labs Expansion', description: 'Inaugurated dedicated research laboratories in Artificial Intelligence and applied business strategy.' },
      { year: '2024', title: 'Institutional Collaborations', description: 'Forged training and certification partnerships with universities and enterprises.' },
      { year: '2026', title: 'Advanced Learning Ecosystem', description: 'Expanded executive cohort tracks, hybrid delivery, and live enterprise case studies.' }
    ]
  },

  campus: {
    title: 'Modern Learning Facilities & Campus',
    description: 'A collaborative, technologically equipped environment designed for practical work, teamwork, and deep focus.',
    facilities: [
      { 
        title: 'Central Academic Library', 
        description: 'Extensive repository of digital research journals, case studies, reference texts, and quiet study pods.',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop'
      },
      { 
        title: 'Artificial Intelligence & Computing Labs', 
        description: 'High-performance computing infrastructure for machine learning simulations, programming, and data engineering.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop'
      },
      { 
        title: 'Collaborative Seminar Halls', 
        description: 'Acoustically designed amphitheatres equipped with hybrid video conferencing for masterclasses and guest lectures.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop'
      },
      { 
        title: 'Innovation & Incubation Hub', 
        description: 'Ideation spaces for entrepreneurial teams, venture prototyping, and mentor interactions.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop'
      }
    ]
  },

  site_settings: {
    siteName: 'Tejas Academy of Excellence',
    tagline: 'Practical Education for Real-World Competence & Leadership',
    supportEmail: 'support@unlocktejas.com',
    admissionsEmail: 'support@unlocktejas.com',
    contactEmail: 'support@unlocktejas.com',
    helplinePhone: '+91 83310 51327',
    contactPhone: '+91 83310 51327',
    whatsappNumber: '918331051327',
    campusAddress: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    googleMapsEmbedUrl: '',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/unlocktejas',
      twitter: 'https://twitter.com/unlocktejas',
      instagram: 'https://instagram.com/unlocktejas',
      youtube: 'https://youtube.com/@unlocktejas'
    }
  },

  navigation: {
    mainNav: [
      { title: 'Home', href: '/' },
      { 
        title: 'About', 
        href: '/about',
        children: [
          { title: 'About Us', href: '/about' },
          { title: 'Vision & Mission', href: '/about/vision-mission' },
          { title: 'Campus Facilities', href: '/about/campus' },
          { title: 'Recognitions', href: '/recognitions' }
        ]
      },
      { 
        title: 'Programs', 
        href: '/programs',
        children: [
          { title: 'All Programmes', href: '/programs' },
          { title: 'Free Programmes', href: '/free-programs' },
          { title: 'For Institutions', href: '/for-institutions' }
        ]
      },
      { title: 'Admissions', href: '/admissions' },
      { title: 'Events', href: '/events' },
      { title: 'Insights', href: '/insights' },
      { title: 'Contact', href: '/contact' }
    ],
    headerCta: {
      text: 'Apply Now',
      href: '/admissions'
    }
  },

  global_notifications: {
    isEnabled: true,
    message: 'Admissions open for upcoming Certificate & Professional Cohorts. Limited seats available.',
    link: '/admissions',
    linkText: 'Apply Online',
    type: 'announcement'
  },

  global_quick_connect: {
    isEnabled: true,
    whatsappNumber: '918331051327',
    welcomeMessage: 'Hello! How can we assist you with Tejas Academy programmes today?',
    defaultProgramInquiry: 'Post Graduate Program in Management'
  },

  global_social_proof: {
    isEnabled: true,
    displayIntervalSeconds: 15,
    items: [
      { name: 'Aditya K.', program: 'Post Graduate Program in Management', timeAgo: '2 hours ago' },
      { name: 'Priya S.', program: 'Certificate in Financial Management', timeAgo: '4 hours ago' },
      { name: 'Rahul V.', program: 'Executive AI & Strategy Masterclass', timeAgo: 'Yesterday' }
    ]
  },

  global_exit_intent: {
    isEnabled: true,
    title: 'Download Our Official Academic Brochure',
    subtitle: 'Sign in to access detailed curriculum outlines, faculty profiles, and schedule options.',
    ctaText: 'Sign In to Download',
    ctaLink: '/login?returnUrl=/programs'
  },

  seo_config: {
    defaultTitle: 'Tejas Academy of Excellence',
    titleTemplate: '%s | Tejas Academy of Excellence',
    defaultDescription: 'Tejas Academy of Excellence is a premier capability-development institution offering industry-aligned certificate, executive, and professional programmes.',
    canonicalBase: 'https://unlocktejas.com',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@unlocktejas'
  },

  careers: {
    title: 'Careers & Faculty Openings',
    description: 'Join an inspiring community of educators, industry practitioners, and researchers shaping the next generation of leadership.',
    openings: [
      {
        title: 'Visiting Faculty — AI & Modern Technology',
        department: 'Computer Science & AI',
        location: 'Hybrid / Gannavaram Campus',
        type: 'Part-time / Visiting',
        description: 'Lead interactive weekend cohort sessions on applied machine learning, neural architectures, and software engineering.'
      },
      {
        title: 'Programme Mentor — Business Strategy & Venture Leadership',
        department: 'Management Studies',
        location: 'Hybrid',
        type: 'Cohort Mentor',
        description: 'Provide 1-on-1 mentorship, evaluate capstone projects, and guide aspiring entrepreneurs.'
      }
    ]
  },

  legal: {
    privacyPolicy: 'Tejas Academy of Excellence respects your privacy and is committed to protecting all personal information provided during registration or admissions.',
    termsOfService: 'Participation in Tejas Academy programmes is governed by our academic code of conduct and institutional regulations.',
    lastUpdated: 'August 2026'
  },

  'for-institutions': {
    title: 'Institutional Partnerships & Capacity Building',
    subtitle: 'Collaborate with Tejas Academy of Excellence on Faculty Development Programmes (FDP), applied research incubation, and student human excellence initiatives.',
    services: [
      {
        id: 'inst-1',
        title: 'Faculty Development Programs (FDP)',
        category: 'Faculty Upskilling',
        description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
        keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery']
      },
      {
        id: 'inst-2',
        title: 'Institutional Career Development & Skill Bootcamps',
        category: 'Student Competence',
        description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and professional skills.',
        keyBenefits: ['Mock Technical Interviews', 'Career Readiness Assessment Engine', 'Direct Corporate Alliances']
      },
      {
        id: 'inst-3',
        title: 'Academic MoUs & Innovation Lab Setup',
        category: 'Campus Infrastructure',
        description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
        keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs']
      }
    ],
    contactBanner: {
      title: 'Partner Your University with Tejas Academy',
      description: 'Schedule a consultation with our Institutional Partnerships Director today.',
      buttonText: 'Contact Partnerships Desk',
      buttonLink: '/contact'
    }
  },

  recognitions: {
    title: 'Institutional Accreditations & Recognitions',
    subtitle: 'Demonstrating pedagogical integrity, academic excellence, and national industry alignment.',
    items: [
      {
        id: 'rec-1',
        title: 'Excellence in AI Curriculum & Pedagogy',
        issuingBody: 'National EdTech Council',
        year: '2025',
        description: 'Honored for pioneering hands-on GPU labs and industry-integrated artificial intelligence syllabi.'
      },
      {
        id: 'rec-2',
        title: 'Top 10 Higher Education Centers in Telangana',
        issuingBody: 'Higher Education Review India',
        year: '2025',
        description: 'Awarded for exceptional graduate career readiness and modern campus infrastructure.'
      },
      {
        id: 'rec-3',
        title: 'National Skill Development Charter',
        issuingBody: 'NSDC Certified Training Partner',
        year: '2024',
        description: 'Certified institutional training partner advancing youth digital skilling and technical competence.'
      }
    ]
  },

  free_programs: {
    title: 'Free Knowledge & Open Masterclasses',
    subtitle: 'Access high-impact introductory courses, foundational workshops, and executive webinars open to all aspiring leaders.',
    programs: [
      {
        id: 'free-1',
        title: 'Generative AI & Prompt Engineering Masterclass',
        category: 'Artificial Intelligence',
        duration: '2 Hours Live',
        shortDescription: 'Hands-on introduction to Large Language Models, prompt crafting, and building practical AI workflow prototypes.',
        modulesCount: 4,
        enrollLink: '/contact'
      },
      {
        id: 'free-2',
        title: 'Foundations of Ethical Technology & Systems',
        category: 'Philosophy & Tech',
        duration: 'Self-Paced',
        shortDescription: 'Explore algorithmic governance, data privacy, and ethical frameworks defining tomorrow’s engineering leadership.',
        modulesCount: 6,
        enrollLink: '/contact'
      },
      {
        id: 'free-3',
        title: 'Executive Financial Literacy & Wealth Architecture',
        category: 'Finance',
        duration: '3 Hours Workshop',
        shortDescription: 'Master modern asset allocation, capital markets, and strategic personal financial planning.',
        modulesCount: 5,
        enrollLink: '/contact'
      }
    ]
  },

  'vision-mission': {
    title: 'Vision, Mission & Academic Philosophy',
    subtitle: 'Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.',
    vision: 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the world.',
    mission: 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, ethical technology, and principled leadership development that creates enduring societal value.',
    philosophy: 'Knowledge → Practice → Feedback → Iteration → Mastery. Education at Tejas Academy transcends information transfer to cultivate holistic human capability, character, and lifelong leadership.',
    virtues: [
      { name: 'Integrity', description: 'Unyielding adherence to moral courage, ethical honesty, and accountability in thought, word, and deed.' },
      { name: 'Discipline', description: 'Systematic habits, focused diligence, and consistent daily execution essential for compounding capability.' },
      { name: 'Courage', description: 'The boldness to question dogma, embrace intellectual challenges, take calculated risks, and pioneer positive change.' },
      { name: 'Curiosity', description: 'Inquisitive pursuit of deep knowledge, lifelong learning, and innovative multidisciplinary exploration.' },
      { name: 'Service', description: 'Commitment to servant leadership, community upliftment, and creating enduring value for society and the nation.' },
      { name: 'Excellence', description: 'Relentless striving for the highest standards in character, craft, intellect, and professional mastery.' }
    ]
  },

  resources: {
    title: 'Student & Academic Resources',
    subtitle: 'Explore downloadable guides, research whitepapers, brochures, and foundational curriculum overviews.',
    items: [
      {
        id: 'res-1',
        title: 'Official Academic Prospectus 2026',
        category: 'Brochure',
        format: 'PDF (3.2 MB)',
        description: 'Complete institutional handbook detailing pedagogy, faculties, labs, and degree curricula.',
        downloadUrl: '/brochure.pdf'
      },
      {
        id: 'res-2',
        title: 'The Tejas Imperative of Human Excellence',
        category: 'Whitepaper',
        format: 'PDF (1.8 MB)',
        description: 'Comprehensive research paper outlining our 5-dimensional framework for character and competence.',
        downloadUrl: '/brochure.pdf'
      },
      {
        id: 'res-3',
        title: 'Foundations of Applied Artificial Intelligence',
        category: 'Curriculum Guide',
        format: 'PDF (2.4 MB)',
        description: 'Syllabus and prerequisite roadmap for undergraduate and professional deeptech certifications.',
        downloadUrl: '/brochure.pdf'
      }
    ]
  },

  contact: {
    heroTitle: 'Get in Touch with Our Academic Admissions Desk',
    heroSubtitle: 'Have questions about admissions, campus life, scholarships, or institutional partnerships? Our counselors are here to help.',
    phone: '+91 83310 51327',
    email: 'support@unlocktejas.com',
    address: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    officeHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed'
  }
};

async function syncAllCmsData() {
  console.log('================================================================');
  console.log('🔄 SYNCHRONIZING COMPLETE WEBSITE CMS & REAL-TIME DATA (MONGODB)');
  console.log('================================================================');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas Cluster');

    const ContentEntry = mongoose.models.ContentEntry || mongoose.model('ContentEntry', new mongoose.Schema({
      key: { type: String, unique: true, index: true },
      title: String,
      type: { type: String, default: 'PAGE' },
      status: { type: String, default: 'PUBLISHED' },
      data: mongoose.Schema.Types.Mixed,
      publishedData: mongoose.Schema.Types.Mixed,
      publishedVersionNumber: { type: Number, default: 1 },
      currentVersionNumber: { type: Number, default: 1 },
      versions: Array
    }, { timestamps: true }));

    // 1. Sync all defined CMS keys
    for (const [key, data] of Object.entries(OFFICIAL_CMS_DATA)) {
      const title = `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Settings`;
      
      const existing = await ContentEntry.findOne({ key });
      const versionNumber = existing ? (existing.publishedVersionNumber || 1) + 1 : 1;

      await ContentEntry.findOneAndUpdate(
        { key },
        {
          key,
          title,
          status: 'PUBLISHED',
          data,
          publishedData: data,
          publishedVersionNumber: versionNumber,
          currentVersionNumber: versionNumber,
          $push: {
            versions: {
              versionNumber,
              data,
              commitMessage: 'Real-time synchronization with production blueprint',
              publishedAt: new Date()
            }
          }
        },
        { upsert: true, new: true }
      );
      console.log(`  ✅ Synced CMS Key: "${key}" (Status: PUBLISHED, Version: v${versionNumber})`);
    }

    // 2. Sync Support FAQs key `global_faqs`
    const groupedCategories = FAQ_CATEGORIES.map(catName => {
      const catFaqs = ALL_30_FAQS.filter(f => f.category === catName);
      return {
        name: catName,
        faqs: catFaqs.map(f => ({
          question: f.question,
          answer: f.answer,
          order: f.order
        }))
      };
    });

    await ContentEntry.findOneAndUpdate(
      { key: 'global_faqs' },
      {
        key: 'global_faqs',
        title: 'Global FAQs (30 Questions / 10 Categories)',
        status: 'PUBLISHED',
        data: {
          categories: groupedCategories,
          faqs: ALL_30_FAQS
        },
        publishedData: {
          categories: groupedCategories,
          faqs: ALL_30_FAQS
        },
        publishedVersionNumber: 3,
        currentVersionNumber: 3
      },
      { upsert: true, new: true }
    );
    console.log('  ✅ Synced CMS Key: "global_faqs" (30 Questions across 10 Categories)');

    await mongoose.disconnect();
    console.log('================================================================');
    console.log('🎉 ALL WEBSITE CMS MODULES & PAGES ARE 100% IN SYNC IN REAL-TIME!');
    console.log('================================================================');
    return true;
  } catch (err) {
    console.error('❌ Failed to synchronize CMS data:', err);
    await mongoose.disconnect();
    throw err;
  }
}

syncAllCmsData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

