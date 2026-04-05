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
  Filter,
  Bot,
  MessageSquare,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import AICounselor from './AICounselor';
import Markdown from 'react-markdown';

interface Resource {
  id: string;
  title: string;
  category: 'Article' | 'Exercise' | 'Audio';
  duration: string;
  image: string;
  description: string;
  content?: string;
  audioUrl?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Box Breathing Technique',
    category: 'Exercise',
    duration: '5 min',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    description: 'A powerful technique to calm your nervous system instantly.',
    content: `### How to do Box Breathing
Box breathing, also known as four-square breathing, is a simple technique used by athletes, police officers, and even Navy SEALs to stay calm and focused.

#### The 4-4-4-4 Method:
1. **Inhale**: Breathe in through your nose for a count of 4. Feel the air fill your lungs.
2. **Hold**: Hold your breath for a count of 4. Keep your chest and shoulders relaxed.
3. **Exhale**: Breathe out through your mouth for a count of 4. Imagine releasing all tension.
4. **Hold**: Hold your breath for a count of 4 before the next inhale.

#### Why it works:
It regulates your autonomic nervous system by stimulating the vagus nerve, which signals your brain to lower your heart rate and reduce cortisol levels.

Repeat this cycle 4 times or until you feel a sense of calm returning.`
  },
  {
    id: '2',
    title: 'Managing Workplace Burnout',
    category: 'Article',
    duration: '8 min read',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    description: 'Identify the early signs of burnout and how to recover effectively.',
    content: `### Understanding Burnout in High-Pressure Roles
Burnout isn't just "feeling tired." It's a clinical state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.

#### The Warning Signs:
- **Emotional Exhaustion**: Feeling "wiped out" even after a full night's sleep.
- **Depersonalization**: Feeling cynical or detached from your work and patients/colleagues.
- **Low Personal Accomplishment**: Feeling like your work doesn't matter anymore.

#### The SafeGuard Recovery Plan:
1. **The 20-Minute Rule**: Spend at least 20 minutes a day doing something completely unrelated to work.
2. **Micro-Boundaries**: Turn off work notifications exactly at the end of your shift.
3. **Social Buffering**: Talk to a peer who understands your role. Shared experience is a powerful stress buffer.
4. **Professional Consultation**: If symptoms persist for more than 2 weeks, use the "Consult a Professional" button on your dashboard.`
  },
  {
    id: '3',
    title: 'Deep Sleep Meditation',
    category: 'Audio',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=800',
    description: 'Guided meditation to help you unwind after a high-stress shift.',
    audioUrl: 'https://www.youtube.com/embed/1ZYbU82GVz4', // Deep sleep music
    content: `### Preparing for Deep Sleep
This guided session is designed to help you transition from a high-alert work state to a restful sleep state.

#### Instructions:
1. Find a comfortable position in bed.
2. Ensure your room is cool and dark.
3. Focus on the gentle sounds and let your mind drift.
4. If your mind wanders, gently bring your focus back to the sound of the waves.

*Note: This session uses a curated sleep soundscape to promote deep relaxation.*`
  },
  {
    id: '4',
    title: 'Cognitive Reframing',
    category: 'Article',
    duration: '10 min read',
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800',
    description: 'Learn to challenge negative thought patterns in high-pressure environments.',
    content: `### Master Your Mindset: Cognitive Reframing
Cognitive reframing is a psychological technique that helps you identify and then dispute irrational or maladaptive thoughts.

#### The "Catch-Check-Change" Method:
1. **Catch It**: Notice when you're having a negative thought (e.g., "I'm not doing enough").
2. **Check It**: Is this thought 100% true? What would I say to a friend in this situation?
3. **Change It**: Replace it with a more balanced perspective ("I'm doing my best in a challenging situation, and I've helped many people today").

#### Practice Scenario:
*Situation*: You missed a minor detail in a report.
*Old Thought*: "I'm incompetent and I'll get fired."
*New Frame*: "I made a mistake because I was busy. I will correct it and set a reminder to double-check next time."`
  }
];

const ResourceModal: React.FC<{ resource: Resource; onClose: () => void }> = ({ resource, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-64 shrink-0">
          <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-8 left-8 right-8">
            <span className="px-3 py-1 bg-teal-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
              {resource.category}
            </span>
            <h2 className="text-3xl font-bold text-white">{resource.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {resource.category === 'Audio' ? (
            <div className="flex flex-col items-center space-y-8">
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`${resource.audioUrl}?autoplay=0&controls=1`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="prose prose-teal max-w-none w-full">
                <Markdown>{resource.content || resource.description}</Markdown>
              </div>
            </div>
          ) : (
            <div className="prose prose-teal max-w-none">
              <Markdown>{resource.content || resource.description}</Markdown>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const WellnessHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAICounselorOpen, setIsAICounselorOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = ['All', 'Article', 'Exercise', 'Audio'];
  
  const filteredResources = resources.filter(r => 
    (activeCategory === 'All' || r.category === activeCategory) &&
    (r.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-full overflow-x-hidden space-y-8 pb-20">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative min-h-[256px] rounded-[40px] overflow-hidden bg-teal-900 text-white p-8 md:p-12 flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Your SafeSpace</h2>
            <p className="text-teal-100/70 text-base md:text-lg">
              Curated resources to help you maintain mental resilience and emotional balance.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setIsAICounselorOpen(true)}
          className="relative min-h-[256px] rounded-[40px] overflow-hidden bg-teal-600 text-white p-8 flex flex-col justify-between cursor-pointer group hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
        >
          <div className="absolute -top-4 -right-4 p-8 opacity-20 group-hover:scale-110 transition-transform pointer-events-none">
            <Bot className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">AI Counselor</h3>
            <p className="text-teal-50 text-sm leading-relaxed">
              24/7 conversational support and empathetic listening. Talk to our AI about your feelings.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            Start Chatting <ChevronRight size={14} />
          </div>
        </div>
      </div>

      <AICounselor isOpen={isAICounselorOpen} onClose={() => setIsAICounselorOpen(false)} />
      
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/10" 
                  : "bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {filteredResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full"
            >
              <div className="relative h-48 shrink-0">
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
                <div 
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                    {resource.category === 'Audio' ? <Play className="w-5 h-5 fill-black" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">
                  <Clock className="w-3 h-3" />
                  {resource.duration}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                  {resource.description}
                </p>
                <button 
                  onClick={() => setSelectedResource(resource)}
                  className="flex items-center gap-2 text-xs font-bold text-teal-900 group-hover:gap-3 transition-all"
                >
                  Start Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Featured Exercise */}
      <div className="bg-emerald-50 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-emerald-100">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
            <Wind className="w-4 h-4" />
            Daily Practice
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-900">1-Minute De-stress</h3>
          <p className="text-emerald-700/70 text-base md:text-lg">
            A quick breathing exercise designed for busy professionals to reset their focus between tasks.
          </p>
          <button 
            onClick={() => setSelectedResource(resources[0])}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Start Session
          </button>
        </div>
        <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center shadow-2xl relative shrink-0">
          <div className="absolute inset-0 border-8 border-emerald-100/20 rounded-full"></div>
          <Wind className="w-16 h-16 md:w-24 md:h-24 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
