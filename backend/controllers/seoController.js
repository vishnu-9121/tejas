import { SEOPage } from '../models/SEOPage.js';
import Program from '../models/Program.js';
import Blog from '../models/Blog.js';

export const DEFAULT_SEO_PAGES = [
  {
    pageKey: 'homepage',
    route: '/',
    title: 'Tejas Academy of Excellence | Business, Entrepreneurship, Leadership & Career Skills',
    h1: 'Business, Entrepreneurship, Leadership & Career Readiness',
    description: 'Tejas Academy of Excellence delivers practical capability-building programs in business, entrepreneurship, leadership, AI literacy, career readiness, and future skills.',
    canonical: 'https://unlocktejas.com/',
    robots: 'index, follow',
    ogTitle: 'Tejas Academy of Excellence | Business, Entrepreneurship, Leadership & Career Skills',
    ogDescription: 'Practical capability-building education bridging academic knowledge and real-world leadership in business, technology, and entrepreneurship.',
    ogImage: 'https://unlocktejas.com/logo.png',
    keywords: ['Tejas Academy', 'Tejas Academy of Excellence', 'Business School India', 'Entrepreneurship Academy', 'Leadership Training', 'AI Literacy', 'Career Readiness', 'Future Skills'],
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    pageKey: 'career-readiness',
    route: '/career-readiness',
    title: 'Career Readiness Programs | Career Skills & Job Readiness | Tejas Academy',
    h1: 'Career Readiness & Future-Ready Skills',
    description: 'Master essential career readiness skills: professional communication, strategic problem-solving, digital fluency, and workplace adaptability with Tejas Academy.',
    canonical: 'https://unlocktejas.com/career-readiness',
    robots: 'index, follow',
    ogTitle: 'Career Readiness Programs | Career Skills & Job Readiness | Tejas Academy',
    ogDescription: 'Transform theoretical education into actionable workplace capability through structured career readiness programs.',
    ogImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Career Readiness', 'Career Readiness Programs', 'Career Skills', 'Job Readiness', 'Workplace Readiness', 'Career Preparation', 'Professional Skills'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'employability-skills',
    route: '/employability-skills',
    title: 'Employability Skills Training | Job-Ready & Workplace Skills | Tejas Academy',
    h1: 'Employability & Workplace Readiness Skills',
    description: 'Develop high-demand employability skills: teamwork, critical thinking, executive communication, workplace AI tools, and professional discipline.',
    canonical: 'https://unlocktejas.com/employability-skills',
    robots: 'index, follow',
    ogTitle: 'Employability Skills Training | Job-Ready & Workplace Skills | Tejas Academy',
    ogDescription: 'Industry-aligned employability skills training empowering students and graduates to excel in modern workplaces.',
    ogImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Employability Skills', 'Employability Skills Training', 'Job Skills', 'Workplace Skills', 'Professional Communication', 'Work-Ready Skills'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'ai-literacy',
    route: '/ai-literacy',
    title: 'AI Literacy & AI Skills Training | Tejas Academy',
    h1: 'AI Literacy & Future-Ready AI Skills',
    description: 'Learn practical AI literacy, prompt engineering, generative AI workflows, machine learning concepts, and ethical AI systems at Tejas Academy of Excellence.',
    canonical: 'https://unlocktejas.com/ai-literacy',
    robots: 'index, follow',
    ogTitle: 'AI Literacy & AI Skills Training | Tejas Academy',
    ogDescription: 'Bridge the technological divide with foundational and applied AI literacy for students, professionals, and entrepreneurs.',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    keywords: ['AI Literacy', 'AI Skills', 'Generative AI Training', 'AI Education', 'AI for Business', 'Prompt Engineering', 'AI Literacy Program'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'future-skills',
    route: '/future-skills',
    title: 'Future Skills Training | Future-Ready Skills & Careers | Tejas Academy',
    h1: 'Future Skills for a Changing World',
    description: 'Equip yourself with 21st-century future skills: complex problem solving, systems thinking, digital collaboration, adaptability, and technological agility.',
    canonical: 'https://unlocktejas.com/future-skills',
    robots: 'index, follow',
    ogTitle: 'Future Skills Training | Future-Ready Skills & Careers | Tejas Academy',
    ogDescription: 'Prepare for the evolving landscape of work with comprehensive future skills development and practical capstones.',
    ogImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Future Skills', 'Future Skills Training', 'Future-Ready Skills', 'Digital Literacy', '21st Century Skills', 'Critical Thinking'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'business-entrepreneurship',
    route: '/business-entrepreneurship',
    title: 'Business & Entrepreneurship Programs | Tejas Academy',
    h1: 'Business & Entrepreneurship Education',
    description: 'Master business strategy, venture building, startup planning, financial modeling, and entrepreneurial execution at Tejas Academy of Excellence.',
    canonical: 'https://unlocktejas.com/business-entrepreneurship',
    robots: 'index, follow',
    ogTitle: 'Business & Entrepreneurship Programs | Tejas Academy',
    ogDescription: 'Practical entrepreneurship education designed to turn innovative ideas into viable, sustainable ventures.',
    ogImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Business and Entrepreneurship', 'Entrepreneurship School', 'Startup Education', 'Business Strategy', 'Entrepreneurial Leadership'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'leadership-development',
    route: '/leadership-development',
    title: 'Leadership Development Programs | Tejas Academy',
    h1: 'Leadership Development & Entrepreneurial Leadership',
    description: 'Cultivate courageous, ethical, and strategic leadership capabilities. Leadership training programs for students, young leaders, and professionals.',
    canonical: 'https://unlocktejas.com/leadership-development',
    robots: 'index, follow',
    ogTitle: 'Leadership Development Programs | Tejas Academy',
    ogDescription: 'Developing principled leaders who combine intellectual rigor, emotional balance, and decisive action.',
    ogImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Leadership Development', 'Leadership Training', 'Student Leadership Programs', 'Entrepreneurial Leadership', 'Strategic Thinking'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'financial-literacy',
    route: '/financial-literacy',
    title: 'Financial Literacy & Financial Management | Tejas Academy',
    h1: 'Financial Literacy & Money Management Skills',
    description: 'Build robust financial foundations: personal finance, capital allocation, investment analysis, budgeting, and wealth architecture education.',
    canonical: 'https://unlocktejas.com/financial-literacy',
    robots: 'index, follow',
    ogTitle: 'Financial Literacy & Financial Management | Tejas Academy',
    ogDescription: 'Comprehensive financial literacy and wealth creation education empowering young adults and professionals.',
    ogImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Financial Literacy', 'Financial Education', 'Money Management Skills', 'Financial Planning', 'Wealth Creation Education'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'human-excellence',
    route: '/human-excellence',
    title: 'Human Excellence & Personal Development | Tejas Academy',
    h1: 'The Tejas Imperative of Human Excellence',
    description: 'Explore the 5 dimensions of Human Excellence: Intellectual, Character, Emotional, Professional, and Societal mastery grounded in ethical discipline.',
    canonical: 'https://unlocktejas.com/human-excellence',
    robots: 'index, follow',
    ogTitle: 'Human Excellence & Personal Development | Tejas Academy',
    ogDescription: 'Holistic capability and character-building framework guiding every program and student initiative at Tejas Academy.',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Human Excellence', 'Personal Development', 'Character Building', 'Emotional Intelligence', 'Ethical Leadership'],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    pageKey: 'student-development',
    route: '/student-development',
    title: 'Student Skill Development & Leadership | Tejas Academy',
    h1: 'Student Development & Applied Capability Programs',
    description: 'Empowering undergraduate and postgraduate students with practical problem-solving, AI tools, career readiness, and leadership capabilities.',
    canonical: 'https://unlocktejas.com/student-development',
    robots: 'index, follow',
    ogTitle: 'Student Skill Development & Leadership | Tejas Academy',
    ogDescription: 'Comprehensive development pathways tailored specifically for ambitious students preparing for modern industry careers.',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Student Skill Development', 'Student Development Programs', 'Student Leadership', 'Future Skills for Students', 'Career Preparation for Students'],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    pageKey: 'professional-development',
    route: '/professional-development',
    title: 'Professional Development & Workplace Mastery | Tejas Academy',
    h1: 'Professional Development for Modern Practitioners',
    description: 'Advanced professional development modules in strategic communication, executive leadership, technological adoption, and managerial competence.',
    canonical: 'https://unlocktejas.com/professional-development',
    robots: 'index, follow',
    ogTitle: 'Professional Development & Workplace Mastery | Tejas Academy',
    ogDescription: 'Practical capability enhancements for working professionals seeking career acceleration and executive skills.',
    ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Professional Development', 'Professional Skills Training', 'Career Growth', 'Executive Skills', 'Workplace Leadership'],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    pageKey: 'programs',
    route: '/programs',
    title: 'Academic & Professional Programs | Tejas Academy of Excellence',
    h1: 'Educational & Capability Programs',
    description: 'Discover industry-aligned certificate, undergraduate, and executive programs in AI, Business Management, and Human Excellence at Tejas Academy.',
    canonical: 'https://unlocktejas.com/programs',
    robots: 'index, follow',
    ogTitle: 'Academic & Professional Programs | Tejas Academy of Excellence',
    ogDescription: 'Rigorous capability-development curricula combining practical labs, masterclasses, and executive mentorship.',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Tejas Academy Programs', 'AI Programs', 'Management Programs', 'Certificate Courses', 'Executive Education'],
    priority: 0.9,
    changefreq: 'daily'
  },
  {
    pageKey: 'about',
    route: '/about',
    title: 'About Tejas Academy of Excellence | Academic Vision & Heritage',
    h1: 'About Tejas Academy of Excellence',
    description: 'Learn about the founding vision, academic philosophy, leadership, and state-of-the-art campus infrastructure of Tejas Academy of Excellence.',
    canonical: 'https://unlocktejas.com/about',
    robots: 'index, follow',
    ogTitle: 'About Tejas Academy of Excellence | Academic Vision & Heritage',
    ogDescription: 'Dedicated to cultivating character, competence, and leadership through practical pedagogy and research.',
    ogImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    keywords: ['About Tejas Academy', 'Tejas Academy Heritage', 'Tejas Leadership', 'Tejas Faculty', 'Gannavaram Campus'],
    priority: 0.8,
    changefreq: 'monthly'
  },
  {
    pageKey: 'for-institutions',
    route: '/for-institutions',
    title: 'Institutional Partnerships & Capacity Building | Tejas Academy',
    h1: 'Institutional Partnerships & Capacity Building',
    description: 'Collaborate with Tejas Academy on Faculty Development Programs (FDP), university innovation labs, student bootcamps, and curriculum enhancement.',
    canonical: 'https://unlocktejas.com/for-institutions',
    robots: 'index, follow',
    ogTitle: 'Institutional Partnerships & Capacity Building | Tejas Academy',
    ogDescription: 'Empowering universities and colleges with modern AI pedagogy, faculty workshops, and industry integration.',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    keywords: ['Institutional Partnerships', 'Faculty Development Programs', 'FDP', 'University Collaborations', 'Innovation Lab Setup'],
    priority: 0.8,
    changefreq: 'monthly'
  },
  {
    pageKey: 'recognitions',
    route: '/recognitions',
    title: 'Institutional Accreditations & Recognitions | Tejas Academy',
    h1: 'Institutional Accreditations & Recognitions',
    description: 'Review our institutional accreditations, educational awards, industry council recognitions, and pedagogical charters.',
    canonical: 'https://unlocktejas.com/recognitions',
    robots: 'index, follow',
    ogTitle: 'Institutional Accreditations & Recognitions | Tejas Academy',
    ogDescription: 'Demonstrating academic excellence, ethical integrity, and national skill development compliance.',
    ogImage: 'https://unlocktejas.com/logo.png',
    keywords: ['Tejas Recognitions', 'Accreditations', 'Higher Education Awards', 'Academic Compliance'],
    priority: 0.7,
    changefreq: 'monthly'
  },
  {
    pageKey: 'insights',
    route: '/insights',
    title: 'Tejas Insights | Educational Research, AI & Leadership Articles',
    h1: 'Tejas Insights & Thought Leadership',
    description: 'In-depth articles, whitepapers, and guides on AI literacy, career readiness, future skills, entrepreneurship, and human excellence.',
    canonical: 'https://unlocktejas.com/insights',
    robots: 'index, follow',
    ogTitle: 'Tejas Insights | Educational Research, AI & Leadership Articles',
    ogDescription: 'Actionable perspectives and research from faculty, mentors, and researchers at Tejas Academy.',
    ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    keywords: ['Tejas Insights', 'Education Blog', 'Career Readiness Articles', 'AI Literacy Articles', 'Leadership Whitepapers'],
    priority: 0.8,
    changefreq: 'daily'
  },
  {
    pageKey: 'contact',
    route: '/contact',
    title: 'Contact Admissions & Helpdesk | Tejas Academy of Excellence',
    h1: 'Contact Admissions & Helpdesk',
    description: 'Get in touch with the admissions desk, program advisors, or institutional relations team at Tejas Academy of Excellence in Gannavaram.',
    canonical: 'https://unlocktejas.com/contact',
    robots: 'index, follow',
    ogTitle: 'Contact Admissions & Helpdesk | Tejas Academy of Excellence',
    ogDescription: 'Reach our counselors by phone, email, or schedule an on-campus visit in Gannavaram, Amaravathi.',
    ogImage: 'https://unlocktejas.com/logo.png',
    keywords: ['Contact Tejas Academy', 'Admissions Helpline', 'Tejas Address', 'Gannavaram Campus Phone'],
    priority: 0.8,
    changefreq: 'monthly'
  }
];

export const getAllSEOPages = async (req, res) => {
  try {
    const pages = await SEOPage.find().sort({ route: 1 });
    if (!pages || pages.length === 0) {
      // Seed default pages if collection is empty
      await SEOPage.insertMany(DEFAULT_SEO_PAGES);
      const seeded = await SEOPage.find().sort({ route: 1 });
      return res.status(200).json({ success: true, data: seeded });
    }
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch SEO pages', error: error.message });
  }
};

export const getSEOPageByKey = async (req, res) => {
  try {
    const { pageKey } = req.params;
    let page = await SEOPage.findOne({ pageKey });
    
    if (!page) {
      const defaultPage = DEFAULT_SEO_PAGES.find(p => p.pageKey === pageKey || p.route === `/${pageKey}`);
      if (defaultPage) {
        page = await SEOPage.create(defaultPage);
      }
    }

    if (!page) {
      return res.status(404).json({ success: false, message: `SEO metadata not found for key: ${pageKey}` });
    }

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch SEO page', error: error.message });
  }
};

export const updateSEOPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updateData = req.body;

    const page = await SEOPage.findOneAndUpdate(
      { pageKey },
      { ...updateData, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `SEO settings for ${pageKey} updated successfully`,
      data: page
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update SEO settings', error: error.message });
  }
};

export const generateDynamicSitemap = async (req, res) => {
  try {
    const baseUrl = 'https://unlocktejas.com';
    const today = new Date().toISOString().split('T')[0];

    // 1. Static & Topic Cluster Pages from SEOPage Model (or defaults)
    let seoPages = await SEOPage.find().lean();
    if (!seoPages || seoPages.length === 0) {
      seoPages = DEFAULT_SEO_PAGES;
    }

    // 2. Published Programs
    let programs = [];
    try {
      programs = await Program.find({ 
        status: { $in: ['Published', 'published'] }, 
        isActive: { $ne: false } 
      }).select('slug title shortDescription posterImage updatedAt').lean();
    } catch {
      programs = [];
    }

    // 3. Published Blog / Insights
    let blogs = [];
    try {
      blogs = await Blog.find({ 
        status: { $in: ['Published', 'published'] }, 
        published: { $ne: false } 
      }).select('slug title excerpt coverImage publishedAt updatedAt').lean();
    } catch {
      blogs = [];
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Add SEO Pages
    for (const page of seoPages) {
      const loc = `${baseUrl}${page.route === '/' ? '/' : page.route}`;
      const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : today;
      
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq || 'weekly'}</changefreq>\n`;
      xml += `    <priority>${(page.priority || 0.8).toFixed(1)}</priority>\n`;
      if (page.ogImage) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${page.ogImage}</image:loc>\n`;
        xml += `      <image:title>${page.title.replace(/&/g, '&amp;')}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    // Add Dynamic Programs
    for (const prog of programs) {
      const loc = `${baseUrl}/programs/${prog.slug}`;
      const lastmod = prog.updatedAt ? new Date(prog.updatedAt).toISOString().split('T')[0] : today;
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      if (prog.posterImage) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${prog.posterImage}</image:loc>\n`;
        xml += `      <image:title>${(prog.title || '').replace(/&/g, '&amp;')}</image:title>\n`;
        if (prog.shortDescription) {
          xml += `      <image:caption>${(prog.shortDescription || '').replace(/&/g, '&amp;')}</image:caption>\n`;
        }
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    // Add Dynamic Blogs / Insights
    for (const blog of blogs) {
      const loc = `${baseUrl}/insights/${blog.slug}`;
      const lastmod = (blog.updatedAt || blog.publishedAt) ? new Date(blog.updatedAt || blog.publishedAt).toISOString().split('T')[0] : today;
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      if (blog.coverImage) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${blog.coverImage}</image:loc>\n`;
        xml += `      <image:title>${(blog.title || '').replace(/&/g, '&amp;')}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(xml);
  } catch (error) {
    return res.status(500).send(`<!-- Error generating sitemap: ${error.message} -->`);
  }
};

export const getRobotsTxt = (req, res) => {
  const robots = `# Robots.txt for Tejas Academy of Excellence (https://unlocktejas.com)
# Configured for Search Engines & Legitimate AI Answer Engines

User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Applebot
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /dashboard
Disallow: /faculty
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /dashboard
Disallow: /faculty
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: https://unlocktejas.com/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400');
  return res.status(200).send(robots);
};
