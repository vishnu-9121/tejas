// backend/routes/inquiriesRoutes.js
\nconst router = express.Router();\n\n// New route for contact form submissions\nrouter.post(/contact, createInquiry);\n\n// Other existing routes remain the same
router.post(/, createInquiry);
router.get(/, protect, authorize(admin, super_admin), getInquiries);
router.put(/:id, protect, authorize(admin, super_admin), updateInquiry);\n\nexport { router as inquiriesRoutes };
