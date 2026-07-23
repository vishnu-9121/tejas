import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const AuthLayout = ({ children, title, subtitle, imageSrc, imageQuote, quoteAuthor }) => {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 md:px-24 py-8 lg:py-12 justify-between">
        <header>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </header>

        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto my-12"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/">
              <img src="/logo.png" alt="Tejas Academy of Excellence Logo" className="h-16 w-auto mb-6 mx-auto lg:mx-0 object-contain" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-3">{title}</h1>
            <p className="text-gray-500 text-base">{subtitle}</p>
          </div>
          
          {children}
        </motion.main>

        <footer className="text-center lg:text-left">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.</p>
        </footer>
      </div>

      {/* Right Image Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 relative overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt="Campus Life" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700" />
        )}
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white w-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-xl"
          >
            <h2 className="text-3xl font-serif leading-snug mb-4">
              "{imageQuote || 'Excellence is not a singular act, but a habit. You are what you repeatedly do.'}"
            </h2>
            <p className="text-lg text-gray-300 font-medium">
              — {quoteAuthor || 'Tejas Vision'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
