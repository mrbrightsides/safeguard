import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Wind, 
  Headphones, 
  Play, 
  Clock, 
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Resource {
  id: string;
  title: string;
  category: 'Article' | 'Exercise' | 'Audio';
  duration: string;
  image: string;
  description: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Box Breathing Technique',
    category: 'Exercise',
    duration: '5 min',
    image: 'https://picsum.photos/seed/breath/400/250',
    description: 'A powerful technique to calm your nervous system instantly.'
  },
  {
    id: '2',
    title: 'Managing Workplace Burnout',
    category: 'Article',
    duration: '8 min read',
    image: 'https://picsum.photos/seed/work/400/250',
    description: 'Identify the early signs of burnout and how to recover effectively.'
  },
  {
    id: '3',
    title: 'Deep Sleep Meditation',
    category: 'Audio',
    duration: '15 min',
    image: 'https://picsum.photos/seed/sleep/400/250',
    description: 'Guided meditation to help you unwind after a high-stress shift.'
  },
  {
    id: '4',
    title: 'Cognitive Reframing',
    category: 'Article',
    duration: '10 min read',
    image: 'https://picsum.photos/seed/mind/400/250',
    description: 'Learn to challenge negative thought patterns in high-pressure environments.'
  }
];

export const WellnessHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Article', 'Exercise', 'Audio'];
  
  const filteredResources = resources.filter(r => 
    (activeCategory === 'All' || r.category === activeCategory) &&
    (r.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 rounded-[40px] overflow-hidden bg-black text-white p-12 flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-12 opacity-20">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Your SafeSpace</h2>
          <p className="text-gray-400 text-lg">
            Curated resources to help you maintain mental resilience and emotional balance.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="relative h-48">
                <img 
                  src={resource.image} 
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {resource.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                    {resource.category === 'Audio' ? <Play className="w-5 h-5 fill-black" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">
                  <Clock className="w-3 h-3" />
                  {resource.duration}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  {resource.description}
                </p>
                <button className="flex items-center gap-2 text-xs font-bold text-black group-hover:gap-3 transition-all">
                  Start Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Featured Exercise */}
      <div className="bg-emerald-50 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 border border-emerald-100">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
            <Wind className="w-4 h-4" />
            Daily Practice
          </div>
          <h3 className="text-3xl font-bold text-emerald-900">1-Minute De-stress</h3>
          <p className="text-emerald-700/70 text-lg">
            A quick breathing exercise designed for busy professionals to reset their focus between tasks.
          </p>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            Start Session
          </button>
        </div>
        <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 border-8 border-emerald-100 rounded-full animate-ping opacity-20"></div>
          <Wind className="w-24 h-24 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
