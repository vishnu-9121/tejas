import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { Event } from '../models/Event.js';
import Blog from '../models/Blog.js';

let mongod = null;

// Mock Programs
const mockPrograms = [
  {
    title: 'B.Tech in Artificial Intelligence & Data Science',
    slug: 'btech-in-artificial-intelligence-and-data-science',
    category: 'Undergraduate',
    description: 'A cutting-edge 4-year engineering program covering Machine Learning, Neural Networks, Cloud AI, and Ethical AI Systems.',
    duration: '4 Years',
    fees: 1200000,
    eligibility: '10+2 with Physics, Mathematics, and Chemistry with minimum 60%.',
    intake: 120,
    curriculum: [
      { semester: 'Semester 1', courses: ['Applied Mathematics', 'Python Programming', 'Digital Electronics'] },
      { semester: 'Semester 2', courses: ['Data Structures & Algorithms', 'Discrete Mathematics', 'Machine Learning Foundations'] },
    ],
  },
  {
    title: 'Post Graduate Program in Management',
    slug: 'post-graduate-program-in-management',
    category: 'Postgraduate',
    description: 'A transformative 2-year program designed to build future global leaders with strong ethical foundations.',
    duration: '2 Years',
    fees: 1500000,
    eligibility: 'Bachelor’s degree with minimum 50% aggregate.',
    intake: 120,
    curriculum: [
      { semester: 'Semester 1', courses: ['Managerial Economics', 'Financial Accounting'] },
      { semester: 'Semester 2', courses: ['Marketing Management', 'Operations Management'] },
    ],
  },
  {
    title: 'BBA in Human Excellence',
    slug: 'bba-in-human-excellence',
    category: 'Undergraduate',
    description: 'A unique undergraduate program focusing on holistic development, character building, and modern business practices.',
    duration: '3 Years',
    fees: 800000,
    eligibility: '10+2 from a recognized board with minimum 60%.',
    intake: 60,
    curriculum: [
      { semester: 'Semester 1', courses: ['Principles of Management', 'Business Communication'] },
      { semester: 'Semester 2', courses: ['Organizational Behavior', 'Human Values & Ethics'] },
    ],
  },
];

const mockEvents = [
  {
    title: 'Global Leadership Summit 2026',
    slug: 'global-leadership-summit-2026',
    category: 'Leadership',
    date: new Date('2026-08-15'),
    time: '09:00 AM - 05:00 PM',
    location: 'Main Auditorium, Tejas Campus',
    description: 'Join industry leaders and our esteemed faculty for a full day of insights into the future of global business.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  {
    title: 'Startup Pitch Fest',
    slug: 'startup-pitch-fest',
    category: 'Career',
    date: new Date('2026-09-10'),
    time: '10:00 AM - 02:00 PM',
    location: 'Innovation Hub',
    description: 'Students present their startup ideas to a panel of venture capitalists and angel investors.',
    image: 'https://images.unsplash.com/photo-1475721025505-200780281bbf',
  }
];

const mockBlogs = [
  {
    title: 'The Future of Ethical Leadership',
    slug: 'the-future-of-ethical-leadership',
    content: 'In today’s fast-paced world, ethical leadership is more important than ever. Leaders are facing unprecedented challenges...',
    category: 'Leadership',
    tags: ['ethics', 'management', 'future'],
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    status: 'Published',
    publishedAt: new Date(),
  },
  {
    title: 'Navigating the Digital Transformation',
    slug: 'navigating-the-digital-transformation',
    content: 'Digital transformation is no longer a buzzword; it is a necessity for survival in the corporate landscape...',
    category: 'Technology',
    tags: ['digital', 'transformation', 'strategy'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    status: 'Published',
    publishedAt: new Date(),
  }
];

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Check if URI is missing or placeholder
    if (!mongoUri || mongoUri.includes('your_mongodb_connection_string_here')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI is required in production environment.');
      }
      logger.info('Starting in-memory MongoDB server for local testing...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({ instance: { startupTimeout: 120000 } });
      mongoUri = mongod.getUri();
    } else {
      logger.info('Attempting MongoDB Atlas connection...');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);

    // Auto-seed Super Admin
    const defaultAdminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'vishnu24.igm@gmail.com';
    const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'vishnu@9121';
    const adminExists = await User.findOne({ email: defaultAdminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Tejas Super Admin',
        email: defaultAdminEmail,
        password: defaultAdminPassword, // will be hashed by pre-save hook
        role: 'super_admin',
        isEmailVerified: true
      });
      logger.info(`[+] Auto-Seeded Super Admin: ${defaultAdminEmail}`);
      console.log(`[+] Auto-Seeded Super Admin: ${defaultAdminEmail}`);
    }

    // Auto-seed Programs if empty
    const programCount = await Program.countDocuments();
    if (programCount === 0) {
      await Program.insertMany(mockPrograms);
      logger.info('[+] Auto-Seeded Initial Programs');
    }

    // Auto-seed Events if empty
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany(mockEvents);
      logger.info('[+] Auto-Seeded Initial Events');
    }

    // Auto-seed Blogs if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const adminUser = await User.findOne({ role: 'super_admin' });
      if (adminUser) {
        const blogsWithAuthor = mockBlogs.map(b => ({ ...b, author: adminUser._id }));
        await Blog.insertMany(blogsWithAuthor);
        logger.info('[+] Auto-Seeded Initial Blogs');
      }
    }

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Notice: ${error.message}`);
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    // Don't kill process; allow server to remain alive
    return null;
  }
};
