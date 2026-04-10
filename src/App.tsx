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
  AlertTriangle,
  LogOut,
  FileText,
  Info,
  ShieldCheck,
  ChevronRight,
  Globe,
  Github
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Assessment } from './components/Assessment';
import { AIAnalysis } from './components/AIAnalysis';
import { OrganizationAnalytics } from './components/OrganizationAnalytics';
import { WellnessHub } from './components/WellnessHub';
import { Whitepaper } from './components/Whitepaper';
import { About } from './components/About';
import { ConsultModal } from './components/ConsultModal';
import { MERPModal } from './components/MERPModal';
import { RoleSelection, UserRole } from './components/RoleSelection';
import { cn } from './lib/utils';

type View = 'dashboard' | 'assessment' | 'ai-analysis' | 'analytics' | 'wellness' | 'settings' | 'whitepaper' | 'about';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<string | undefined>(undefined);
  const [pendingScores, setPendingScores] = useState<Record<string, number> | undefined>(undefined);
  const [showGlobalConsultModal, setShowGlobalConsultModal] = useState(false);
  const [showMERPModal, setShowMERPModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWAInstalled(true);
      }
    };
    checkPWA();
    window.addEventListener('appinstalled', () => setIsPWAInstalled(true));
    return () => window.removeEventListener('appinstalled', () => setIsPWAInstalled(true));
  }, []);
  
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

    // Browser Push Notification (PWA Feature)
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new window.Notification(title, { 
          body: message, 
          icon: '/images/logo.png' 
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleOpenConsult = () => setShowGlobalConsultModal(true);
    const handleNavigateAssessment = () => setActiveView('assessment');

    window.addEventListener('open-consultation', handleOpenConsult);
    window.addEventListener('navigate-to-assessment', handleNavigateAssessment);
    
    const handleNewNotification = (e: any) => {
      const { title, message, type } = e.detail;
      addNotification(title, message, type);
    };
    window.addEventListener('new-notification', handleNewNotification);

    return () => {
      window.removeEventListener('open-consultation', handleOpenConsult);
      window.removeEventListener('navigate-to-assessment', handleNavigateAssessment);
      window.removeEventListener('new-notification', handleNewNotification);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Population Health', icon: LayoutDashboard, roles: ['corporate'] },
    { id: 'analytics', label: 'Org Analytics', icon: Activity, roles: ['corporate'] },
    { id: 'assessment', label: 'Digital Anamnesis', icon: ClipboardCheck, roles: ['personal', 'corporate'] },
    { id: 'ai-analysis', label: 'AI Risk Detector', icon: BrainCircuit, roles: ['personal', 'corporate'] },
    { id: 'wellness', label: 'Wellness Hub', icon: Heart, roles: ['personal', 'corporate'] },
    { id: 'about', label: 'About SafeGuard', icon: Info, roles: ['personal', 'corporate'] },
    { id: 'settings', label: 'System Config', icon: Settings, roles: ['corporate'] },
  ].filter(item => !role || item.roles.includes(role));

  const toggleAccessibility = () => {
    setIsAccessibilityMode(!isAccessibilityMode);
    if (!isAccessibilityMode) {
      const msg = new SpeechSynthesisUtterance("Accessibility Mode Activated. Interface optimized for high contrast and simplified interaction.");
      window.speechSynthesis.speak(msg);
    }
  };

  if (!role) {
    return <RoleSelection onSelect={(selectedRole) => {
      setRole(selectedRole);
      setActiveView(selectedRole === 'corporate' ? 'dashboard' : 'assessment');
    }} />;
  }

  return (
    <div className={cn(
      "min-h-screen w-full overflow-x-hidden transition-colors duration-300",
      isAccessibilityMode ? "bg-black text-white selection:bg-teal-500" : "bg-[#F8F9FA] text-gray-900 selection:bg-black selection:text-white"
    )}>
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 border-r hidden lg:flex flex-col z-50 transition-colors overflow-y-auto overflow-x-hidden",
        isAccessibilityMode ? "bg-black border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              {/* <Shield className="w-6 h-6 text-white" /> */}
              <img src='images/logo.png'></img>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tighter">SafeGuard</h1>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">EWS System</p>
            </div>
          </div>
          {isPWAInstalled && (
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" title="Mobile App Active"></div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                activeView === item.id 
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/10" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                activeView === item.id ? "text-white" : "text-gray-400"
              )} />
              <span className="text-sm font-medium truncate">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-50 space-y-1">
            <button
              onClick={toggleAccessibility}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                isAccessibilityMode 
                  ? "bg-teal-500 text-black font-bold" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium truncate">Accessibility Mode</span>
            </button>
            <button
              onClick={() => setActiveView('whitepaper')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                activeView === 'whitepaper' 
                  ? "bg-black text-white shadow-lg" 
                  : "text-teal-700 bg-teal-50 hover:bg-teal-100"
              )}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold truncate">Strategic Whitepaper</span>
            </button>
            <button
              onClick={() => setRole(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group shrink-0"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1 shrink-0" />
              <span className="text-sm font-medium truncate">Switch Role</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-50 shrink-0">
          <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-teal-500 shrink-0" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">System Status</span>
              </div>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase shrink-0">Live</span>
            </div>
            <div className="text-xs font-medium text-gray-600 truncate">All Sensors Active</div>
            
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">PWA Status</span>
                </div>
                <span className={cn(
                  "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0",
                  isPWAInstalled ? "text-indigo-600 bg-indigo-50" : "text-gray-400 bg-gray-100"
                )}>
                  {isPWAInstalled ? 'Mobile Ready' : 'Web Only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <header className="lg:ml-64 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400 truncate">
            {navItems.find(i => i.id === activeView)?.label}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a 
            href="https://github.com/mrbrightsides/safeguard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-black transition-colors shrink-0"
            title="View Source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="p-2 text-gray-400 hover:text-black relative transition-colors shrink-0"
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
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
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
                                n.type === 'error' ? 'bg-red-500' : 'bg-teal-500'
                              )} />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-gray-900 mb-0.5 truncate">{n.title}</div>
                                <p className="text-[11px] text-gray-500 leading-relaxed mb-1 break-words">{n.message}</p>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 px-4 sm:px-6 md:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 overflow-x-hidden"
          >
            {activeView === 'dashboard' && <Dashboard role={role} isAccessibilityMode={isAccessibilityMode} />}
            {activeView === 'analytics' && <OrganizationAnalytics />}
            {activeView === 'assessment' && (
              <div className="py-6 sm:py-12">
                <Assessment 
                  isAccessibilityMode={isAccessibilityMode}
                  onComplete={(scores) => {
                  const summary = `DASS-21 Clinical Assessment Results: 
- Depression Score: ${scores.depression}
- Anxiety Score: ${scores.anxiety}
- Stress Score: ${scores.stress}
Please provide a clinical risk stratification and recommendations based on these standardized scores.`;
                  
                  setPendingAnalysis(summary);
                  setPendingScores(scores);
                  
                  // Flag: Notify user that results are ready for analysis
                  addNotification(
                    '[FLAG] Scan Results Ready',
                    'Digital anamnesis complete. AI Risk Detector is now processing your clinical stratification.',
                    'success'
                  );
                  
                  setActiveView('ai-analysis');
                }} />
              </div>
            )}
            {activeView === 'ai-analysis' && (
              <AIAnalysis 
                initialInput={pendingAnalysis} 
                initialScores={pendingScores}
              />
            )}
            {activeView === 'wellness' && <WellnessHub />}
            {activeView === 'about' && <About onGetStarted={() => setActiveView('assessment')} />}
            {activeView === 'whitepaper' && <Whitepaper onBack={() => setActiveView(role === 'corporate' ? 'dashboard' : 'assessment')} />}
            {activeView === 'settings' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-x-hidden">
                <h3 className="text-xl font-bold mb-6">System Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl flex-wrap gap-4">
                    <div className="min-w-0">
                      <div className="font-bold">SATUSEHAT Integration</div>
                      <div className="text-xs text-gray-500 truncate">FHIR API v4.0.1</div>
                    </div>
                    <div className="w-12 h-6 bg-teal-500 rounded-full relative shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl flex-wrap gap-4">
                    <div className="min-w-0">
                      <div className="font-bold">BPJS Claim Engine</div>
                      <div className="text-xs text-gray-500 truncate">Automated ICD Mapping</div>
                    </div>
                    <div className="w-12 h-6 bg-teal-500 rounded-full relative shrink-0">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Developer Resources</h4>
                    <a 
                      href="https://safeguard-hsil.vercel.app/api-docs/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-2xl group hover:bg-teal-100 transition-all flex-wrap gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 bg-teal-600 rounded-xl text-white group-hover:scale-110 transition-transform shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-teal-900 truncate">Interactive API Docs</div>
                          <div className="text-xs text-teal-700 truncate">Swagger OAS 3.0 Specification</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </a>
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
              className={cn(
                "fixed left-0 top-0 h-full w-72 z-[70] lg:hidden flex flex-col shadow-2xl transition-colors overflow-y-auto overflow-x-hidden",
                isAccessibilityMode ? "bg-black text-white" : "bg-white text-gray-900"
              )}
            >
              <div className="p-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    {/* <Shield className="w-6 h-6 text-white" /> */}
                    <img src='images/logo.png'></img>
                  </div>
                  <div>
                    <h1 className="font-bold text-xl tracking-tighter">SafeGuard</h1>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">EWS System</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as View);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                      activeView === item.id 
                        ? "bg-teal-600 text-white shadow-lg shadow-teal-600/10" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                      activeView === item.id ? "text-white" : "text-gray-400"
                    )} />
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
                  <button
                    onClick={() => {
                      toggleAccessibility();
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                      isAccessibilityMode 
                        ? "bg-teal-500 text-black font-bold" 
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium truncate">Accessibility Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('whitepaper');
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group shrink-0",
                      activeView === 'whitepaper' 
                        ? "bg-black text-white shadow-lg" 
                        : "text-teal-700 bg-teal-50 hover:bg-teal-100"
                    )}
                  >
                    <FileText className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold truncate">Strategic Whitepaper</span>
                  </button>
                  <button
                    onClick={() => {
                      setRole(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group shrink-0"
                  >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1 shrink-0" />
                    <span className="text-sm font-medium truncate">Switch Role</span>
                  </button>
                </div>
              </nav>

              <div className="p-6 border-t border-gray-50 shrink-0">
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Activity className="w-3 h-3 text-teal-500 shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 truncate">System Status</span>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase shrink-0">Live</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 truncate">All Sensors Active</div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 truncate">PWA Status</span>
                      </div>
                      <span className={cn(
                        "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0",
                        isPWAInstalled ? "text-indigo-600 bg-indigo-50" : "text-gray-400 bg-gray-100"
                      )}>
                        {isPWAInstalled ? 'Mobile Ready' : 'Web Only'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button 
        onClick={() => window.open('https://safespace.elpeef.com', '_blank')}
        className="fixed bottom-8 right-8 w-14 h-14 sm:w-16 sm:h-16 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-30"
      >
        <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-pulse" />
        <span className="absolute right-full mr-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-[10px] sm:text-xs font-mono uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
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