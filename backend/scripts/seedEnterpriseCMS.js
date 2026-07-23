import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GlobalSettings } from '../models/GlobalSettings.js';
import { ContentPage } from '../models/ContentPage.js';
import { ContentVersion } from '../models/ContentVersion.js';
import { Program } from '../models/Program.js';
import { Course } from '../models/Course.js';
import { Event } from '../models/Event.js';
import { Blog } from '../models/Blog.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { Testimonial } from '../models/Testimonial.js';
import { Gallery } from '../models/Gallery.js';
import { User } from '../models/User.js';

dotenv.config();

export const seedEnterpriseCMS = async () => {
  try {
    console.log('🚀 Running Enterprise CMS Database Auto-Seeder...');

    // 1. Seed Global Settings
    const settingsCount = await GlobalSettings.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 Seeding Global Settings...');
      await GlobalSettings.create([
        {
          key: 'site_settings',
          data: {
            contactEmail: 'admissions@tejasacademy.edu',
            contactPhone: '+91 800 123 4567',
            physicalAddress: '123 Education Drive, Tech Park, Bangalore, 560001, India',
            branding: {
              logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400',
              faviconUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=100'
            },
            socialLinks: {
              linkedin: 'https://linkedin.com/school/tejas-academy',
              twitter: 'https://twitter.com/tejas_academy',
              instagram: 'https://instagram.com/tejas_academy',
              youtube: 'https://youtube.com/c/tejasacademy'
            }
          }
        },
        {
          key: 'navigation',
          data: {
            links: [
              { label: 'Home', path: '/' },
              { label: 'About', path: '/about' },
              { label: 'Programs', path: '/programs' },
              { label: 'Events', path: '/events' },
              { label: 'Insights', path: '/insights' },
              { label: 'Mentors', path: '/mentors' },
              { label: 'Gallery', path: '/gallery' },
              { label: 'Contact', path: '/contact' }
            ],
            ctaButton: { label: 'Apply Now', path: '/admissions' }
          }
        },
        {
          key: 'announcement_bar',
          data: {
            enabled: true,
            text: '🎉 Fall 2026 Admissions Now Open! Early Bird Scholarships Available.',
            linkText: 'Apply Today',
            linkUrl: '/admissions',
            badgeText: 'ADMISSIONS'
          }
        },
        {
          key: 'footer',
          data: {
            aboutText: 'Tejas Academy of Excellence is a premier institution dedicated to modern education, executive leadership, emerging technologies, and startup incubation.',
            quickLinks: [
              { label: 'About Us', path: '/about' },
              { label: 'Academic Programs', path: '/programs' },
              { label: 'Upcoming Events', path: '/events' },
              { label: 'Tejas Insights', path: '/insights' },
              { label: 'Placements', path: '/placements' },
              { label: 'Contact Admissions', path: '/contact' }
            ],
            legalLinks: [
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'Terms of Service', path: '/terms' }
            ],
            copyrightText: `© ${new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.`
          }
        }
      ]);
    }

    // 2. Seed Programs
    const programCount = await Program.countDocuments();
    if (programCount === 0) {
      console.log('🌱 Seeding Tejas Academy Academic Programs...');
      await Program.create([
        {
          title: 'AI & Emerging Technologies',
          slug: 'ai-emerging-tech',
          category: 'Postgraduate & Executive',
          duration: '12 Months',
          level: 'Advanced',
          shortDescription: 'Master Artificial Intelligence, Deep Learning, Machine Learning Engineering, and Neural Networks with industry experts.',
          description: 'A comprehensive 12-month postgraduate program designed for engineers and innovators looking to build state-of-the-art AI systems.',
          highlights: ['Hands-on GPU Labs', 'Capstone Industry Projects', 'Global Industry Mentorship'],
          isFeatured: true,
          status: 'published'
        },
        {
          title: 'Executive Leadership & Management',
          slug: 'executive-leadership',
          category: 'Executive Leadership',
          duration: '9 Months',
          level: 'Executive',
          shortDescription: 'Empower yourself with strategic decision-making, corporate governance, global business strategy, and high-performance team leadership.',
          description: 'Designed for senior professionals, managers, and founders looking to elevate their leadership presence and scale global enterprises.',
          highlights: ['Case Studies with CEOs', 'International Residency', 'Peer Executive Network'],
          isFeatured: true,
          status: 'published'
        },
        {
          title: 'Entrepreneurship & Startup Incubation',
          slug: 'entrepreneurship-incubation',
          category: 'Innovation & Ventures',
          duration: '6 Months',
          level: 'All Levels',
          shortDescription: 'Turn your disruptive idea into a scalable startup with seed funding access, pitch coaching, and legal incubation support.',
          description: 'An immersive venture building acceleration bootcamp providing direct access to venture capitalists, angel investors, and legal mentors.',
          highlights: ['Venture Capital Pitch Day', 'Incubation Desk Space', 'Product Prototyping Grant'],
          isFeatured: true,
          status: 'published'
        },
        {
          title: 'Cloud Architecture & DevOps Mastery',
          slug: 'cloud-devops-mastery',
          category: 'Professional Certification',
          duration: '6 Months',
          level: 'Intermediate',
          shortDescription: 'Architect resilient multi-cloud infrastructure, Kubernetes orchestration, CI/CD pipelines, and enterprise DevSecOps.',
          description: 'Hands-on Cloud Systems Engineering program focused on AWS, Google Cloud, Terraform, and automated deployment pipelines.',
          highlights: ['AWS & GCP Certified Curriculum', 'Live Cloud Infrastructure Labs', '100% Placement Support'],
          isFeatured: true,
          status: 'published'
        }
      ]);
    }

    // 3. Seed Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('🌱 Seeding Tejas Academy Events...');
      await Event.create([
        {
          title: 'Global AI Summit & Innovation Hackathon 2026',
          slug: 'global-ai-summit-2026',
          category: 'Hackathon',
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          time: '09:00 AM - 06:00 PM',
          location: 'Main Auditorium & Virtual Hybrid',
          description: 'Join 500+ developers, researchers, and tech leaders for a 48-hour hackathon competing for $25,000 in seed prizes.',
          bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200',
          registrationStatus: 'open',
          speakers: [{ name: 'Dr. Rajesh Sharma', role: 'Head of AI Research' }],
          isFeatured: true
        },
        {
          title: 'Executive Leadership Roundtable: Scaling Tech Ventures',
          slug: 'executive-leadership-roundtable',
          category: 'Seminar',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          time: '02:00 PM - 05:00 PM',
          location: 'Executive Boardroom & Zoom',
          description: 'An exclusive panel discussion with industry founders discussing capital allocation, international expansion, and team culture.',
          bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200',
          registrationStatus: 'open',
          speakers: [{ name: 'Ananya Roy', role: 'Venture Partner' }],
          isFeatured: true
        }
      ]);
    }

    // 4. Seed Tejas Insights (Blogs)
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Seeding Tejas Insights Articles...');
      await Blog.create([
        {
          title: 'The Future of AI in Higher Education and Skill Building',
          slug: 'future-of-ai-education',
          category: 'Technology',
          summary: 'How generative models and personalized learning algorithms are reshaping career preparation in modern universities.',
          content: '<p>Artificial Intelligence is no longer just a subject in computer science departments; it has become the fundamental substrate of modern workforce development...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200',
          author: { name: 'Dr. Vishnu Vardhan', role: 'Director of Innovation' },
          readTime: '5 min read',
          tags: ['AI', 'Education', 'Future of Work'],
          isFeatured: true,
          status: 'published'
        },
        {
          title: 'Building Resilient Startup Ecosystems in Tier-1 Tech Hubs',
          slug: 'building-resilient-startup-ecosystems',
          category: 'Entrepreneurship',
          summary: 'Key strategies for first-time founders navigating early seed funding, equity structures, and product-market fit.',
          content: '<p>Starting a technology enterprise requires more than just capital; it demands an interconnected web of mentors, venture labs, and active feedback loops...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200',
          author: { name: 'Priya Sundaram', role: 'Venture Incubation Director' },
          readTime: '7 min read',
          tags: ['Startups', 'Venture Capital', 'Incubation'],
          isFeatured: true,
          status: 'published'
        }
      ]);
    }

    // 5. Seed Faculty & Mentors
    const mentorCount = await MentorProfile.countDocuments();
    if (mentorCount === 0) {
      console.log('🌱 Seeding Tejas Academy Faculty Profiles...');
      await MentorProfile.create([
        {
          name: 'Dr. Aris Thorne',
          title: 'Professor & Chair of Artificial Intelligence',
          department: 'Emerging Technologies',
          bio: 'Former Senior Principal Scientist with 15+ years experience in deep neural architectures and natural language processing.',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
          specializations: ['Machine Learning', 'Computer Vision', 'Deep Learning'],
          isFeatured: true
        },
        {
          name: 'Meera Deshmukh',
          title: 'Director of Executive Leadership',
          department: 'Business & Management',
          bio: 'Executive coach for Fortune 500 C-suite leaders and specialist in organizational design and strategic governance.',
          profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400',
          specializations: ['Executive Leadership', 'Strategic Management', 'Change Leadership'],
          isFeatured: true
        }
      ]);
    }

    // 6. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('🌱 Seeding Student Testimonials...');
      await Testimonial.create([
        {
          name: 'Siddharth Nair',
          role: 'AI Research Engineer at TechCorp',
          content: 'The hands-on GPU labs and 1-on-1 mentorship at Tejas Academy completely transformed my career trajectory. The curriculum is 100% industry aligned.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
          rating: 5,
          program: 'AI & Emerging Technologies',
          isFeatured: true
        },
        {
          name: 'Kavya Sharma',
          role: 'Founder & CEO, NexaLabs',
          content: 'Thanks to the Startup Incubation program, we raised our pre-seed round of $150K right at the Pitch Day. The mentor network is extraordinary.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
          rating: 5,
          program: 'Entrepreneurship & Incubation',
          isFeatured: true
        }
      ]);
    }

    // 7. Seed Homepage CMS Sections
    const homePage = await ContentPage.findOne({ slug: 'home' });
    if (!homePage) {
      console.log('🌱 Seeding Homepage CMS Sections...');
      const createdPage = await ContentPage.create({
        title: 'Homepage',
        slug: 'home',
        status: 'published'
      });

      const draftVersion = await ContentVersion.create({
        page: createdPage._id,
        versionName: 'Published Version v1.0',
        blocks: [
          {
            blockType: 'hero',
            content: {
              heading: 'Empowering Future Leaders & Tech Innovators',
              subheading: 'Tejas Academy of Excellence',
              description: 'World-class education, executive leadership programs, AI research labs, and startup incubation designed to launch high-impact careers.',
              primaryCtaText: 'Explore Programs',
              primaryCtaLink: '/programs',
              secondaryCtaText: 'Apply Now',
              secondaryCtaLink: '/admissions',
              bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920'
            }
          },
          {
            blockType: 'stats',
            content: {
              items: [
                { label: 'Graduates Placed', value: '98%' },
                { label: 'Industry Mentors', value: '150+' },
                { label: 'Startups Incubated', value: '45+' },
                { label: 'Global Partners', value: '30+' }
              ]
            }
          }
        ],
        status: 'published'
      });

      createdPage.draftVersion = draftVersion._id;
      createdPage.publishedVersion = draftVersion._id;
      await createdPage.save();
    }

    console.log('✅ Enterprise CMS Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Error during Enterprise CMS Seeding:', error.message);
  }
};
