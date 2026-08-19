import React, { Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Breadcrumb } from './components/ui/Breadcrumb';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { QuickConnectWidget } from './components/ui/QuickConnectWidget';
import { SocialProofToasts } from './components/ui/SocialProofToasts';
import { useNetwork } from './hooks/useNetwork';
import { usePageTracker } from './hooks/usePageTracker';

import { SEO } from './components/ui/SEO';

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
);

// Lazy Loaded Pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.default || module.Home })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.default || module.About })));
const VisionMission = React.lazy(() => import('./pages/VisionMission').then(module => ({ default: module.default || module.VisionMission })));
const Campus = React.lazy(() => import('./pages/Campus').then(module => ({ default: module.default || module.Campus })));
const Programs = React.lazy(() => import('./pages/Programs').then(module => ({ default: module.default || module.Programs })));
const ProgramDetails = React.lazy(() => import('./pages/ProgramDetails').then(module => ({ default: module.default || module.ProgramDetails })));
const Admissions = React.lazy(() => import('./pages/Admissions').then(module => ({ default: module.default || module.Admissions })));

const Mentors = React.lazy(() => import('./pages/Mentors').then(module => ({ default: module.default || module.Mentors })));
const Events = React.lazy(() => import('./pages/Events').then(module => ({ default: module.default || module.Events })));
const Gallery = React.lazy(() => import('./pages/Gallery').then(module => ({ default: module.default || module.Gallery })));
const TejasInsights = React.lazy(() => import('./pages/Blog').then(module => ({ default: module.default || module.Blog })));
const InsightDetails = React.lazy(() => import('./pages/BlogDetails').then(module => ({ default: module.default || module.BlogDetails })));
const Resources = React.lazy(() => import('./pages/Resources').then(module => ({ default: module.default || module.Resources })));
const Placements = React.lazy(() => import('./pages/Placements').then(module => ({ default: module.default || module.Placements })));
const Testimonials = React.lazy(() => import('./pages/Testimonials').then(module => ({ default: module.default || module.Testimonials })));
const FreePrograms = React.lazy(() => import('./pages/FreePrograms').then(module => ({ default: module.default || module.FreePrograms })));
const ForInstitutions = React.lazy(() => import('./pages/ForInstitutions').then(module => ({ default: module.default || module.ForInstitutions })));
const Recognitions = React.lazy(() => import('./pages/Recognitions').then(module => ({ default: module.default || module.Recognitions })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.default || module.Contact })));
const Career = React.lazy(() => import('./pages/Career').then(module => ({ default: module.default || module.Career })));
const Support = React.lazy(() => import('./pages/Support').then(module => ({ default: module.default || module.Support })));
const Privacy = React.lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = React.lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Lazy Loaded Topic Cluster SEO Pages
const BusinessEntrepreneurship = React.lazy(() => import('./pages/topic-clusters/BusinessEntrepreneurship'));
const LeadershipDevelopment = React.lazy(() => import('./pages/topic-clusters/LeadershipDevelopment'));
const AILiteracy = React.lazy(() => import('./pages/topic-clusters/AILiteracy'));
const FutureSkills = React.lazy(() => import('./pages/topic-clusters/FutureSkills'));
const CareerReadiness = React.lazy(() => import('./pages/topic-clusters/CareerReadiness'));
const EmployabilitySkills = React.lazy(() => import('./pages/topic-clusters/EmployabilitySkills'));
const FinancialLiteracy = React.lazy(() => import('./pages/topic-clusters/FinancialLiteracy'));
const HumanExcellence = React.lazy(() => import('./pages/topic-clusters/HumanExcellence'));
const StudentDevelopment = React.lazy(() => import('./pages/topic-clusters/StudentDevelopment'));
const ProfessionalDevelopment = React.lazy(() => import('./pages/topic-clusters/ProfessionalDevelopment'));

const JoinUs = React.lazy(() => import('./pages/JoinUs').then(module => ({ default: module.JoinUs })));

