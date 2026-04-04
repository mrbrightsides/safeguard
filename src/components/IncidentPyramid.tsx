import React from 'react';
import { motion } from 'motion/react';
import { 
  Skull, 
  AlertCircle, 
  Activity, 
  ShieldAlert, 
  Users,
  TrendingUp,
  Brain,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

const pyramidData = [
  {
    level: 'Fatality',
    ratio: '1',
    reality: 'Suicide / MI / Stroke',
    color: 'bg-red-600',
    icon: Skull,
    description: 'The visible tip: Lagging indicator of system failure.',
    details: '1 fatality is not 1 event — it is the result of hundreds of ignored signals.'
  },
  {
    level: 'RWDC',
    ratio: '10–30',
    reality: 'Burnout, Absenteeism',
    color: 'bg-red-500',
    icon: ShieldAlert,
    description: 'Restricted Work / Days Case: Significant productivity loss.',
    details: 'Chronic stress leading to long-term leave and clinical burnout.'
  },
  {
    level: 'MTC',
    ratio: '30–100',
    reality: 'Panic Attack, Anxiety',
    color: 'bg-orange-500',
    icon: Activity,
    description: 'Medical Treatment Case: Clinical intervention required.',
    details: 'Escalation of psychological symptoms into acute episodes.'
  },
  {
    level: 'First Aid',
    ratio: '100–300',
    reality: 'Insomnia, Fatigue',
    color: 'bg-amber-500',
    icon: AlertCircle,
    description: 'Early physical symptoms of psychosocial hazard.',
    details: 'The body begins to react to chronic cortisol elevation.'
  },
  {
    level: 'UA / UC',
    ratio: '300–600+',
    reality: 'Bullying, Toxic Culture',
    color: 'bg-emerald-500',
    icon: Users,
    description: 'Unsafe Acts / Unsafe Conditions: The leading indicator.',
    details: 'The goldmine for prevention. Eliminating 300 UA is more powerful than reacting to 1 fatality.'
  }
];

export const IncidentPyramid: React.FC = () => {
  return (
    <div className="w-full py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          The Psychosocial Incident Pyramid
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto italic">
          "1 fatality is not 1 event — it is the visible tip of hundreds of ignored psychosocial signals."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Pyramid Visualization */}
        <div className="relative flex flex-col items-center">
          {pyramidData.map((item, index) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative group cursor-help mb-1 flex items-center justify-center text-white font-bold transition-all hover:scale-[1.02]",
                item.color,
                index === 0 && "w-[20%] h-12 rounded-t-lg",
                index === 1 && "w-[40%] h-14",
                index === 2 && "w-[60%] h-16",
                index === 3 && "w-[80%] h-18",
                index === 4 && "w-[100%] h-20 rounded-b-lg"
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest opacity-80">{item.level}</span>
                <span className="text-lg">{item.ratio}</span>
              </div>

              {/* Tooltip-like Info */}
              <div className="absolute left-full ml-4 w-48 p-3 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                <div className="font-bold text-xs mb-1">{item.reality}</div>
                <div className="text-[10px] leading-tight text-gray-500">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Biological & Strategic Insights */}
        <div className="space-y-8">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <Brain className="w-5 h-5 text-teal-600" />
              The Biological Pathway
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0">1</div>
                <p><span className="font-bold text-gray-900">Exposure:</span> Chronic bullying and toxic workplace stress.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0">2</div>
                <p><span className="font-bold text-gray-900">Activation:</span> HPA axis triggers continuous cortisol release.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0">3</div>
                <p><span className="font-bold text-gray-900">Inflammation:</span> Elevated IL-6 and CRP levels lead to atherosclerosis.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0">4</div>
                <p><span className="font-bold text-gray-900">Outcome:</span> Acute coronary syndrome or psychiatric emergency.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-900 text-white rounded-3xl shadow-xl">
            <h3 className="flex items-center gap-2 font-bold mb-4">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Strategic Translation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Fatality (Suicide/CVD)</span>
                <span className="text-red-400 font-mono">LAGGING INDICATOR</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Bullying (UA/UC)</span>
                <span className="text-emerald-400 font-mono">LEADING INDICATOR</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm font-medium italic text-teal-300">
                  "SafeGuard acts as the predictive bridge, turning 600 near misses into 1 prevented life."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
