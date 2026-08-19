import 'dotenv/config';
import mongoose from 'mongoose';

export const HOMEPAGE_FAQS = [
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
  }
];

async function syncHomepageFaqs() {
  console.log('================================================================');
  console.log('🔄 SYNCHRONIZING 10 HOMEPAGE FAQS ACROSS DATABASE & CMS');
  console.log('================================================================');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Synchronize ContentEntry `global_faqs`
    const ContentEntry = mongoose.model('ContentEntry', new mongoose.Schema({
      key: { type: String, unique: true, index: true },
      data: mongoose.Schema.Types.Mixed,
      status: { type: String, default: 'PUBLISHED' },
      version: { type: Number, default: 1 }
    }, { timestamps: true }));

    const formattedCategories = [
      {
        name: 'General & Program Architecture',
        faqs: HOMEPAGE_FAQS.map(f => ({ question: f.question, answer: f.answer }))
      }
    ];

    const updatedEntry = await ContentEntry.findOneAndUpdate(
      { key: 'global_faqs' },
      {
        key: 'global_faqs',
        status: 'PUBLISHED',
        data: {
          categories: formattedCategories,
          faqs: HOMEPAGE_FAQS
        },
        version: 2
      },
      { upsert: true, new: true }
    );
    console.log('✅ MongoDB ContentEntry "global_faqs" synchronized with 10 FAQs.');

    // 2. Synchronize FAQ Model Collection
    const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', new mongoose.Schema({
      question: String,
      answer: String,
      category: String,
      order: Number,
      isActive: Boolean
    }));

    await FAQ.deleteMany({});
    console.log('🧹 Purged legacy FAQ records from MongoDB collection.');

    const insertedFaqs = await FAQ.insertMany(HOMEPAGE_FAQS.map(f => ({
      question: f.question,
      answer: f.answer,
      category: 'general',
      order: f.order,
      isActive: true
    })));
    console.log(`✅ Inserted ${insertedFaqs.length} new FAQs into MongoDB FAQ collection.`);

    // 3. Synchronize with Sanity CMS if Token is Present
    const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || '6nl927hv';
    const SANITY_DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
    const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || process.env.VITE_SANITY_API_TOKEN;

    if (SANITY_API_TOKEN) {
      try {
        console.log('📡 Syncing with Sanity CMS dataset:', SANITY_DATASET);
        const mutations = HOMEPAGE_FAQS.map(f => ({
          createOrReplace: {
            _id: f._id,
            _type: 'faq',
            question: f.question,
            answer: f.answer,
            category: f.category,
            order: f.order
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
          console.log('✅ Sanity CMS documents successfully synchronized!');
        } else {
          const errText = await sanityRes.text();
          console.warn('⚠️ Sanity CMS mutation returned:', errText);
        }
      } catch (sanityErr) {
        console.warn('⚠️ Sanity CMS update skipped/failed:', sanityErr.message);
      }
    } else {
      console.log('ℹ️ SANITY_API_TOKEN not set in environment; MongoDB ContentEntry serves as live source.');
    }

    await mongoose.disconnect();
    console.log('================================================================');
    console.log('🎉 10 HOMEPAGE FAQS SYNCHRONIZATION COMPLETE!');
    console.log('================================================================');
    return true;
  } catch (err) {
    console.error('❌ Failed to sync FAQs:', err);
    await mongoose.disconnect();
    throw err;
  }
}

if (process.argv[1] && process.argv[1].includes('sync_homepage_faqs.js')) {
  syncHomepageFaqs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