// Lazy Loaded Auth & Dashboard
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const StudentDashboard = React.lazy(() => import('./pages/dashboard/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const FacultyDashboard = React.lazy(() => import('./pages/dashboard/FacultyDashboard').then(module => ({ default: module.FacultyDashboard })));

// Lazy Loaded Admin Layout & Pages
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));
const DashboardHome = React.lazy(() => import('./pages/admin/DashboardHome'));
const ManageStudents = React.lazy(() => import('./pages/admin/ManageStudents'));
const StudentProfile = React.lazy(() => import('./pages/admin/students/StudentProfile'));
const ManageAdmissions = React.lazy(() => import('./pages/admin/ManageAdmissions'));
const ApplicationDetails = React.lazy(() => import('./pages/admin/admissions/ApplicationDetails'));
const ManageInquiries = React.lazy(() => import('./pages/admin/ManageInquiries'));
const ManagePrograms = React.lazy(() => import('./pages/admin/ManagePrograms'));
const ProgramForm = React.lazy(() => import('./pages/admin/programs/ProgramForm'));
const ManageMentors = React.lazy(() => import('./pages/admin/ManageMentors'));
const MentorForm = React.lazy(() => import('./pages/admin/mentors/MentorForm'));
const ManageEvents = React.lazy(() => import('./pages/admin/ManageEvents'));
const EventForm = React.lazy(() => import('./pages/admin/events/EventForm'));
const ManageWorkshops = React.lazy(() => import('./pages/admin/ManageWorkshops'));
const WorkshopForm = React.lazy(() => import('./pages/admin/workshops/WorkshopForm'));
const ManageCourses = React.lazy(() => import('./pages/admin/ManageCourses'));
const CourseForm = React.lazy(() => import('./pages/admin/courses/CourseForm'));
const ManageInsights = React.lazy(() => import('./pages/admin/ManageBlogs'));
const InsightForm = React.lazy(() => import('./pages/admin/blogs/BlogForm'));
const ManageGallery = React.lazy(() => import('./pages/admin/ManageGallery'));
const ManageHomepage = React.lazy(() => import('./pages/admin/cms/ManageHomepage'));
const ManageAbout = React.lazy(() => import('./pages/admin/cms/ManageAbout'));
const ManageForInstitutions = React.lazy(() => import('./pages/admin/cms/ManageForInstitutions'));
const ManageRecognitions = React.lazy(() => import('./pages/admin/cms/ManageRecognitions'));
const ManageFreePrograms = React.lazy(() => import('./pages/admin/cms/ManageFreePrograms'));
const ManageVisionMission = React.lazy(() => import('./pages/admin/cms/ManageVisionMission'));
const ManageResources = React.lazy(() => import('./pages/admin/cms/ManageResources'));
const ManageContact = React.lazy(() => import('./pages/admin/cms/ManageContact'));
const ManageSEO = React.lazy(() => import('./pages/admin/cms/ManageSEO'));
const ManageSettings = React.lazy(() => import('./pages/admin/cms/ManageSettings'));
const ManageNotifications = React.lazy(() => import('./pages/admin/cms/ManageNotifications'));
const ManageFAQ = React.lazy(() => import('./pages/admin/cms/ManageFAQ'));
const ManageNavigation = React.lazy(() => import('./pages/admin/cms/ManageNavigation'));
const ManageCampus = React.lazy(() => import('./pages/admin/cms/ManageCampus'));
const ManageCareers = React.lazy(() => import('./pages/admin/cms/ManageCareers'));
const ManageLegal = React.lazy(() => import('./pages/admin/cms/ManageLegal'));
const ManageExitIntent = React.lazy(() => import('./pages/admin/cms/ManageExitIntent'));
const ManageSocialProof = React.lazy(() => import('./pages/admin/cms/ManageSocialProof'));
const ManageSocialLinks = React.lazy(() => import('./pages/admin/cms/ManageSocialLinks'));
const ManageQuickConnect = React.lazy(() => import('./pages/admin/cms/ManageQuickConnect'));
const ManageTestimonials = React.lazy(() => import('./pages/admin/ManageTestimonials'));
const ManageNewsletter = React.lazy(() => import('./pages/admin/ManageNewsletter'));
const CMSLayout = React.lazy(() => import('./pages/admin/cms/CMSLayout').then(module => ({ default: module.CMSLayout })));
const PageEditor = React.lazy(() => import('./pages/admin/cms/PageEditor').then(module => ({ default: module.PageEditor })));
const AnalyticsDashboard = React.lazy(() => import('./pages/admin/AnalyticsDashboard'));
const FacultyAnalytics = React.lazy(() => import('./pages/admin/FacultyAnalytics'));
const ManagementAnalytics = React.lazy(() => import('./pages/admin/ManagementAnalytics'));
const AuditLogConsole = React.lazy(() => import('./pages/admin/AuditLogConsole'));
const ManageMediaLibrary = React.lazy(() => import('./pages/admin/cms/ManageMediaLibrary'));
const ManageCMSPages = React.lazy(() => import('./pages/admin/cms/ManageCMSPages'));
const ManageRolesPermissions = React.lazy(() => import('./pages/admin/ManageRolesPermissions'));
const ManageLeadsCRM = React.lazy(() => import('./pages/admin/ManageLeadsCRM'));
const ManageEmailCampaigns = React.lazy(() => import('./pages/admin/ManageEmailCampaigns'));
const ManageBackups = React.lazy(() => import('./pages/admin/ManageBackups'));

