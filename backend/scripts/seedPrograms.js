import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Program } from '../models/Program.js';

dotenv.config();

const mockPrograms = [
  {
    title: 'Post Graduate Program in Management',
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

const seedPrograms = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri !== 'your_mongodb_connection_string_here') {
      await mongoose.connect(mongoUri);
    } else {
      console.log('Skipping real DB connection, assuming in-memory is handled elsewhere if testing.');
      return;
    }

    await Program.deleteMany();
    await Program.insertMany(mockPrograms);

    console.log('[+] Programs seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('[-] Error seeding programs:', error);
    process.exit(1);
  }
};

seedPrograms();
