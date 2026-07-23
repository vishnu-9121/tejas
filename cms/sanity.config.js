import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { deskStructure } from './deskStructure';

export default defineConfig({
  name: 'tejas-academy-enterprise-studio',
  title: 'Tejas Academy of Excellence Studio',
  projectId: process.env.VITE_SANITY_PROJECT_ID || '6nl927hv',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  plugins: [
    deskTool({
      structure: deskStructure
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes,
  },
});
