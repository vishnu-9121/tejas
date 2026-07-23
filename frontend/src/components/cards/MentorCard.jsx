import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";

export const MentorCard = ({ name, title, company, bio, image, slug, socialLinks = {} }) => {
  return (
    <div className="group flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-neutral-400">
            No Image
          </div>
        )}
        {/* Social Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {socialLinks?.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-neutral-600 hover:text-blue-600 hover:bg-white shadow-sm transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {socialLinks?.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-neutral-600 hover:text-blue-400 hover:bg-white shadow-sm transition-colors">
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
            {name}
          </h3>
          <p className="text-sm font-medium text-accent-600 mt-1">{title}</p>
          {company && <p className="text-sm text-neutral-500">{company}</p>}
        </div>
        <p className="text-sm text-neutral-600 line-clamp-3 mb-6 flex-1">
          {bio}
        </p>
        <Link
          to={`/mentors/${slug}`}
          className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center group-hover:underline"
        >
          View Profile <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
};
