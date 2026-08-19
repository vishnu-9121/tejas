import 'dotenv/config';
import mongoose from 'mongoose';

export const FAQ_CATEGORIES = [
  'General Information',
  'Learning Format & Experience',
  'Enrolment & Registration',
  'Certification & Assessment',
  'Career & Professional Development',
  'Institutional & Corporate Programs',
  'Workshops & Program Types',
  'Fees & Policies',
  'Technical & Access',
  'Support & Contact'
];

export const ALL_30_FAQS = [
  // 1. GENERAL INFORMATION (Q1 - Q4)
  {
    _id: 'faq-1',
    _type: 'faq',
    question: 'What is Tejas Academy of Excellence?',
    answer: 'Tejas Academy of Excellence is a learning and capability-development platform focused on building practical skills, professional competence, leadership capabilities, and future-ready mindsets. Our programmes are designed to bridge the gap between academic knowledge and real-world application.',
    category: 'General Information',
    order: 1
  },
  {
    _id: 'faq-2',
    _type: 'faq',
    question: 'What kind of programmes does Tejas Academy offer?',
    answer: 'We offer a diverse range of learning experiences, including:\n• Certificate programmes\n• Professional skill-development programmes\n• Live online courses\n• Workshops and masterclasses\n• Leadership and management programmes\n• Career and employability programmes\n• Business and entrepreneurship programmes\n• Financial literacy and wealth-creation programmes\n• Digital and AI-focused programmes\n• Corporate training\n• College and institutional programmes\n\nOur programme portfolio evolves based on emerging industry, career, and societal needs, offering flexible 45-day, 90-day, 180-day, and 1-year duration options for selected tracks.',
    category: 'General Information',
    order: 2
  },
  {
    _id: 'faq-3',
    _type: 'faq',
    question: 'Who can join Tejas Academy programmes?',
    answer: 'Our programmes are designed for different learner groups, including:\n• College students\n• Graduates\n• Working professionals\n• Entrepreneurs\n• Aspiring managers and leaders\n• Career switchers\n• Educators and trainers\n• Young professionals\n• Individuals seeking personal and professional development\n\nEligibility varies depending on the specific programme.',
    category: 'General Information',
    order: 3
  },
  {
    _id: 'faq-4',
    _type: 'faq',
    question: 'Do I need prior experience to join?',
    answer: 'Not necessarily. Several of our foundational programmes are specifically designed for beginners.\n\nEach programme clearly specifies its eligibility requirements, prerequisites, and expected level of knowledge before enrolment.',
    category: 'General Information',
    order: 4
  },

  // 2. LEARNING FORMAT & EXPERIENCE (Q5 - Q10)
  {
    _id: 'faq-5',
    _type: 'faq',
    question: 'Are Tejas Academy programmes online or offline?',
    answer: 'We offer both online and offline learning formats, depending on the programme.\n\nOur online programmes may include live interactive classes, recorded learning resources, assignments, activities, discussions, assessments, and mentoring.\n\nOffline programmes may include classroom sessions, workshops, experiential activities, institutional programmes, and practical projects.',
    category: 'Learning Format & Experience',
    order: 5
  },
  {
    _id: 'faq-6',
    _type: 'faq',
    question: 'Are the classes live or pre-recorded?',
    answer: 'This depends on the programme.\n\nOur live programmes are designed to encourage interaction, discussion, practical activities, doubt clarification, and application of concepts. Some programmes may also include recorded resources that participants can access for revision.\n\nThe exact learning format is mentioned on each programme page.',
    category: 'Learning Format & Experience',
    order: 6
  },
  {
    _id: 'faq-7',
    _type: 'faq',
    question: 'Do the programmes include practical activities?',
    answer: 'Yes. Wherever appropriate, our programmes incorporate practical learning through:\n• Case studies\n• Activities\n• Capstone projects\n• Simulations\n• Exercises\n• Assignments\n• Group discussions\n• Problem-solving tasks\n• Real-world scenarios\n\nOur objective is not simply to provide information but to help learners convert knowledge into usable capability.',
    category: 'Learning Format & Experience',
    order: 7
  },
  {
    _id: 'faq-8',
    _type: 'faq',
    question: 'Will I get mentorship or doubt-clearing support?',
    answer: 'Support varies by programme.\n\nSelected programmes may include live doubt-clearing, dedicated one-on-one mentoring sessions, faculty interaction, personalized feedback, or structured learner community support.\n\nThe exact support available will be communicated before enrolment.',
    category: 'Learning Format & Experience',
    order: 8
  },
  {
    _id: 'faq-9',
    _type: 'faq',
    question: 'What if I miss a live session?',
    answer: 'This depends on the programme.\n\nWhere recordings are provided, participants may be able to access the missed session for revision. However, certain activities, assessments, workshops, or interactive sessions may require live participation.\n\nPlease check the attendance and recording policy of the specific programme.',
    category: 'Learning Format & Experience',
    order: 9
  },
  {
    _id: 'faq-10',
    _type: 'faq',
    question: 'How much time should I dedicate to a programme?',
    answer: 'The required time depends on the programme\'s duration, number of sessions, activities, and assignments (typically averaging approximately 5–8 hours per week for standard certificate modules).\n\nWe recommend that participants consider not only class hours but also the time required for practice, assignments, reflection, and project work.',
    category: 'Learning Format & Experience',
    order: 10
  },

  // 3. ENROLMENT & REGISTRATION (Q11 - Q14)
  {
    _id: 'faq-11',
    _type: 'faq',
    question: 'How do I enrol in a programme?',
    answer: 'You can explore the programmes available on our website, review the eligibility, curriculum, duration, fees, and learning format, and then proceed through the registration/enquiry process provided for that programme.\n\nFor programmes requiring selection or screening, participants may need to complete an application process.',
    category: 'Enrolment & Registration',
    order: 11
  },
  {
    _id: 'faq-12',
    _type: 'faq',
    question: 'What happens after I register?',
    answer: 'After registration, you will receive the relevant programme information, which may include:\n• Confirmation of registration\n• Programme schedule\n• Joining instructions and portal onboarding\n• Learning resources\n• Communication-channel details and cohort groups\n• Orientation information\n• Requirements for participation\n\nProgramme-specific instructions will be shared before commencement.',
    category: 'Enrolment & Registration',
    order: 12
  },
  {
    _id: 'faq-13',
    _type: 'faq',
    question: 'Can I enroll in multiple programmes?',
    answer: 'Yes, provided you meet the eligibility requirements and can manage the schedules and workload of the programmes.',
    category: 'Enrolment & Registration',
    order: 13
  },
  {
    _id: 'faq-14',
    _type: 'faq',
    question: 'What if I am unsure which programme is right for me?',
    answer: 'You can contact our team with information about your current stage, interests, career objectives, and learning goals.\n\nWe can help you identify the programme that best matches your needs.',
    category: 'Enrolment & Registration',
    order: 14
  },

  // 4. CERTIFICATION & ASSESSMENT (Q15 - Q17)
  {
    _id: 'faq-15',
    _type: 'faq',
    question: 'Will I receive a certificate?',
    answer: 'Certificate availability depends on the programme.\n\nWhere applicable, participants who satisfy the programme\'s attendance, assessment, assignment, or completion requirements will receive a verified certificate from Tejas Academy of Excellence.\n\nSpecific certification details are provided on the respective programme page.',
    category: 'Certification & Assessment',
    order: 15
  },
  {
    _id: 'faq-16',
    _type: 'faq',
    question: 'Is the certificate recognised?',
    answer: 'Our certificates are intended to document participation and successful completion of the relevant Tejas Academy programme.\n\nThe professional value of a certificate depends on the programme, learning outcomes, assessment process, and the participant\'s ability to demonstrate the skills acquired.\n\nWe encourage learners to view certification as a complement to actual capability, projects, experience, and demonstrated competence.',
    category: 'Certification & Assessment',
    order: 16
  },
  {
    _id: 'faq-17',
    _type: 'faq',
    question: 'Are there assignments or assessments?',
    answer: 'Some programmes include assignments, projects, quizzes, assessments, presentations, or other evaluation methods.\n\nAssessment requirements vary according to the learning objectives of each programme.',
    category: 'Certification & Assessment',
    order: 17
  },

  // 5. CAREER & PROFESSIONAL DEVELOPMENT (Q18 - Q20)
  {
    _id: 'faq-18',
    _type: 'faq',
    question: 'Are Tejas Academy programmes useful for career development?',
    answer: 'Yes. Our programmes are designed with practical application and career relevance in mind.\n\nDepending on the programme, participants may develop skills related to communication, public speaking, leadership, business strategy, financial discipline, digital technologies, AI adoption, time management, analytical thinking, entrepreneurship, management, or employability.',
    category: 'Career & Professional Development',
    order: 18
  },
  {
    _id: 'faq-19',
    _type: 'faq',
    question: 'Can working professionals join Tejas Academy programmes?',
    answer: 'Yes. Many programmes are designed to accommodate students and working professionals.\n\nProgramme schedules and delivery formats vary, so participants should review the specific programme schedule before enrolling.',
    category: 'Career & Professional Development',
    order: 19
  },
  {
    _id: 'faq-20',
    _type: 'faq',
    question: 'How is Tejas Academy different from conventional learning platforms?',
    answer: 'Tejas Academy focuses on connecting knowledge with application through a dedicated "knowledge-to-application" methodology.\n\nOur approach aims to combine structured learning with practical activities, real-world scenarios, critical thinking, reflection, and capability development.\n\nThe objective is not merely to complete a course, but to help learners become more capable, confident, and professionally relevant.',
    category: 'Career & Professional Development',
    order: 20
  },

  // 6. INSTITUTIONAL & CORPORATE PROGRAMS (Q21 - Q23)
  {
    _id: 'faq-21',
    _type: 'faq',
    question: 'Can colleges collaborate with Tejas Academy?',
    answer: 'Yes.\n\nTejas Academy can collaborate with educational institutions through initiatives such as:\n• Student development programmes\n• Faculty development programmes\n• Workshops and masterclasses\n• Certification programmes\n• Career-readiness initiatives\n• Entrepreneurship programmes\n• Industry-oriented training\n• Institutional skill-development programmes\n• Seminars and conferences\n\nInstitutions can contact us to discuss a customised collaboration.',
    category: 'Institutional & Corporate Programs',
    order: 21
  },
  {
    _id: 'faq-22',
    _type: 'faq',
    question: 'Does Tejas Academy work with companies and organisations?',
    answer: 'Yes. We can design learning and capability-building interventions for organisations based on their requirements.\n\nPotential areas include leadership, communication, workplace effectiveness, AI adoption, management skills, business skills, employee development, and other professional capabilities.',
    category: 'Institutional & Corporate Programs',
    order: 22
  },
  {
    _id: 'faq-23',
    _type: 'faq',
    question: 'Can a programme be customised for our institution or organisation?',
    answer: 'Yes.\n\nCustomised programmes can be developed based on factors such as:\n• Target audience\n• Learning objectives\n• Duration\n• Skill requirements\n• Industry context\n• Delivery format\n• Assessment requirements\n• Expected outcomes\n\nOrganisations and institutions can contact our team to discuss their requirements.',
    category: 'Institutional & Corporate Programs',
    order: 23
  },

  // 7. WORKSHOPS & PROGRAM TYPES (Q24 - Q25)
  {
    _id: 'faq-24',
    _type: 'faq',
    question: 'Are there free programmes or workshops?',
    answer: 'From time to time, Tejas Academy may offer introductory workshops, orientation sessions, trial modules, community initiatives, or selected learning experiences at no cost.\n\nAvailability depends on the programme and current initiatives.',
    category: 'Workshops & Program Types',
    order: 24
  },
  {
    _id: 'faq-25',
    _type: 'faq',
    question: 'What is the difference between a workshop, course, and certificate programme?',
    answer: 'A workshop is generally shorter and focused on introducing or developing a specific skill or topic.\n\nA course provides more structured learning over a defined period and may include multiple sessions, activities, and assessments.\n\nA certificate programme generally follows a structured curriculum and may include defined completion or assessment requirements leading to certification.\n\nThe exact structure varies by programme.',
    category: 'Workshops & Program Types',
    order: 25
  },

  // 8. FEES & POLICIES (Q26 - Q27)
  {
    _id: 'faq-26',
    _type: 'faq',
    question: 'How are programme fees determined?',
    answer: 'Fees depend on factors such as programme duration, depth of curriculum, delivery format, faculty involvement, mentoring, assessments, learning resources, and certification.\n\nThe applicable fee will be displayed or communicated transparently for each programme.',
    category: 'Fees & Policies',
    order: 26
  },
  {
    _id: 'faq-27',
    _type: 'faq',
    question: 'Is there a refund or cancellation policy?',
    answer: 'Each programme may have its own cancellation, transfer, and refund terms.\n\nParticipants should review the applicable terms and conditions before making payment.',
    category: 'Fees & Policies',
    order: 27
  },

  // 9. TECHNICAL & ACCESS (Q28)
  {
    _id: 'faq-28',
    _type: 'faq',
    question: 'Do I need to purchase any special software or equipment?',
    answer: 'Most programmes require only basic access to a suitable device (such as a laptop, desktop, or tablet) and a reliable internet connection.\n\nIf a programme requires specific software, tools, books, or other resources, those requirements will be communicated before or during enrolment.',
    category: 'Technical & Access',
    order: 28
  },

  // 10. SUPPORT & CONTACT (Q29 - Q30)
  {
    _id: 'faq-29',
    _type: 'faq',
    question: 'How can I contact Tejas Academy?',
    answer: 'You can contact our team through the enquiry/contact channels provided on our website, email support@unlocktejas.com, or reach out via official calling/WhatsApp helpline at +91 83310 51327.\n\nFor programme-specific enquiries, please mention the programme name so that our team can assist you efficiently.',
    category: 'Support & Contact',
    order: 29
  },
  {
    _id: 'faq-30',
    _type: 'faq',
    question: 'What is the philosophy behind Tejas Academy of Excellence?',
    answer: 'We believe meaningful education should go beyond information.\n\nOur focus is on developing individuals who can think clearly, act responsibly, solve real problems, adapt to change, and create meaningful value.\n\nTejas Academy aims to build a culture of continuous learning, practical excellence, leadership, and responsible growth.',
    category: 'Support & Contact',
    order: 30
  }
];

