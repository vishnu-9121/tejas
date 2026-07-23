import express from 'express';
import { globalSearch, getSearchSuggestions } from '../controllers/searchController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', optionalAuth, globalSearch);
router.get('/suggestions', optionalAuth, getSearchSuggestions);

export default router;
