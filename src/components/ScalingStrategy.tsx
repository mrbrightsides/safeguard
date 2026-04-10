import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Zap, 
  Crown, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

export const ScalingStrategy: React.FC = () => {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      name: 'Basic (Preventive)',
      monthlyPrice: 'Rp 5.000',
      annualPrice: 'Rp 50.000',
      period: billingCycle === 'annual' ? 'per user / year' : 'per user / month',
      minSubscribers: 50,
      description: 'Essential psychosocial monitoring for small to medium teams.',
      features: [
        'Digital Anamnesis (AI Scan)',
        'Basic Early Warning System',
        'Personal Wellness Roadmap',
        'Standard Risk Dashboard',
        'Email Support'
      ],
      color: 'bg-white border-gray-100 text-gray-900',
      buttonColor: 'bg-gray-900 text-white hover:bg-gray-800',
      icon: Zap,
      iconColor: 'text-gray-400'
    },
    {
      name: 'Pro (Predictive)',
      monthlyPrice: 'Rp 15.000',
      annualPrice: 'Rp 150.000',
      period: billingCycle === 'annual' ? 'per user / year' : 'per user / month',
      minSubscribers: 50,
      description: 'Advanced real-time monitoring with hardware integration.',
      features: [
        'Everything in Basic',
        'Wearable Device Sync (BLE)',
        'Real-time Biometric Analysis',
        'IoT Companion Tool Support',
        'Priority AI Counselor Access',
        'Advanced Org Analytics'
      ],
      color: 'bg-teal-900 border-teal-800 text-white',
      buttonColor: 'bg-teal-50 text-teal-900 hover:bg-teal-100',
      popular: true,
      icon: Crown,
      iconColor: 'text-teal-400'
    },
    {
      name: 'Enterprise (Prescriptive)',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: 'tailored solutions',
      minSubscribers: 100,
      description: 'Full-scale integration for large corporations and BUMN.',
      features: [
        'Everything in Pro',
        'Full HRIS & ERP Integration',
        'Custom AI Risk Models',
        'On-site Clinical Support',
        'Dedicated Success Manager',
        'White-label Deployment'
      ],
      color: 'bg-white border-gray-100 text-gray-900',
      buttonColor: 'bg-gray-900 text-white hover:bg-gray-800',
      icon: Building2,
      iconColor: 'text-indigo-500'
    }
  ];

  const scalingPhases = [
    {
      phase: 'Phase 1: Pilot (Q3 2026)',
      title: 'Tier S Domination',
      desc: 'Focus on 10-20 star-rated hotels in Bali & Jakarta. Establishing clinical baseline data.',
      icon: Globe
    },
    {
      phase: 'Phase 2: Expansion (Q1 2027)',
      title: 'Tier A Tech-Native',
      desc: 'Scaling to 50+ Startups & IT firms. Launching Hardware-as-a-Service (HaaS) model.',
      icon: Rocket
    },
    {
      phase: 'Phase 3: Ecosystem (Q3 2027)',
      title: 'National Integration',
      desc: 'Full SATUSEHAT & BPJS integration. Becoming the national standard for psychosocial EWS.',
      icon: Cpu
    }
  ];

  const handleContact = () => {
    window.location.href = 'mailto:safeguard@elpeef.com';
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      <div className="mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
          Monetization & Scaling
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
          Scaling SafeGuard: <span className="text-indigo-600">From Pilot to National Ecosystem</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
          Our business model is designed for rapid adoption and sustainable growth, transforming mental health from a cost center into a risk-controlled asset.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex flex-col items-center justify-center mb-12 space-y-4">
        <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              billingCycle === 'monthly' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              billingCycle === 'annual' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Annual
            <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 font-medium">
          * Prices shown per user. Minimum {tiers[0].minSubscribers} subscribers per organization.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-8 rounded-[40px] border shadow-sm relative flex flex-col",
              tier.color
            )}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <div className={cn("w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6", tier.popular ? "bg-white/10" : "bg-gray-50")}>
                <tier.icon className={cn("w-6 h-6", tier.iconColor)} />
              </div>
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black">
                  {billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-xs opacity-60 font-medium">{tier.period}</span>
              </div>
              <p className="text-sm opacity-70 leading-relaxed mb-4">{tier.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Min. {tier.minSubscribers} Users
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className={cn("w-4 h-4 mt-0.5 shrink-0", tier.popular ? "text-teal-400" : "text-teal-600")} />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleContact}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group",
                tier.buttonColor
              )}
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Volume Discounts */}
      <div className="mb-24 p-10 bg-white rounded-[48px] border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Volume-Based Discounts</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              We offer significant discounts for larger organizations. The more employees you protect, the more you save on per-user licensing.
            </p>
            <div className="space-y-4">
              {[
                { range: '< 50 Employees', discount: 'Standard Rate', note: 'Minimum 50 users for standard pricing' },
                { range: '50 - 100 Employees', discount: 'Standard Rate', note: 'Base pricing as shown above' },
                { range: '101 - 500 Employees', discount: '15% Discount', note: 'Applied to total annual contract' },
                { range: '> 500 Employees', discount: 'Custom Pricing', note: 'Contact sales for high-volume rates' },
              ].map((item) => (
                <div key={item.range} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-gray-900">{item.range}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.note}</p>
                  </div>
                  <div className="text-sm font-bold text-teal-600">{item.discount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-indigo-600 rounded-[40px] flex flex-col items-center justify-center p-12 text-center text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-64 h-64" />
              </div>
              <h3 className="text-4xl font-black mb-4">100+</h3>
              <p className="text-xl font-bold mb-6">Employees?</p>
              <p className="text-sm opacity-80 leading-relaxed mb-8">
                Unlock custom enterprise benefits and dedicated support for your large-scale team.
              </p>
              <button 
                onClick={handleContact}
                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                Request Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scaling Roadmap */}
      <div className="bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <TrendingUp className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <Rocket className="w-8 h-8 text-teal-400" />
            Strategic Scaling Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {scalingPhases.map((phase, i) => (
              <div key={i} className="space-y-6 relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-[2px] bg-gradient-to-r from-teal-500/50 to-transparent z-0" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center relative z-10">
                  <phase.icon className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-2">{phase.phase}</p>
                  <h4 className="text-xl font-bold mb-3">{phase.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Economic Benefits */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Why Scale with SafeGuard?</h2>
          <div className="space-y-6">
            {[
              { title: 'Reduced Turnover', desc: 'Preventing burnout saves an average of Rp 15M per resignation in recruitment costs.' },
              { title: 'Lower Insurance Premiums', desc: 'Data-driven risk mitigation allows for negotiation of lower corporate health premiums.' },
              { title: 'Enhanced Productivity', desc: 'Addressing psychosocial hazards reduces presenteeism and improves team velocity.' },
              { title: 'Legal Compliance', desc: 'Stay ahead of evolving K3 (Occupational Health & Safety) and PDP regulations.' }
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-indigo-50 rounded-[40px] p-10 border border-indigo-100 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Ready to Scale Your Organization?</h3>
            <p className="text-gray-600 leading-relaxed">
              Join the growing number of forward-thinking companies transforming their psychosocial risk management.
            </p>
            <div className="pt-4">
              <button 
                onClick={handleContact}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Contact Sales for Enterprise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
