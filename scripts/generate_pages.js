const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'client', 'src');
const pagesDir = path.join(baseDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const files = {
  'About.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const About = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="About Us" description="Discover our rich history and commitment to educational excellence." />
      <div className="mt-10 prose lg:prose-xl mx-auto">
        <p>Tejas Academy was founded with a singular vision: to cultivate leaders who are academically brilliant and ethically grounded. Over the decades, our institution has grown from a humble learning center to a sprawling campus that houses state-of-the-art facilities.</p>
        <p>Our commitment to holistic development ensures that every student finds their unique path, supported by world-class educators and industry mentors.</p>
      </div>
    </div>
  );
};`,

  'VisionMission.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const VisionMission = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
      <div>
        <SectionHeader title="Our Vision" align="left" className="mb-6" />
        <p className="text-gray-700 text-lg leading-relaxed">To be a globally recognized institution that nurtures intellectual curiosity, fosters innovation, and empowers individuals to make a meaningful impact on society.</p>
      </div>
      <div>
        <SectionHeader title="Our Mission" align="left" className="mb-6" />
        <ul className="space-y-4 text-gray-700 text-lg">
          <li className="flex gap-2"><span>-</span> Provide accessible, world-class education.</li>
          <li className="flex gap-2"><span>-</span> Encourage cutting-edge research and innovation.</li>
          <li className="flex gap-2"><span>-</span> Cultivate an inclusive community of diverse talents.</li>
        </ul>
      </div>
    </div>
  );
};`,

  'Campus.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Campus = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Our Campus" description="Take a virtual tour of our modern facilities designed for collaborative learning." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
            <img src={\`https://via.placeholder.com/600x400?text=Campus+Facility+\${i}\`} alt={\`Campus \${i}\`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'Programs.jsx': `import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgramCard } from '@/components/cards/ProgramCard';
import { Button } from '@/components/ui/Button';

const mockPrograms = [
  { id: '1', slug: 'computer-science', title: 'Computer Science', description: 'Learn advanced computing.', category: 'Tech', duration: '4 Years', location: 'Main Campus' },
  { id: '2', slug: 'business-admin', title: 'Business Administration', description: 'Master corporate leadership.', category: 'Business', duration: '3 Years', location: 'Main Campus' },
  { id: '3', slug: 'data-science', title: 'Data Science', description: 'Analytics and machine learning.', category: 'Tech', duration: '2 Years', location: 'Online' }
];

export const Programs = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Tech', 'Business'];

  const filtered = filter === 'All' ? mockPrograms : mockPrograms.filter(p => p.category === filter);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Academic Programs" description="Explore our diverse range of undergraduate and postgraduate programs." />
      <div className="flex justify-center gap-4 mb-10">
        {categories.map(c => (
          <Button key={c} variant={filter === c ? 'primary' : 'outline'} onClick={() => setFilter(c)}>{c}</Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(p => <ProgramCard key={p.id} {...p} />)}
      </div>
    </div>
  );
};`,

  'ProgramDetails.jsx': `import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

