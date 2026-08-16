import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, Upload, 
  Image as ImageIcon, FileText, CheckCircle2, AlertCircle, Eye, Link as LinkIcon,
  Check, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

import { programService } from '@/services/programService';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

export default function ProgramForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const posterFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);

  // Fetch program data if editing
  const { data: programData, isLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => programService.getProgramById(id),
    enabled: isEditing,
  });

  // Fetch dropdown options for faculty and mentors
  const { data: facultyData } = useQuery({
    queryKey: ['faculty-list'],
    queryFn: () => api.get('/faculty').then(res => res.data).catch(() => ({ data: { faculty: [] } })),
  });

  const { data: mentorData } = useQuery({
    queryKey: ['mentor-list'],
    queryFn: () => api.get('/mentors').then(res => res.data).catch(() => ({ data: { mentors: [] } })),
  });

  const facultyOptions = facultyData?.data?.faculty || [];
  const mentorOptions = mentorData?.data?.mentors || [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'Undergraduate',
      degreeLevel: 'Undergraduate',
      shortDescription: '',
      description: '',
      overview: '',
      duration: '4 Years',
      fees: 1200000,
      eligibility: '10+2 with minimum 60% aggregate',
      intake: 60,
      mode: 'On-Campus',
      posterImage: '',
      thumbnailUrl: '',
      bannerUrl: '',
      brochureUrl: '',
      curriculum: [
        { semester: 'Semester 1', courses: 'Applied Mathematics, Python Programming, Digital Systems' },
        { semester: 'Semester 2', courses: 'Data Structures & Algorithms, Discrete Math, Database Systems' }
      ],
      highlights: '100% Placement Assistance\nIndustry Mentorship from Fortune 500 Leaders\nState-of-the-Art AI Research Labs',
      learningOutcomes: 'Master full-stack and modern software engineering\nBuild production-ready machine learning models\nGain real-world internship and capstone project experience',
      careerOpportunities: 'AI Engineer\nSoftware Architect\nData Scientist\nProduct Specialist',
      faqs: [
        { question: 'What are the eligibility criteria?', answer: 'Candidates must have completed 10+2 or equivalent with minimum 60% marks.' },
        { question: 'Is installment payment available?', answer: 'Yes, flexible semester-wise installment options and scholarships are available.' }
      ],
      seo: { metaTitle: '', metaDescription: '', keywords: '' },
      status: 'Published',
      isFeatured: true,
      facultyMapping: [],
      mentorMapping: [],
    }
  });

  const posterImageValue = watch('posterImage');
  const bannerUrlValue = watch('bannerUrl');
  const selectedFaculty = watch('facultyMapping') || [];
  const selectedMentors = watch('mentorMapping') || [];

  const { fields: curriculumFields, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({
    control,
    name: "curriculum"
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs"
  });

  useEffect(() => {
    if (programData?.data) {
      const p = programData.data;
      reset({
        title: p.title || '',
        category: p.category || 'Undergraduate',
        degreeLevel: p.degreeLevel || 'Undergraduate',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        overview: p.overview || '',
        duration: p.duration || '1 Year',
        fees: p.fees !== undefined ? p.fees : (p.pricing?.totalFee || 0),
        eligibility: p.eligibility || '',
        intake: p.intake || 60,
        mode: p.mode || 'On-Campus',
        status: p.status || (p.isActive ? 'Published' : 'Draft'),
        isFeatured: p.isFeatured || false,
        posterImage: p.posterImage || p.poster || p.featuredImage || p.thumbnailUrl || '',
        thumbnailUrl: p.thumbnailUrl || p.posterImage || '',
        bannerUrl: p.bannerUrl || '',
        brochureUrl: p.brochureUrl || p.brochure || '',
        highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : (p.highlights || ''),
        learningOutcomes: Array.isArray(p.learningOutcomes) ? p.learningOutcomes.join('\n') : (p.learningOutcomes || ''),
        careerOpportunities: Array.isArray(p.careerOpportunities) ? p.careerOpportunities.join('\n') : (p.careerOpportunities || ''),
        seo: p.seo || { metaTitle: '', metaDescription: '', keywords: '' },
        facultyMapping: (p.facultyMapping || []).map(f => typeof f === 'object' ? f._id : f),
        mentorMapping: (p.mentorMapping || []).map(m => typeof m === 'object' ? m._id : m),
        curriculum: p.curriculum?.map(c => ({
          semester: c.semester || '',
          courses: Array.isArray(c.courses) ? c.courses.join(', ') : (c.courses || '')
        })) || [],
        faqs: p.faqs || [],
      });
    }
  }, [programData, reset]);

  // Handle Poster Image Upload
  const handleFileUpload = async (e, fieldName, setUploading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be under 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data?.data?.url || res.data?.url;
      if (uploadedUrl) {
        setValue(fieldName, uploadedUrl, { shouldValidate: true, shouldDirty: true });
        if (fieldName === 'posterImage') {
          setValue('thumbnailUrl', uploadedUrl);
        }
        toast.success(`${fieldName === 'posterImage' ? 'Poster' : 'Banner'} uploaded successfully!`);
      } else {
        throw new Error('Upload URL not returned');
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(fieldName, reader.result, { shouldValidate: true, shouldDirty: true });
        if (fieldName === 'posterImage') {
          setValue('thumbnailUrl', reader.result);
        }
        toast.success(`${fieldName === 'posterImage' ? 'Poster' : 'Banner'} loaded successfully!`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const toggleFacultySelection = (facultyId) => {
    const current = [...selectedFaculty];
    const index = current.indexOf(facultyId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(facultyId);
    }
    setValue('facultyMapping', current, { shouldDirty: true });
  };

  const toggleMentorSelection = (mentorId) => {
    const current = [...selectedMentors];
    const index = current.indexOf(mentorId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(mentorId);
    }
    setValue('mentorMapping', current, { shouldDirty: true });
  };

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? programService.updateProgram(id, data) : programService.createProgram(data),
    onSuccess: (res) => {
      toast.success(isEditing ? 'Program updated successfully!' : 'Program published successfully!');
      queryClient.invalidateQueries(['programs']);
      queryClient.invalidateQueries(['admin-programs']);
      queryClient.invalidateQueries(['public-programs']);
      queryClient.invalidateQueries(['program', id]);
      navigate('/admin/programs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save program. Please check required fields.');
    }
  });

  const onSubmit = (formData) => {
    if (!formData.title?.trim()) {
      setActiveTab('basic');
      toast.error('Program title is required');
      return;
    }

    const formattedData = {
      ...formData,
      fees: Number(formData.fees) || 0,
      intake: Number(formData.intake) || 60,
      isActive: formData.status === 'Published',
      shortDescription: formData.shortDescription || formData.description?.substring(0, 160) || '',
      description: formData.description || formData.overview || '',
      overview: formData.overview || formData.description || '',
      posterImage: formData.posterImage || formData.thumbnailUrl || '',
      thumbnailUrl: formData.posterImage || formData.thumbnailUrl || '',
      bannerUrl: formData.bannerUrl || '',
      brochureUrl: formData.brochureUrl || '',
      highlights: typeof formData.highlights === 'string'
        ? formData.highlights.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(formData.highlights) ? formData.highlights : []),
      learningOutcomes: typeof formData.learningOutcomes === 'string'
        ? formData.learningOutcomes.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(formData.learningOutcomes) ? formData.learningOutcomes : []),
      careerOpportunities: typeof formData.careerOpportunities === 'string'
        ? formData.careerOpportunities.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(formData.careerOpportunities) ? formData.careerOpportunities : []),
      facultyMapping: formData.facultyMapping || [],
      mentorMapping: formData.mentorMapping || [],
      curriculum: (formData.curriculum || []).map(c => ({
        semester: c.semester || '',
        courses: typeof c.courses === 'string'
          ? c.courses.split(',').map(course => course.trim()).filter(Boolean)
          : (Array.isArray(c.courses) ? c.courses : [])
      })).filter(c => c.semester || (c.courses && c.courses.length > 0)),
      faqs: (formData.faqs || []).filter(f => f.question?.trim() && f.answer?.trim()),
      seo: {
        metaTitle: formData.seo?.metaTitle || `${formData.title} | Tejas Academy`,
        metaDescription: formData.seo?.metaDescription || formData.shortDescription || '',
        keywords: formData.seo?.keywords || ''
      }
    };

    mutation.mutate(formattedData);
  };

  const onError = (formErrors) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      if (['title', 'category', 'duration', 'fees', 'intake', 'eligibility'].some(k => errorKeys.includes(k))) {
        setActiveTab('basic');
      } else if (['posterImage', 'bannerUrl', 'shortDescription', 'description'].some(k => errorKeys.includes(k))) {
        setActiveTab('media');
      } else if (errorKeys.includes('curriculum')) {
        setActiveTab('curriculum');
      } else if (['overview', 'highlights', 'learningOutcomes', 'careerOpportunities'].some(k => errorKeys.includes(k))) {
        setActiveTab('outcomes');
      } else if (errorKeys.includes('facultyMapping') || errorKeys.includes('mentorMapping')) {
        setActiveTab('relationships');
      } else if (['seo', 'faqs'].some(k => errorKeys.includes(k))) {
        setActiveTab('seo');
      }
      toast.error('Please complete all required fields indicated in red.');
    }
  };

  const tabs = [
    { id: 'basic', label: '1. Basic Details' },
    { id: 'media', label: '2. Poster & Media' },
    { id: 'curriculum', label: '3. Curriculum' },
    { id: 'outcomes', label: '4. Highlights & Outcomes' },
    { id: 'relationships', label: '5. Mentors & Faculty' },
    { id: 'seo', label: '6. SEO & FAQs' },
  ];

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 font-medium">Loading program specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" as={Link} to="/admin/programs" className="p-2 border border-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Academic Program' : 'Create New Academic Program'}
              </h1>
              <Badge variant={watch('status') === 'Published' ? 'success' : 'default'}>
                {watch('status')}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Configure curriculum structure, admissions parameters, poster graphics, and SEO metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" as={Link} to="/admin/programs">
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            disabled={isSubmitting || mutation.isPending}
            onClick={handleSubmit(onSubmit, onError)}
            className="flex items-center gap-2 shadow-md shadow-primary-600/20"
          >
            <Save className="w-4 h-4" />
            {isSubmitting || mutation.isPending ? 'Saving...' : (isEditing ? 'Update Program' : 'Publish Program')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-6 pt-3" />
          </div>

          <div className="p-6 md:p-8">
            
            {/* TAB 1: BASIC DETAILS */}
            <div className={activeTab === 'basic' ? 'space-y-6' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Program Title <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    {...register('title', { required: 'Program title is required' })} 
                    placeholder="e.g. B.Tech in Artificial Intelligence & Data Science" 
                    className="text-base font-medium"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    {...register('category')} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                  >
                    <option value="Undergraduate">Undergraduate Degree</option>
                    <option value="Postgraduate">Postgraduate Degree</option>
                    <option value="Executive">Executive Leadership</option>
                    <option value="Certification">Professional Certification</option>
                    <option value="Engineering">Engineering & Technology</option>
                    <option value="Management">Management & Business</option>
                    <option value="Data Science">Data Science & AI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Degree / Academic Level
                  </label>
                  <select 
                    {...register('degreeLevel')} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                  >
                    <option value="Undergraduate">Bachelor's (Undergraduate)</option>
                    <option value="Postgraduate">Master's (Postgraduate)</option>
                    <option value="Executive">Executive Diploma</option>
                    <option value="Certification">Certificate Program</option>
                    <option value="Doctorate">Doctorate / Ph.D.</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <Input {...register('duration')} placeholder="e.g. 4 Years (8 Semesters)" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Total Fees (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number" 
                    {...register('fees', { valueAsNumber: true })} 
                    placeholder="e.g. 1200000" 
                  />
                  <span className="text-xs text-gray-400">Total program tuition fee in Indian Rupees</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Intake / Total Seats <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number" 
                    {...register('intake', { valueAsNumber: true })} 
                    placeholder="e.g. 60" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">
                    Mode of Instruction
                  </label>
                  <select 
                    {...register('mode')} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                  >
                    <option value="On-Campus">On-Campus (Classroom & Labs)</option>
                    <option value="Hybrid">Hybrid (Classroom + Online)</option>
                    <option value="Online">100% Online</option>
                    <option value="Distance Learning">Distance Learning</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Eligibility Criteria <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    {...register('eligibility')} 
                    placeholder="e.g. 10+2 with Physics, Mathematics, and Chemistry with minimum 60% aggregate" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Publication Status</label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                  >
                    <option value="Published">Published (Live on Website)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex items-center justify-between p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block">Featured on Homepage</label>
                    <span className="text-xs text-gray-600">Showcase this program in top recommendations</span>
                  </div>
                  <input 
                    type="checkbox" 
                    {...register('isFeatured')} 
                    className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* TAB 2: POSTER & MEDIA UPLOAD */}
            <div className={activeTab === 'media' ? 'space-y-8' : 'hidden'}>
              {/* Program Poster / Featured Image */}
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary-600" />
                      Program Poster / Card Cover Image
                    </h3>
                    <p className="text-xs text-gray-500">
                      Uploaded poster will display on catalog cards, admissions modal, and program overview.
                    </p>
                  </div>
                  {posterImageValue && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Poster Attached
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Poster Preview */}
                  <div className="w-full h-56 bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center relative shadow-sm">
                    {posterImageValue ? (
                      <>
                        <img 
                          src={posterImageValue} 
                          alt="Poster Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => { setValue('posterImage', ''); setValue('thumbnailUrl', ''); }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                          title="Remove Poster"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-medium">No poster selected</p>
                        <p className="text-[11px] text-gray-400">Recommended: 800x600 px</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls & URL */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <input 
                        type="file" 
                        ref={posterFileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'posterImage', setUploadingPoster)} 
                      />
                      <Button 
                        type="button" 
                        variant="primary" 
                        size="sm" 
                        disabled={uploadingPoster}
                        onClick={() => posterFileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingPoster ? 'Uploading Poster...' : 'Upload Poster Image'}
                      </Button>

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setValue('posterImage', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80')}
                      >
                        Tech Preset
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setValue('posterImage', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80')}
                      >
                        Business Preset
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setValue('posterImage', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80')}
                      >
                        AI / Data Preset
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5" /> Or Paste Direct Poster Image URL
                      </label>
                      <Input 
                        {...register('posterImage')} 
                        placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..." 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Banner, Brochure & Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-900">Hero Banner URL</label>
                    <input 
                      type="file" 
                      ref={bannerFileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, 'bannerUrl', setUploadingBanner)} 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      disabled={uploadingBanner}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                    </Button>
                  </div>
                  <Input {...register('bannerUrl')} placeholder="https://... (Wide hero banner)" />
                  {bannerUrlValue && (
                    <div className="h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={bannerUrlValue} alt="Banner Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600" />
                    Program Brochure (PDF / Download Link)
                  </label>
                  <Input {...register('brochureUrl')} placeholder="https://... (Link to prospectus PDF)" />
                  <p className="text-xs text-gray-500">
                    Provides a direct "Download Curriculum" button for students on the website.
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Short Card Teaser Description (Displayed on cards) <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    {...register('shortDescription')} 
                    rows={2} 
                    placeholder="Concise 2-sentence summary displayed on cards across the website..." 
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Main Program Description (Displayed in Header / Meta)
                  </label>
                  <Textarea 
                    {...register('description')} 
                    rows={3} 
                    placeholder="Full introduction to the academic program and its mission..." 
                  />
                </div>
              </div>
            </div>

            {/* TAB 3: CURRICULUM BUILDER */}
            <div className={activeTab === 'curriculum' ? 'space-y-6' : 'hidden'}>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Curriculum & Semester Plan</h3>
                  <p className="text-xs text-gray-500">Organize courses by semester, term, or module.</p>
                </div>
                <Button 
                  type="button" 
                  variant="primary" 
                  size="sm" 
                  onClick={() => appendCurriculum({ semester: `Semester ${curriculumFields.length + 1}`, courses: '' })}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Semester/Term
                </Button>
              </div>

              {curriculumFields.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 space-y-3">
                  <p className="text-sm font-medium">No semesters added yet.</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendCurriculum({ semester: 'Semester 1', courses: 'Foundations of AI, Python, Linear Algebra' })}
                  >
                    Add First Semester
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {curriculumFields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50/70 flex gap-4 items-start">
                      <div className="mt-3 text-gray-400 cursor-grab">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Semester / Term Title</label>
                          <Input 
                            {...register(`curriculum.${index}.semester`)} 
                            placeholder="e.g. Semester 1 (Foundations)" 
                            className="bg-white" 
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-gray-700">Course List (Comma Separated)</label>
                          <Input 
                            {...register(`curriculum.${index}.courses`)} 
                            placeholder="e.g. Machine Learning, Cloud Architecture, Ethics in AI" 
                            className="bg-white" 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeCurriculum(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Semester"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAB 4: HIGHLIGHTS & OUTCOMES */}
            <div className={activeTab === 'outcomes' ? 'space-y-6' : 'hidden'}>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-800">
                    Comprehensive Program Overview (Detailed In-Depth Web Section)
                  </label>
                  <Textarea 
                    {...register('overview')} 
                    rows={6} 
                    placeholder="Provide an in-depth explanation of the academic program, pedagogy, laboratory infrastructure, and research..." 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-800">
                      Key Highlights (One per line)
                    </label>
                    <Textarea 
                      {...register('highlights')} 
                      rows={5} 
                      placeholder="100% Placement Support&#10;Industry-Recognized Global Certification&#10;Hands-On Live Capstone Projects" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-800">
                      Learning Outcomes (One per line)
                    </label>
                    <Textarea 
                      {...register('learningOutcomes')} 
                      rows={5} 
                      placeholder="Master modern software development&#10;Design scalable cloud infrastructures&#10;Develop strong business acumen" 
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-800">
                      Career Opportunities & Roles (One per line)
                    </label>
                    <Textarea 
                      {...register('careerOpportunities')} 
                      rows={4} 
                      placeholder="AI Solutions Architect&#10;Lead Data Scientist&#10;Enterprise Product Manager" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 5: MENTORS & FACULTY */}
            <div className={activeTab === 'relationships' ? 'space-y-6' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Faculty Selection */}
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary-600" />
                        Map Faculty Members
                      </h3>
                      <p className="text-xs text-gray-500">Click to select faculty teaching this program</p>
                    </div>
                    <Badge variant="primary">{selectedFaculty.length} Selected</Badge>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {facultyOptions.length === 0 ? (
                      <p className="text-xs text-gray-400 py-4 text-center">No faculty members found in directory.</p>
                    ) : (
                      facultyOptions.map(faculty => {
                        const isSelected = selectedFaculty.includes(faculty._id);
                        return (
                          <button
                            key={faculty._id}
                            type="button"
                            onClick={() => toggleFacultySelection(faculty._id)}
                            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-primary-50/80 border-primary-300 text-primary-900 font-semibold'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {isSelected ? <Check className="w-3.5 h-3.5" /> : (faculty.firstName?.[0] || 'F')}
                              </div>
                              <span className="text-sm">
                                {faculty.firstName} {faculty.lastName}
                                <span className="text-xs text-gray-400 font-normal ml-2">({faculty.department || 'Faculty'})</span>
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Mentor Selection */}
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        Map Industry Mentors
                      </h3>
                      <p className="text-xs text-gray-500">Click to attach industry leaders as mentors</p>
                    </div>
                    <Badge variant="success">{selectedMentors.length} Selected</Badge>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {mentorOptions.length === 0 ? (
                      <p className="text-xs text-gray-400 py-4 text-center">No industry mentors found in directory.</p>
                    ) : (
                      mentorOptions.map(mentor => {
                        const isSelected = selectedMentors.includes(mentor._id);
                        return (
                          <button
                            key={mentor._id}
                            type="button"
                            onClick={() => toggleMentorSelection(mentor._id)}
                            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {isSelected ? <Check className="w-3.5 h-3.5" /> : (mentor.name?.[0] || 'M')}
                              </div>
                              <span className="text-sm">
                                {mentor.name || `${mentor.firstName} ${mentor.lastName}`}
                                <span className="text-xs text-gray-400 font-normal ml-2">({mentor.company || mentor.role || 'Mentor'})</span>
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 6: SEO & FAQS */}
            <div className={activeTab === 'seo' ? 'space-y-8' : 'hidden'}>
              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b pb-2">Search Engine Optimization (SEO)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Meta Title</label>
                    <Input {...register('seo.metaTitle')} placeholder="e.g. Best B.Tech in AI & Data Science in India | Tejas" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Meta Keywords</label>
                    <Input {...register('seo.keywords')} placeholder="e.g. BTech AI, Data Science Degree, Tejas Admissions" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-800">Meta Description</label>
                    <Textarea {...register('seo.metaDescription')} rows={2} placeholder="Search snippet description for Google..." />
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
                    <p className="text-xs text-gray-500">Provide direct answers for prospective applicants.</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendFaq({ question: '', answer: '' })}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </Button>
                </div>

                <div className="space-y-4">
                  {faqFields.map((field, index) => (
                    <div key={field.id} className="p-5 bg-gray-50 border border-gray-200 rounded-xl flex gap-4 items-start">
                      <div className="flex-grow space-y-3">
                        <Input 
                          {...register(`faqs.${index}.question`)} 
                          placeholder="Question (e.g. What scholarships are offered?)" 
                          className="bg-white font-medium"
                        />
                        <Textarea 
                          {...register(`faqs.${index}.answer`)} 
                          rows={2} 
                          placeholder="Answer details..." 
                          className="bg-white"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFaq(index)}
                        className="mt-2 p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg md:pl-64 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <span className="text-xs font-bold text-gray-800">{watch('status')}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" as={Link} to="/admin/programs">
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setValue('status', 'Draft');
                handleSubmit(onSubmit, onError)();
              }}
              disabled={isSubmitting || mutation.isPending}
            >
              Save as Draft
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting || mutation.isPending} 
              className="min-w-[150px] shadow-md shadow-primary-600/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting || mutation.isPending ? 'Saving...' : (isEditing ? 'Update Program' : 'Publish Program')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
