import React from 'react';
import { motion } from 'framer-motion';

export default function FacultyBlock({ data }) {
  const { title, subtitle, facultyList = [] } = data;

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title || 'World-Class Faculty'}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {facultyList.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img src={member.image || 'https://via.placeholder.com/200'} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-primary-600 mb-2">{member.designation}</p>
              <p className="text-sm text-gray-500">{member.department}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
