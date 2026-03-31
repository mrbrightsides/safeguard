import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  LayoutDashboard, 
  ClipboardCheck, 
  BrainCircuit, 
  Settings, 
  Bell, 
  User,
  Menu,
  X,
  Activity,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Assessment } from './components/Assessment';
import { AIAnalysis } from './components/AIAnalysis';
import { OrganizationAnalytics } from './components/OrganizationAnalytics';
import { WellnessHub } from './components/WellnessHub';
import { ConsultModal } from './components/ConsultModal';
import { MERPModal } from './components/MERPModal';
import { cn } from './lib/utils';

type View = 'dashboard' | 'assessment' | 'ai-analysis' | 'analytics' | 'wellness' | 'settings';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<string | undefined>(undefined);
  const [showGlobalConsultModal, setShowGlobalConsultModal] = useState(false);
  const [showMERPModal, setShowMERPModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Update', message: 'SafeGuard v2.4.0 is now live.', time: '2h ago', type: 'info', read: false },
    { id: '2', title: 'Risk Alert', message: 'High stress spike in Engineering Dept.', time: '5h ago', type: 'warning', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Handle global events for navigation and consultation
  useEffect(() => {
    const handleOpenConsult = () => setShowGlobalConsultModal(true);
    const handleNavigateAssessment = () => setActiveView('assessment');

    window.addEventListener('open-consultation', handleOpenConsult);
    window.addEventListener('navigate-to-assessment', handleNavigateAssessment);

    return () => {
      window.removeEventListener('open-consultation', handleOpenConsult);
      window.removeEventListener('navigate-to-assessment', handleNavigateAssessment);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Population Health', icon: LayoutDashboard },
    { id: 'analytics', label: 'Org Analytics', icon: Activity },
    { id: 'assessment', label: 'Digital Anamnesis', icon: ClipboardCheck },
    { id: 'ai-analysis', label: 'AI Risk Detector', icon: BrainCircuit },
    { id: 'wellness', label: 'Wellness Hub', icon: Heart },
    { id: 'settings', label: 'System Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tighter">SafeGuard</h1>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">EWS System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeView === item.id 
                  ? "bg-black text-white shadow-lg shadow-black/10" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                activeView === item.id ? "text-white" : "text-gray-400"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">System Status</span>
            </div>
            <div className="text-xs font-medium text-gray-600">All Sensors Active</div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="lg:ml-64 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400">
            {navItems.find(i => i.id === activeView)?.label}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="p-2 text-gray-400 hover:text-black relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Notifications</h3>
                      <span className="text-[10px] font-bold text-gray-400">{notifications.length} Total</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-xs italic">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                n.type === 'info' ? 'bg-blue-500' :
                                n.type === 'warning' ? 'bg-amber-500' :
                                n.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
                              )} />
                              <div>
                                <div className="text-xs font-bold text-gray-900 mb-0.5">{n.title}</div>
                                <p className="text-[11px] text-gray-500 leading-relaxed mb-1">{n.message}</p>
                                <div className="text-[9px] font-mono text-gray-400 uppercase">{n.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button className="w-full p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-t border-gray-50 bg-gray-50/30">
                      View All Activity
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">Dr. Sarah Chen</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Occupational Health</div>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'analytics' && <OrganizationAnalytics />}
            {activeView === 'assessment' && (
              <div className="py-12">
                <Assessment onComplete={(scores) => {
                  const summary = `DASS-21 Clinical Assessment Results: 
- Depression Score: ${scores.depression}
- Anxiety Score: ${scores.anxiety}
- Stress Score: ${scores.stress}
Please provide a clinical risk stratification and recommendations based on these standardized scores.`;
                  
                  setPendingAnalysis(summary);
                  setActiveView('ai-analysis');
                }} />
              </div>
            )}
            {activeView === 'ai-analysis' && (
              <AIAnalysis 
                initialInput={pendingAnalysis} 
              />
            )}
            {activeView === 'wellness' && <WellnessHub />}
            {activeView === 'settings' && (
              <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6">System Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <div className="font-bold">SATUSEHAT Integration</div>
                      <div className="text-xs text-gray-500">FHIR API v4.0.1</div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <div className="font-bold">BPJS Claim Engine</div>
                      <div className="text-xs text-gray-500">Automated ICD Mapping</div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-[70] lg:hidden p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  <span className="font-bold text-xl">SafeGuard</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as View);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
                      activeView === item.id ? "bg-black text-white" : "text-gray-500"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Emergency) */}
      <button 
        onClick={() => setShowMERPModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-30"
      >
        <AlertTriangle className="w-8 h-8 group-hover:animate-pulse" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          MERP Emergency Trigger
        </span>
      </button>

      <ConsultModal 
        isOpen={showGlobalConsultModal} 
        onClose={() => setShowGlobalConsultModal(false)} 
      />

      <MERPModal 
        isOpen={showMERPModal} 
        onClose={() => setShowMERPModal(false)}
        onTrigger={(data) => {
          addNotification(
            'Emergency Protocol Activated',
            `MERP Triggered at ${data.location}. Response team dispatched.`,
            'error'
          );
        }}
      />
    </div>
  );
}
