import { Program } from '../models/Program.js';
import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';
import Blog from '../models/Blog.js';
import { Event } from '../models/Event.js';
import { Gallery } from '../models/Gallery.js';
import { Admission } from '../models/Admission.js';
import { Course } from '../models/Course.js';
import { ContentPage } from '../models/ContentPage.js';
import { SearchLog } from '../models/SearchLog.js';

/**
 * POST /api/v1/search
 * Global Unified Search — searches across all platform entities in parallel
 */
export const globalSearch = async (req, res) => {
  try {
    const { q, category, limit = 5 } = req.body;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters.' });
    }

    const regex = new RegExp(q.trim(), 'i');
    const searchLimit = Math.min(parseInt(limit), 10);

    // Build category-specific or full search
    const searches = {};

    const shouldSearch = (cat) => !category || category === 'all' || category === cat;

    if (shouldSearch('programs')) {
      searches.programs = Program.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }]
      }).select('title category slug duration thumbnail').limit(searchLimit).lean();
    }

    if (shouldSearch('courses')) {
      searches.courses = Course.find({
        $or: [{ title: regex }, { description: regex }]
      }).select('title description').limit(searchLimit).lean();
    }

    if (shouldSearch('faculty')) {
      searches.faculty = User.find({
        role: { $in: ['faculty', 'mentor'] },
        $or: [{ name: regex }, { email: regex }]
      }).select('name email role avatar').limit(searchLimit).lean();
    }

    if (shouldSearch('mentors')) {
      searches.mentors = MentorProfile.find({
        $or: [{ company: regex }, { designation: regex }]
      }).populate('user', 'name avatar').limit(searchLimit).lean();
    }

    if (shouldSearch('blogs')) {
      searches.blogs = Blog.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }]
      }).select('title slug excerpt thumbnail createdAt').limit(searchLimit).lean();
    }

    if (shouldSearch('events')) {
      searches.events = Event.find({
        $or: [{ title: regex }, { description: regex }, { location: regex }]
      }).select('title date location thumbnail').limit(searchLimit).lean();
    }

    if (shouldSearch('gallery')) {
      searches.gallery = Gallery.find({
        $or: [{ title: regex }, { category: regex }, { description: regex }]
      }).select('title category imageUrl').limit(searchLimit).lean();
    }

    // Admin-only searches
    if (req.user?.role === 'admin' || req.user?.role === 'super_admin') {
      if (shouldSearch('students')) {
        searches.students = User.find({
          role: 'student',
          $or: [{ name: regex }, { email: regex }]
        }).select('name email avatar').limit(searchLimit).lean();
      }

      if (shouldSearch('applications')) {
        searches.applications = Admission.find({
          $or: [{ studentName: regex }, { programName: regex }, { email: regex }]
        }).select('studentName programName status createdAt').limit(searchLimit).lean();
      }

      if (shouldSearch('cms')) {
        searches.cms = ContentPage.find({
          $or: [{ title: regex }, { slug: regex }]
        }).select('title slug status').limit(searchLimit).lean();
      }
    }

    // Execute all searches in parallel
    const keys = Object.keys(searches);
    const results = await Promise.all(Object.values(searches));

    const grouped = {};
    let totalResults = 0;
    keys.forEach((key, i) => {
      grouped[key] = results[i].map(item => ({
        ...item,
        _category: key
      }));
      totalResults += results[i].length;
    });

    // Log the search for analytics (fire-and-forget)
    SearchLog.create({
      query: q.trim(),
      userId: req.user?.id || null,
      resultsCount: totalResults,
      filters: { category: category || 'all' }
    }).catch(() => {});

    res.status(200).json({
      success: true,
      data: grouped,
      totalResults,
      query: q.trim()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/search/suggestions
 * Returns popular and recent searches
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    // Popular searches (top 10 by frequency)
    const popular = await SearchLog.aggregate([
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent searches by this user (if authenticated)
    let recent = [];
    if (req.user?.id) {
      recent = await SearchLog.find({ userId: req.user.id })
        .sort('-createdAt')
        .limit(5)
        .select('query createdAt')
        .lean();
    }

    res.status(200).json({
      success: true,
      data: {
        popular: popular.map(p => ({ query: p._id, count: p.count })),
        recent: recent.map(r => ({ query: r.query, date: r.createdAt }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