import { VelarisGlobalBackground } from './components/ui/VelarisGlobalBackground';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary-200 relative">
      <VelarisGlobalBackground opacity={0.35} />
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Breadcrumb />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <QuickConnectWidget />
      <SocialProofToasts />
    </div>
  );
};

function App() {
  useNetwork(); // Initialize network monitoring
  usePageTracker(); // Automatically track all page views

  return (
    <>
      <SEO 
        title="Welcome" 
        description="Tejas Academy of Excellence is a premier institution for modern education, providing world-class programs."
      />
      <SmoothScroll />
      <Routes>
      {/* Admin Dashboard Routes (Isolated Layout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        
        {/* Analytics Routes */}
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="analytics/faculty" element={<FacultyAnalytics />} />
        <Route path="analytics/management" element={<ManagementAnalytics />} />
        <Route path="audit-logs" element={<AuditLogConsole />} />
        <Route path="history" element={<AuditLogConsole />} />
        
        {/* CMS Engine Routes */}
        <Route path="cms" element={<CMSLayout />}>
          <Route index element={<ManageCMSPages />} />
          <Route path="pages" element={<ManageCMSPages />} />
          <Route path="pages/:slug" element={<PageEditor />} />
          <Route path="social-links" element={<ManageSocialLinks />} />
          <Route path="settings" element={<ManageSettings />} />
          <Route path="media" element={<ManageMediaLibrary />} />
          <Route path="history" element={<AuditLogConsole />} />
        </Route>

        {/* Direct Route Aliases */}
        <Route path="pages" element={<ManageCMSPages />} />
        <Route path="pages/:slug" element={<PageEditor />} />
        <Route path="media" element={<ManageMediaLibrary />} />
        <Route path="settings" element={<ManageSettings />} />
        <Route path="faq" element={<ManageFAQ />} />
        <Route path="faqs" element={<ManageFAQ />} />
        <Route path="seo" element={<ManageSEO />} />
        <Route path="campus" element={<ManageCampus />} />
        <Route path="careers" element={<ManageCareers />} />
        <Route path="legal" element={<ManageLegal />} />
        <Route path="notifications" element={<ManageNotifications />} />
        <Route path="navigation" element={<ManageNavigation />} />
        <Route path="exit-intent" element={<ManageExitIntent />} />
        <Route path="social-proof" element={<ManageSocialProof />} />
        <Route path="quick-connect" element={<ManageQuickConnect />} />

        <Route path="roles" element={<ManageRolesPermissions />} />
        <Route path="permissions" element={<ManageRolesPermissions />} />
        <Route path="leads" element={<ManageLeadsCRM />} />
        <Route path="campaigns" element={<ManageEmailCampaigns />} />
        <Route path="broadcasts" element={<ManageEmailCampaigns />} />
        <Route path="backups" element={<ManageBackups />} />

        <Route path="students" element={<ManageStudents />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="users" element={<ManageStudents />} />
        <Route path="users/:id" element={<StudentProfile />} />

        <Route path="admissions" element={<ManageAdmissions />} />
        <Route path="admissions/:id" element={<ApplicationDetails />} />
        <Route path="applications" element={<ManageAdmissions />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />

        <Route path="inquiries" element={<ManageInquiries />} />
        <Route path="inquiry" element={<ManageInquiries />} />

        <Route path="programs" element={<ManagePrograms />} />
        <Route path="programs/new" element={<ProgramForm />} />
        <Route path="programs/:id/edit" element={<ProgramForm />} />

        <Route path="mentors" element={<ManageMentors />} />
        <Route path="mentors/new" element={<MentorForm />} />
        <Route path="mentors/:id/edit" element={<MentorForm />} />

        <Route path="courses" element={<ManageCourses />} />
        <Route path="courses/new" element={<CourseForm />} />
        <Route path="courses/:id/edit" element={<CourseForm />} />

        <Route path="events" element={<ManageEvents />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id/edit" element={<EventForm />} />

        <Route path="workshops" element={<ManageWorkshops />} />
        <Route path="workshops/new" element={<WorkshopForm />} />
        <Route path="workshops/:id/edit" element={<WorkshopForm />} />

        <Route path="insights" element={<ManageInsights />} />
        <Route path="insights/new" element={<InsightForm />} />
        <Route path="insights/:id/edit" element={<InsightForm />} />

        <Route path="blogs" element={<ManageInsights />} />
        <Route path="blogs/new" element={<InsightForm />} />
        <Route path="blogs/:id/edit" element={<InsightForm />} />

        <Route path="gallery" element={<ManageGallery />} />
        <Route path="testimonials" element={<ManageTestimonials />} />
        <Route path="newsletter" element={<ManageNewsletter />} />
        
        {/* CMS Sub-routes */}
        <Route path="cms/homepage" element={<ManageHomepage />} />
        <Route path="cms/about" element={<ManageAbout />} />
        <Route path="cms/for-institutions" element={<ManageForInstitutions />} />
        <Route path="cms/pages/for-institutions" element={<ManageForInstitutions />} />
        <Route path="cms/recognitions" element={<ManageRecognitions />} />
        <Route path="cms/pages/recognitions" element={<ManageRecognitions />} />
        <Route path="cms/free-programs" element={<ManageFreePrograms />} />
        <Route path="cms/pages/free-programs" element={<ManageFreePrograms />} />
        <Route path="cms/vision-mission" element={<ManageVisionMission />} />
        <Route path="cms/pages/vision-mission" element={<ManageVisionMission />} />
        <Route path="cms/resources" element={<ManageResources />} />
        <Route path="cms/pages/resources" element={<ManageResources />} />
        <Route path="cms/contact" element={<ManageContact />} />
        <Route path="cms/pages/contact" element={<ManageContact />} />
        <Route path="cms/campus" element={<ManageCampus />} />
        <Route path="cms/careers" element={<ManageCareers />} />
        <Route path="cms/legal" element={<ManageLegal />} />
        <Route path="cms/seo" element={<ManageSEO />} />
        <Route path="cms/settings" element={<ManageSettings />} />
        <Route path="cms/notifications" element={<ManageNotifications />} />
        <Route path="cms/faq" element={<ManageFAQ />} />
        <Route path="cms/navigation" element={<ManageNavigation />} />
        <Route path="cms/exit-intent" element={<ManageExitIntent />} />
        <Route path="cms/social-proof" element={<ManageSocialProof />} />
        <Route path="cms/social-links" element={<ManageSocialLinks />} />
        <Route path="cms/quick-connect" element={<ManageQuickConnect />} />
      </Route>

      {/* Public Routes & Student Dashboard (Public Layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty', 'admin', 'super_admin']}><FacultyDashboard /></ProtectedRoute>} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/vision-mission" element={<VisionMission />} />
        <Route path="/about/campus" element={<Campus />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetails />} />
        <Route path="/free-programs" element={<FreePrograms />} />
        <Route path="/for-institutions" element={<ForInstitutions />} />
        <Route path="/recognitions" element={<Recognitions />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/insights" element={<TejasInsights />} />
        <Route path="/insights/:slug" element={<InsightDetails />} />
        <Route path="/blog" element={<TejasInsights />} />
        <Route path="/blog/:slug" element={<InsightDetails />} />
        <Route path="/blogs" element={<TejasInsights />} />
        <Route path="/blogs/:slug" element={<InsightDetails />} />

        {/* Topic Cluster SEO Routes */}
        <Route path="/business-entrepreneurship" element={<BusinessEntrepreneurship />} />
        <Route path="/entrepreneurship-programs" element={<BusinessEntrepreneurship />} />
        <Route path="/leadership-development" element={<LeadershipDevelopment />} />
        <Route path="/ai-literacy" element={<AILiteracy />} />
        <Route path="/future-skills" element={<FutureSkills />} />
        <Route path="/career-readiness" element={<CareerReadiness />} />
        <Route path="/employability-skills" element={<EmployabilitySkills />} />
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/human-excellence" element={<HumanExcellence />} />
        <Route path="/student-development" element={<StudentDevelopment />} />
        <Route path="/professional-development" element={<ProfessionalDevelopment />} />
        <Route path="/programs/students" element={<Programs />} />
        <Route path="/programs/professionals" element={<Programs />} />
        <Route path="/programs/entrepreneurs" element={<Programs />} />

        <Route path="/resources" element={<Resources />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
    </>
  );
}

export default App;
