'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Building2, User, HelpCircle, ShieldAlert, BookOpen, RefreshCw, 
  Calendar, Users, Target, Activity, CheckCircle2, ChevronRight, Copy, 
  Printer, ArrowRight, TrendingUp, AlertTriangle, FileText, Check, Settings, 
  Plus, Trash2, ArrowUpRight, Search, Zap, Layers, Briefcase
} from 'lucide-react';

interface SellerProfile {
  userName: string;
  userEmail: string;
  userRole: string;
  companySize: string;
  salesMotion: string;
  framework: string;
  companyName: string;
  tagline: string;
  productDescription: string;
  valueProp1: string;
  valueProp2: string;
  valueProp3: string;
  battlecards: string;
}

interface TargetAccount {
  id: string;
  name: string;
  industry: string;
  pipeline: string;
  health: number;
  status: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Researching';
  nextMeeting: string;
  contactName: string;
  contactRole: string;
  notes: string;
  signalsCount: number;
}

export default function PreCallApp() {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState('hubspot');
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const [briefData, setBriefResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Stack integration state
  const [integrations, setIntegrations] = useState({
    calendar: true,
    crm: true,
    slack: false
  });

  // User and Seller Profile (Knowledge Base - Seller Context)
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>({
    userName: 'Jordan Smith',
    userEmail: 'jordan@precall.ai',
    userRole: 'Enterprise Account Executive',
    companySize: '51-200',
    salesMotion: 'Enterprise',
    framework: 'MEDDPICC',
    companyName: 'PreCall AI',
    tagline: 'Autonomous Meeting Prep & Real-time Sales Execution Platform',
    productDescription: 'PreCall AI turns customer signals, CRM data, and product collateral into actionable pre-meeting sales briefs, discovery questions, and risk alerts.',
    valueProp1: 'Reduces pre-call manual research time from 45 minutes to 2 minutes',
    valueProp2: 'Dynamically adapts talking points to buyer role using internal battlecards',
    valueProp3: 'Detects deal risks and missing buying committee champions automatically',
    battlecards: '2x faster implementation than Gong/Chorus; Zero data retention on client CRM notes; Native live delta intelligence stream.'
  });

  // Target Accounts (Buyer Context)
  const [accounts, setAccounts] = useState<TargetAccount[]>([
    {
      id: 'hubspot',
      name: 'HubSpot',
      industry: 'Inbound CRM & Marketing Platform',
      pipeline: '$160,000',
      health: 88,
      status: 'Healthy',
      nextMeeting: 'Today, 2:30 PM (Quarterly Expansion Call)',
      contactName: 'Elena Rostova',
      contactRole: 'VP of Sales Strategy',
      notes: 'Elena mentioned adding 15 new Enterprise SDR seats next quarter. CFO Marcus Vance requested ROI breakdown on seat consolidation.',
      signalsCount: 3
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      industry: 'B2B Cloud Software & CRM',
      pipeline: '$240,000',
      health: 92,
      status: 'Healthy',
      nextMeeting: 'Tomorrow, 10:00 AM (Platform Integration Review)',
      contactName: 'David Chen',
      contactRole: 'VP Enterprise Cloud',
      notes: 'Security review pending for EU data residency.',
      signalsCount: 4
    },
    {
      id: 'atlassian',
      name: 'Atlassian',
      industry: 'Enterprise Collaboration Software',
      pipeline: '$310,000',
      health: 64,
      status: 'Needs Attention',
      nextMeeting: 'Thursday, 4:00 PM (Security & Procurement)',
      contactName: 'Sarah Jenkins',
      contactRole: 'Head of RevOps',
      notes: 'Competitor evaluation active. Requires SOC-2 Type II audit logs.',
      signalsCount: 2
    },
    {
      id: 'acme',
      name: 'Acme Technologies',
      industry: 'Logistics & Supply Chain Intelligence',
      pipeline: '$120,000',
      health: 72,
      status: 'Needs Attention',
      nextMeeting: 'Friday, 11:30 AM (Discovery Review)',
      contactName: 'Marcus Vance',
      contactRole: 'Director of IT',
      notes: 'Expanding to 3 new regional hubs in APAC.',
      signalsCount: 5
    }
  ]);

  // New account form
  const [newAccName, setNewAccName] = useState('');
  const [newAccRole, setNewAccRole] = useState('');
  const [newAccIndustry, setNewAccIndustry] = useState('');

  // Contextual storage load
  useEffect(() => {
    const saved = localStorage.getItem('precall_v2_profile');
    if (saved) {
      try { setSellerProfile(JSON.parse(saved)); } catch (e) {}
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const saveProfile = (updated: SellerProfile) => {
    setSellerProfile(updated);
    localStorage.setItem('precall_v2_profile', JSON.stringify(updated));
  };

  const finishOnboarding = () => {
    saveProfile(sellerProfile);
    setShowOnboarding(false);
  };

  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  // Dynamic Live Gemini Brief Generation
  const triggerBriefResearch = async (account: TargetAccount) => {
    setIsLoadingBrief(true);
    setBriefResult(null);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany: account.name,
          attendeeRole: account.contactRole,
          meetingTitle: account.nextMeeting,
          previousNotes: account.notes,
          knowledgeBase: sellerProfile
        })
      });
      const json = await res.json();
      if (json.success) {
        setBriefResult(json.data);
      } else {
        // Fallback intelligence payload
        setBriefResult({
          executiveSummary: `${account.name} is accelerating their ${account.industry} ecosystem with active focus on team productivity and workflow automation.`,
          recentTriggers: [
            `${account.name} announced regional team expansion`,
            `Leadership mandate to consolidate fragmented sales tooling`,
            `Hiring 20+ roles in sales ops and cloud architecture`
          ],
          tailoredTalkingPoints: [
            `Anchor ${sellerProfile.companyName}'s ability to reduce 45 mins of manual research down to 2 mins for ${account.contactRole}.`,
            `Directly address their expansion by showing how unified account intelligence maintains message consistency across regional reps.`,
            `Highlight ${sellerProfile.battlecards.split(';')[0] || 'rapid deployment'} to resolve procurement timing concerns.`
          ],
          discoveryQuestions: [
            `How are your regional sales reps currently managing context handoffs between SDRs and AEs?`,
            `What is the primary blocker preventing executive buy-in from the economic buyer on this timeline?`,
            `What measurable metric will determine if consolidating this workflow is a success in Q4?`
          ],
          objectionHandling: {
            likelyObjection: `We already have CRM and Gong notes; why do reps need another tool?`,
            recommendedPivot: `PreCall isn't a passive call recorder—it actively prepares reps before they enter the room so they ask the right business questions and never miss a signal.`
          },
          citations: ['Company Filings', 'Public Hiring Signals', 'Seller Knowledge Base']
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBrief(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      triggerBriefResearch(currentAccount);
    }
  }, [selectedAccountId]);

  const copyBriefMarkdown = () => {
    if (!briefData) return;
    const md = `# PRECALL AI BRIEF: ${currentAccount.name}\n**Role:** ${currentAccount.contactRole} (${currentAccount.contactName})\n\n## 1. Executive Summary\n${briefData.executiveSummary}\n\n## 2. Talking Points\n${briefData.tailoredTalkingPoints?.map((t: string) => `- ${t}`).join('\n')}\n\n## 3. Discovery Questions\n${briefData.discoveryQuestions?.map((q: string) => `- ${q}`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0b101d]/90 backdrop-blur-md px-5 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-tight text-white text-base">PreCall <span className="text-indigo-400">AI</span></span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">Sales Intelligence Layer</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 w-96 text-xs text-slate-400 focus-within:border-indigo-500">
          <Search className="w-3.5 h-3.5 mr-2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Ask PreCall AI or search accounts, signals, pipeline..." 
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500" 
          />
          <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { setOnboardingStep(1); setShowOnboarding(true); }}
            className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/80 transition flex items-center space-x-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            <span>Onboarding Tour</span>
          </button>
          
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
              {sellerProfile.userName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-[11px]">
              <p className="font-semibold text-slate-200 leading-tight">{sellerProfile.userName}</p>
              <p className="text-slate-400 text-[10px] leading-tight">{sellerProfile.companyName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Full Navigation Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#090e1a]/80 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">Workspace</p>
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Overview / Today', icon: Activity },
                  { id: 'meetings', label: 'My Meetings', icon: Calendar, badge: '3' },
                  { id: 'committee', label: 'Buying Committee', icon: Users },
                  { id: 'opportunities', label: 'Opportunities', icon: Target },
                  { id: 'signals', label: 'Signals Feed', icon: Zap, badge: '3 New' },
                  { id: 'kb', label: 'Knowledge Base', icon: BookOpen, highlight: true },
                  { id: 'coach', label: 'Pre-Meeting Coach', icon: Sparkles },
                  { id: 'risk', label: 'Deal Risk Radar', icon: ShieldAlert, badge: '2 at risk', badgeColor: 'bg-rose-950 text-rose-300 border-rose-800' },
                  { id: 'settings', label: 'Settings & Profile', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Target Account Quick Selector */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex justify-between items-center px-3 mb-2">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Target Accounts</p>
                <button 
                  onClick={() => setActiveNav('kb')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-1">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      if (activeNav !== 'dashboard' && activeNav !== 'meetings') setActiveNav('dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                      selectedAccountId === acc.id 
                        ? 'bg-slate-800/90 text-indigo-300 font-semibold border border-slate-700' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div className={`w-2 h-2 rounded-full ${acc.health > 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="truncate">{acc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{acc.pipeline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Status footer */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[11px] font-medium text-slate-300">Intelligence Sync Active</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Grounded on {sellerProfile.companyName} context</p>
          </div>
        </aside>

        {/* Dynamic Center Stage */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* VIEW 1: DASHBOARD & MEETING PREPARATION HERO */}
          {(activeNav === 'dashboard' || activeNav === 'meetings') && (
            <div className="space-y-6">
              
              {/* Account Headline Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center font-bold text-indigo-300 text-lg">
                        {currentAccount.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h1 className="text-xl font-bold text-white">{currentAccount.name}</h1>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                            currentAccount.health > 80 
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800' 
                              : 'bg-amber-950/70 text-amber-300 border-amber-800'
                          }`}>
                            Health Score: {currentAccount.health}/100
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{currentAccount.industry} • {currentAccount.pipeline} Pipeline</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Export */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => triggerBriefResearch(currentAccount)}
                      disabled={isLoadingBrief}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBrief ? 'animate-spin' : ''}`} />
                      <span>{isLoadingBrief ? 'Synthesizing...' : 'Refresh AI Brief'}</span>
                    </button>
                    <button 
                      onClick={copyBriefMarkdown}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 transition flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 transition flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print/PDF</span>
                    </button>
                  </div>
                </div>

                {/* Upcoming Meeting Banner */}
                <div className="mt-5 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{currentAccount.nextMeeting}</p>
                      <p className="text-[11px] text-slate-400">Prospect: <strong className="text-slate-300">{currentAccount.contactName}</strong> ({currentAccount.contactRole})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-indigo-400 font-medium">Delta Anchor Active</span>
                    <p className="text-[10px] text-slate-400 max-w-sm truncate">{currentAccount.notes}</p>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingBrief && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-sm font-semibold text-white">PreCall Agentic Orchestrator in Progress...</h3>
                  <div className="text-xs text-slate-400 max-w-md mx-auto space-y-1">
                    <p className="text-indigo-300">✓ Ingesting {sellerProfile.companyName} battlecards & positioning</p>
                    <p className="text-indigo-300">✓ Grounding on {currentAccount.name} recent news & buyer role</p>
                    <p className="text-slate-400">⚡ Formulating 3 targeted discovery questions & objection pivots</p>
                  </div>
                </div>
              )}

              {/* Rendered Intelligence Brief */}
              {!isLoadingBrief && briefData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Main Brief (8 Cols) */}
                  <div className="lg:col-span-8 space-y-5">
                    
                    {/* Executive Summary */}
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>30-Second Executive Context</span>
                        </h3>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60">Verified Source</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                        {briefData.executiveSummary}
                      </p>
                    </div>

                    {/* Talking Points Tailored to Role */}
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>High-Impact Talking Points for {currentAccount.contactRole}</span>
                      </h3>
                      <div className="space-y-2.5">
                        {briefData.tailoredTalkingPoints?.map((tp: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2.5 bg-slate-950/60 border border-slate-800/90 p-3 rounded-lg text-xs text-slate-200">
                            <span className="w-5 h-5 rounded bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{tp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Discovery Framework */}
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center space-x-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>3-Tier Discovery Questions (MEDDPICC Aligned)</span>
                      </h3>
                      <div className="space-y-2.5">
                        {briefData.discoveryQuestions?.map((q: string, idx: number) => (
                          <div key={idx} className="bg-slate-950/60 border border-slate-800/90 p-3.5 rounded-lg text-xs text-slate-200">
                            <p className="font-semibold text-indigo-300 mb-1">Question {idx + 1}:</p>
                            <p className="leading-relaxed text-slate-200 italic">"{q}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar: Objections, Signals & Next Best Action (4 Cols) */}
                  <div className="lg:col-span-4 space-y-5">
                    
                    {/* Next Best Action */}
                    <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/60 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Next Best Action Engine</span>
                      </h3>
                      <p className="text-xs font-semibold text-white">Introduce ROI consolidation before sending proposal.</p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Elena mentioned Marcus Vance (CFO) is evaluating seat consolidation. Arm her with financial proof now.
                      </p>
                      <button 
                        onClick={() => alert("Action scheduled: Task added to CRM queue")}
                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                      >
                        Execute Action
                      </button>
                    </div>

                    {/* Objection & Pivot */}
                    {briefData.objectionHandling && (
                      <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center space-x-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Anticipated Objection</span>
                        </h3>
                        <p className="text-xs font-medium text-rose-200">"{briefData.objectionHandling.likelyObjection}"</p>
                        <div className="mt-2.5 pt-2.5 border-t border-rose-900/40">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Recommended Pivot:</p>
                          <p className="text-xs text-slate-200 mt-0.5">{briefData.objectionHandling.recommendedPivot}</p>
                        </div>
                      </div>
                    )}

                    {/* Recent Signals */}
                    <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Recent Company Triggers</span>
                      </h3>
                      <div className="space-y-2">
                        {briefData.recentTriggers?.map((trig: string, idx: number) => (
                          <div key={idx} className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start space-x-2">
                            <span className="text-amber-400 mt-0.5">⚡</span>
                            <span>{trig}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: KNOWLEDGE BASE (SELLER CONTEXT + TARGET COMPANIES) */}
          {activeNav === 'kb' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Centralized Intelligence & Knowledge Base</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage both your seller product context and target prospect intelligence. PreCall fuses both layers to orchestrate sales briefs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: My Company & Product Context (Seller) */}
                <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span>1. Seller Knowledge Base (What You Sell)</span>
                    </h3>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">Injected in AI</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={sellerProfile.companyName}
                      onChange={e => setSellerProfile({...sellerProfile, companyName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
                    <textarea 
                      rows={2}
                      value={sellerProfile.productDescription}
                      onChange={e => setSellerProfile({...sellerProfile, productDescription: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Top Value Propositions</label>
                    <input 
                      type="text" 
                      value={sellerProfile.valueProp1}
                      onChange={e => setSellerProfile({...sellerProfile, valueProp1: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white mb-2"
                      placeholder="Value Prop 1"
                    />
                    <input 
                      type="text" 
                      value={sellerProfile.valueProp2}
                      onChange={e => setSellerProfile({...sellerProfile, valueProp2: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white mb-2"
                      placeholder="Value Prop 2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Battlecards & Competitive Positioning</label>
                    <textarea 
                      rows={3}
                      value={sellerProfile.battlecards}
                      onChange={e => setSellerProfile({...sellerProfile, battlecards: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button 
                    onClick={() => { saveProfile(sellerProfile); alert('Seller Context updated successfully!'); }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition"
                  >
                    Save Seller Knowledge
                  </button>
                </div>

                {/* Right: Target Accounts Management (Buyer) */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Account List */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>2. Target Accounts ({accounts.length})</span>
                      </h3>
                      <span className="text-[10px] text-slate-400">Click to set active</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {accounts.map(acc => (
                        <div 
                          key={acc.id} 
                          onClick={() => setSelectedAccountId(acc.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                            selectedAccountId === acc.id 
                              ? 'bg-indigo-950/60 border-indigo-600 text-white' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-xs">{acc.name}</p>
                            <p className="text-[10px] text-slate-400">{acc.contactName} • {acc.contactRole}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-semibold">{acc.pipeline}</span>
                            <p className="text-[10px] text-emerald-400">{acc.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Account Form */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add & Research New Company</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Company Name (e.g. Stripe)" 
                        value={newAccName} 
                        onChange={e => setNewAccName(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Industry (e.g. Fintech)" 
                        value={newAccIndustry} 
                        onChange={e => setNewAccIndustry(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Key Contact Role (e.g. Head of Growth)" 
                      value={newAccRole} 
                      onChange={e => setNewAccRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={() => {
                        if (!newAccName || !newAccRole) return alert('Enter company name and role');
                        const newAcc: TargetAccount = {
                          id: newAccName.toLowerCase().replace(/\s+/g, '-'),
                          name: newAccName,
                          industry: newAccIndustry || 'Technology',
                          pipeline: '$150,000',
                          health: 80,
                          status: 'Researching',
                          nextMeeting: 'Upcoming Discovery Call',
                          contactName: 'Target Stakeholder',
                          contactRole: newAccRole,
                          notes: 'New account created via Knowledge Base.',
                          signalsCount: 1
                        };
                        setAccounts([newAcc, ...accounts]);
                        setSelectedAccountId(newAcc.id);
                        setNewAccName('');
                        setNewAccRole('');
                        setNewAccIndustry('');
                        alert(`Account ${newAccName} added and scheduled for live research!`);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add & Trigger Agent Research</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* VIEW 3: SETTINGS & PROFILE */}
          {activeNav === 'settings' && (
            <div className="max-w-2xl bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <span>User Profile & Workspace Settings</span>
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={sellerProfile.userName} 
                    onChange={e => setSellerProfile({...sellerProfile, userName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sales Methodology / Framework</label>
                  <select 
                    value={sellerProfile.framework} 
                    onChange={e => setSellerProfile({...sellerProfile, framework: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option>MEDDPICC</option>
                    <option>SPICED</option>
                    <option>Challenger Sale</option>
                    <option>Command of the Message</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button 
                  onClick={() => { setOnboardingStep(1); setShowOnboarding(true); }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition"
                >
                  Restart 4-Step Onboarding Tour
                </button>
                <button 
                  onClick={() => { saveProfile(sellerProfile); alert('Profile updated!'); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: OTHER NAVIGATION PANELS (Buying Committee, Signals, Risks) */}
          {(activeNav === 'committee' || activeNav === 'opportunities' || activeNav === 'signals' || activeNav === 'risk' || activeNav === 'coach') && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white capitalize">{activeNav.replace('-', ' ')} Overview: {currentAccount.name}</h2>
              <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl space-y-3">
                <p className="text-xs text-slate-300">
                  Currently focused on <strong>{currentAccount.name}</strong> ({currentAccount.contactRole}). All data is grounded using your seller knowledge base ({sellerProfile.companyName}).
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveNav('dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Meeting Intelligence Brief →
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4-Step Interactive Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e1424] border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>🚀 Welcome to PreCall AI</span>
                </h3>
                <p className="text-[11px] text-slate-400">Step {onboardingStep} of 4: Setup your sales intelligence workspace</p>
              </div>
              <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                {Math.round((onboardingStep / 4) * 100)}%
              </span>
            </div>

            {/* Step 1: User Profile */}
            {onboardingStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Personalize who PreCall is preparing briefs for:</p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={sellerProfile.userName} 
                    onChange={e => setSellerProfile({...sellerProfile, userName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sales Role</label>
                  <select 
                    value={sellerProfile.userRole}
                    onChange={e => setSellerProfile({...sellerProfile, userRole: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option>Enterprise Account Executive</option>
                    <option>Mid-Market Account Executive</option>
                    <option>Sales Development Representative (SDR)</option>
                    <option>Founder / CEO (Sales)</option>
                    <option>Sales Manager / VP</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: What You Sell */}
            {onboardingStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Teach PreCall about your company so it crafts custom talking points:</p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Company Name</label>
                  <input 
                    type="text" 
                    value={sellerProfile.companyName} 
                    onChange={e => setSellerProfile({...sellerProfile, companyName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Primary Value Proposition</label>
                  <textarea 
                    rows={2} 
                    value={sellerProfile.valueProp1} 
                    onChange={e => setSellerProfile({...sellerProfile, valueProp1: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>
            )}

            {/* Step 3: Connect Stack */}
            {onboardingStep === 3 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Simulate connecting your daily tools:</p>
                <div className="space-y-2">
                  {[
                    { key: 'calendar', name: 'Google Calendar', desc: 'Sync upcoming customer meetings and attendees' },
                    { key: 'crm', name: 'Salesforce / HubSpot CRM', desc: 'Sync opportunities, notes and stages' },
                    { key: 'slack', name: 'Slack Integration', desc: 'Push pre-meeting summaries to #sales-team' },
                  ].map((stack) => (
                    <div key={stack.key} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-white">{stack.name}</p>
                        <p className="text-[10px] text-slate-400">{stack.desc}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        ✓ Connected (Demo)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: First Account */}
            {onboardingStep === 4 && (
              <div className="space-y-3 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-white">Your Workspace is Initialized!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  We've populated <strong>HubSpot</strong> and <strong>Salesforce</strong> as your initial target accounts. Your seller knowledge base is linked to the Gemini Agent.
                </p>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              {onboardingStep > 1 ? (
                <button 
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
                >
                  Back
                </button>
              ) : <div />}

              {onboardingStep < 4 ? (
                <button 
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={finishOnboarding}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-lg shadow-emerald-600/20"
                >
                  Launch Workspace 🚀
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