export const ProgramDetails = () => {
  const { slug } = useParams();

  const tabs = [
    { label: 'Overview', content: <p className="text-gray-700">Detailed overview of the {slug} program goes here. Covering the core philosophy and outcomes.</p> },
    { label: 'Curriculum', content: <ul className="list-disc pl-5 space-y-2 text-gray-700"><li>Semester 1: Basics</li><li>Semester 2: Intermediate Concepts</li><li>Semester 3: Advanced Topics</li><li>Semester 4: Project Work</li></ul> },
    { label: 'Careers', content: <p className="text-gray-700">Graduates are highly sought after by top-tier tech and business firms globally.</p> }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title={\`Program: \${slug.replace('-', ' ')}\`} align="left" />
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Tabs tabs={tabs} />
        <div className="mt-8">
          <Button>Apply for this Program</Button>
        </div>
      </div>
    </div>
  );
};`,

  'Admissions.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AdmissionsForm } from '@/components/forms/AdmissionsForm';

export const Admissions = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <SectionHeader title="Admissions Portal" description="Take the first step towards your future. Fill out the application form below." />
      <div className="mt-10">
        <AdmissionsForm />
      </div>
    </div>
  );
};`,

  'Faculty.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FacultyCard } from '@/components/cards/FacultyCard';

export const Faculty = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Our Faculty" description="Learn from industry veterans and renowned academics." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[1,2,3,4,5,6,7,8].map(i => (
          <FacultyCard key={i} name={\`Dr. Professor \${i}\`} role="Senior Lecturer" department="Computer Science" bio="An expert in distributed systems and AI." />
        ))}
      </div>
    </div>
  );
};`,

  'Mentors.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MentorCard } from '@/components/cards/MentorCard';

export const Mentors = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Industry Mentors" description="Connect with leaders who guide your professional journey." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[1,2,3,4].map(i => (
          <MentorCard key={i} name={\`Mentor \${i}\`} role="CTO at TechCorp" department="Industry Expert" bio="Guiding students to build scalable products." />
        ))}
      </div>
    </div>
  );
};`,

  'Events.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EventCard } from '@/components/cards/EventCard';

export const Events = () => {
  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      <SectionHeader title="Upcoming Events" description="Join our community gatherings, hackathons, and seminars." />
      <div className="space-y-6 mt-10">
        {[1,2,3].map(i => (
          <EventCard key={i} title={\`Tech Symposium \${i}\`} description="Annual gathering of tech minds." date="Oct 12, 2026" time="10:00 AM" location="Main Auditorium" type="Seminar" />
        ))}
      </div>
    </div>
  );
};`,

  'Gallery.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Gallery = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Gallery" description="Glimpses of life at Tejas Academy." />
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-10 space-y-4">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="break-inside-avoid">
            <img src={\`https://via.placeholder.com/\${400 + (i%3)*100}x\${300 + (i%2)*150}\`} alt={\`Gallery \${i}\`} className="w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'Blog.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BlogCard } from '@/components/cards/BlogCard';

export const Blog = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Our Blog" description="Latest news, insights, and stories from our community." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {[1,2,3,4,5,6].map(i => (
          <BlogCard key={i} slug={\`post-\${i}\`} title={\`The Future of Education \${i}\`} excerpt="Discover the emerging trends in modern pedagogy." author="Jane Doe" date="2026-07-01" category="Education" />
        ))}
      </div>
    </div>
  );
};`,

  'BlogDetails.jsx': `import React from 'react';
import { useParams } from 'react-router-dom';

export const BlogDetails = () => {
  const { slug } = useParams();
  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4 capitalize">{slug.replace('-', ' ')}</h1>
      <div className="flex gap-4 text-gray-500 mb-8 border-b pb-4">
        <span>By Jane Doe</span>
        <span>July 1, 2026</span>
      </div>
      <div className="prose lg:prose-xl">
        <p>This is the detailed content for the blog post <strong>{slug}</strong>. It contains deep insights and research findings.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus.</p>
      </div>
    </div>
  );
};`,

  'Resources.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Resources = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Student Resources" description="Helpful guides, policies, and materials." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
            <h3 className="font-bold text-lg mb-2">Resource Guide {i}</h3>
            <p className="text-gray-600 mb-4 text-sm">Download the complete handbook for semester {i}.</p>
            <a href="#" className="text-primary-600 hover:underline font-medium">Download PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'Placements.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Placements = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Placements & Careers" description="Our graduates are shaping the future." />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">98%</div>
          <div className="text-gray-700">Placement Rate</div>
        </div>
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">$85k</div>
          <div className="text-gray-700">Average Starting Salary</div>
        </div>
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">500+</div>
          <div className="text-gray-700">Hiring Partners</div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-center mb-8">Top Hiring Partners</h3>
      <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(c => (
          <div key={c} className="text-2xl font-bold">{c}</div>
        ))}
      </div>
    </div>
  );
};`,

  'Testimonials.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCard } from '@/components/cards/TestimonialCard';

export const Testimonials = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Alumni Success Stories" description="Hear from our graduates who are making waves." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {[1,2,3,4,5,6].map(i => (
          <TestimonialCard key={i} name={\`Alumni \${i}\`} role="Software Engineer" company="TechCorp" content="Tejas Academy completely transformed my career trajectory. The faculty is incredible." />
        ))}
      </div>
    </div>
  );
};`,

  'Contact.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/forms/ContactForm';

export const Contact = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
      <div>
        <SectionHeader title="Get in Touch" align="left" description="Have questions? We'd love to hear from you." />
        <div className="mt-8 aspect-square md:aspect-video bg-gray-200 rounded-xl overflow-hidden">
          <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(Tejas%20Academy)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl">
        <ContactForm />
      </div>
    </div>
  );
};`,

  'Career.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';

export const Career = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Careers at Tejas" description="Join our mission to build the future of education." />
      <div className="mt-10 space-y-6">
        {[
          { title: 'Senior Professor - AI', dept: 'Academics', type: 'Full-time' },
          { title: 'Marketing Manager', dept: 'Administration', type: 'Full-time' },
          { title: 'Student Counselor', dept: 'Support', type: 'Part-time' }
        ].map((job, i) => (
          <div key={i} className="flex flex-col md:flex-row justify-between items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div>
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-500 mt-1">{job.dept} &bull; {job.type}</p>
            </div>
            <Button className="mt-4 md:mt-0">Apply Now</Button>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'Support.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';

export const Support = () => {
  const faqs = [
    { title: 'How do I reset my portal password?', content: 'You can reset it using the "Forgot Password" link on the login page.' },
    { title: 'Where can I find the academic calendar?', content: 'The academic calendar is available under the Resources section.' },
    { title: 'Who do I contact for IT support?', content: 'Email itsupport@tejasacademy.edu for all technical queries.' }
  ];

  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <SectionHeader title="Support & FAQ" description="Find answers to common questions." />
      <div className="mt-10">
        <Accordion items={faqs} />
      </div>
    </div>
  );
};`,

  'Privacy.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Privacy = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 prose">
      <SectionHeader title="Privacy Policy" align="left" />
      <p>Last updated: July 2026</p>
      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
      <h3>2. Use of Information</h3>
      <p>We may use the information we collect about you to provide, maintain, and improve our services.</p>
    </div>
  );
};`,

  'Terms.jsx': `import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Terms = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 prose">
      <SectionHeader title="Terms of Service" align="left" />
      <p>Last updated: July 2026</p>
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h3>2. Provision of Services</h3>
      <p>Tejas Academy is constantly innovating in order to provide the best possible experience for its users.</p>
    </div>
  );
};`,

  'NotFound.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFound = () => {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Button as={Link} to="/" className="mt-8">Go Back Home</Button>
    </div>
  );
};`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(pagesDir, filename), content, 'utf8');
  console.log('Created:', filename);
}

// Update App.jsx
const appContent = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Breadcrumb } from './components/ui/Breadcrumb';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { VisionMission } from './pages/VisionMission';
import { Campus } from './pages/Campus';
import { Programs } from './pages/Programs';
import { ProgramDetails } from './pages/ProgramDetails';
import { Admissions } from './pages/Admissions';
import { Faculty } from './pages/Faculty';
import { Mentors } from './pages/Mentors';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { BlogDetails } from './pages/BlogDetails';
import { Resources } from './pages/Resources';
import { Placements } from './pages/Placements';
import { Testimonials } from './pages/Testimonials';
import { Contact } from './pages/Contact';
import { Career } from './pages/Career';
import { Support } from './pages/Support';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 selection:bg-primary-200">
      <SmoothScroll />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Breadcrumb />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/vision-mission" element={<VisionMission />} />
          <Route path="/about/campus" element={<Campus />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramDetails />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;`;

fs.writeFileSync(path.join(baseDir, 'App.jsx'), appContent, 'utf8');
console.log('Updated: App.jsx');
