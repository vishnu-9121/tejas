import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './frontend/src/sanity/schemas';

export default defineConfig({
  name: 'tejas-academy-studio',
  title: 'Tejas Academy of Excellence Studio',
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'tejas_academy',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
