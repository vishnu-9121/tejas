import React from "react";
import { Button } from "../ui/Button";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    alt: "Seminar Hall",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    alt: "Classroom collaboration",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    alt: "Presentation setup",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
    alt: "Team workshop",
    span: "md:col-span-2 md:row-span-1",
  },
];

export function GallerySection() {
  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Campus Life
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          Vibrant Campus Environments
        </h2>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full select-none">
          {IMAGES.map((img) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-lg border border-neutral-200 aspect-[4/3] bg-neutral-100 group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => window.location.href = "/gallery"}
          className="mt-12 font-semibold"
        >
          View Full Gallery
        </Button>
      </div>
    </section>
  );
}