async function seedAll30Faqs() {
  console.log('================================================================');
  console.log('🔄 SEEDING COMPLETE 30-QUESTION SUPPORT FAQ DATABASE (10 CATEGORIES)');
  console.log('================================================================');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Group FAQs by category for ContentEntry `global_faqs`
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

    const ContentEntry = mongoose.models.ContentEntry || mongoose.model('ContentEntry', new mongoose.Schema({
      key: { type: String, unique: true, index: true },
      data: mongoose.Schema.Types.Mixed,
      status: { type: String, default: 'PUBLISHED' },
      version: { type: Number, default: 1 }
    }, { timestamps: true }));

    await ContentEntry.findOneAndUpdate(
      { key: 'global_faqs' },
      {
        key: 'global_faqs',
        status: 'PUBLISHED',
        data: {
          categories: groupedCategories,
          faqs: ALL_30_FAQS
        },
        version: 3
      },
      { upsert: true, new: true }
    );
    console.log('✅ MongoDB ContentEntry "global_faqs" updated with 10 categories and 30 FAQs.');

    // 2. Synchronize FAQ Model Collection
    const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', new mongoose.Schema({
      question: String,
      answer: String,
      category: String,
      order: Number,
      isActive: Boolean
    }));

    await FAQ.deleteMany({});
    console.log('🧹 Cleared existing FAQ collection.');

    const insertedFaqs = await FAQ.insertMany(ALL_30_FAQS.map(f => ({
      question: f.question,
      answer: f.answer,
      category: f.category,
      order: f.order,
      isActive: true
    })));
    console.log(`✅ Inserted ${insertedFaqs.length} FAQs across 10 categories into MongoDB FAQ collection.`);

    // 3. Synchronize with Sanity CMS if Token is present
    const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || '6nl927hv';
    const SANITY_DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
    const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || process.env.VITE_SANITY_API_TOKEN;

    if (SANITY_API_TOKEN) {
      try {
        console.log('📡 Syncing 30 FAQs with Sanity CMS dataset:', SANITY_DATASET);
        const mutations = ALL_30_FAQS.map(f => ({
          createOrReplace: {
            _id: f._id,
            _type: 'faq',
            question: f.question,
            answer: f.answer,
            category: f.category,
            order: f.order,
            isActive: true
          }
        }));

        const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/mutate/${SANITY_DATASET}`;
        const sanityRes = await fetch(sanityUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SANITY_API_TOKEN}`
          },
          body: JSON.stringify({ mutations })
        });

        if (sanityRes.ok) {
          console.log('✅ All 30 Sanity CMS FAQ documents successfully synchronized!');
        } else {
          const errText = await sanityRes.text();
          console.warn('⚠️ Sanity CMS mutation returned:', errText);
        }
      } catch (sanityErr) {
        console.warn('⚠️ Sanity CMS update skipped/failed:', sanityErr.message);
      }
    } else {
      console.log('ℹ️ SANITY_API_TOKEN not present in environment; MongoDB ContentEntry serves as active source.');
    }

    await mongoose.disconnect();
    console.log('================================================================');
    console.log('🎉 30-QUESTION SUPPORT FAQ SEEDING COMPLETE!');
    console.log('================================================================');
    return true;
  } catch (err) {
    console.error('❌ Failed to seed 30 FAQs:', err);
    await mongoose.disconnect();
    throw err;
  }
}

if (process.argv[1] && process.argv[1].includes('seed_all_30_faqs.js')) {
  seedAll30Faqs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
