import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import StatsBlock from './blocks/StatsBlock';
import FacultyBlock from './blocks/FacultyBlock';
import ProgramsBlock from './blocks/ProgramsBlock';
import CallToActionBlock from './blocks/CallToActionBlock';

const registry = {
  HeroBlock,
  StatsBlock,
  FacultyBlock,
  ProgramsBlock,
  CallToActionBlock
};

/**
 * The BlockRenderer takes an array of JSON blocks from the CMS API
 * and maps them to their respective React components.
 */
export const BlockRenderer = ({ blocks = [] }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.filter(b => b.isActive).map((block, index) => {
        const Component = registry[block.type];
        if (!Component) {
          console.warn(`CMS Warning: Block type "${block.type}" is not registered.`);
          return null;
        }
        return <Component key={index} data={block.data} />;
      })}
    </>
  );
};
