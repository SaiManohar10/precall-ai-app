'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Building2, User, HelpCircle, ShieldAlert, BookOpen, RefreshCw, 
  Calendar, Users, Target, Activity, CheckCircle2, ChevronRight, Copy, 
  Printer, ArrowRight, TrendingUp, AlertTriangle, FileText, Check, Settings, 
  Plus, Trash2, ArrowUpRight, Search, Zap, Layers, Briefcase, ChevronDown,
  Clock, ShieldCheck, PieChart, MessageSquare, AlertCircle
} from 'lucide-react';

interface SellerProfile {
  userName: string;
  userRole: string;
  companyName: string;
  productDescription: string;
  valueProp1: string;
  valueProp2: string;
  valueProp3: string;
  battlecards: string;
  framework: string;
}

interface Stakeholder {
  name: string;
  role: string;
  influence: string;
  status: string;
  notes: string;
}

interface TargetAccount {
  id: string;
  name: string;
  industry: string;
  pipeline: string;
  stage: string;
  health: number;
  healthBreakdown: { positive: string[]; risks: string[] };
  nextMeeting: string;
  contactName: string;
  contactRole: string;
  notes: string;
  signalsCount: number;
  stakeholders: Stakeholder[];
}

export default function PreCallMasterApp() {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState('hubspot');
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const [briefData, setBriefData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // CRM Post-Meeting Updates State
  const [crmUpdates, setCrmUpdates] = useState({
    stage: 'Discovery → Technical Validation',
    nextStep: 'Schedule security & ROI review with CFO',
    applied: false
  });

  // Seller Context State
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>({
    userName: 'Jordan Smith',
    userRole: 'Enterprise Account Executive',
    companyName: 'PreCall AI',
    productDescription: 'Autonomous Sales Intelligence platform turning fragmented signals, CRM data, and battlecards into real-time pre-meeting briefs and next-best actions.',
    valueProp1: 'Cuts pre-call research from 45 minutes to 2 minutes with verified signals.',
    valueProp2: 'Maps stakeholder buying committees and surfaces deal risks proactively.',
    valueProp3: 'Enforces consistent MEDDPICC qualification on every customer touchpoint.',
    battlecards: 'Zero data retention architecture; Native delta-sync for Salesforce/HubSpot; 3x deeper buyer role personalization than generic summarizers.',
    framework: 'MEDDPICC'
  });

  // Accounts Pipeline
  const [accounts, setAccounts] = useState<TargetAccount[]>([
    {
      id: 'hubspot',
      name: 'HubSpot',
      industry: 'B2B Marketing & CRM Software',
      pipeline: '$160,000',
      stage: 'Solution Validation',
      health: 84,
      healthBreakdown: {
        positive: ['VP Sponsor identified (Elena)', 'High signal velocity (15 new SDR hires)', 'Clear business pain around prep time'],
        risks: ['CFO Marcus Vance not yet in meeting', 'Decision timeline not formally locked in CRM']
      },
      nextMeeting: 'Today, 2:30 PM (Quarterly Expansion & ROI Strategy)',
      contactName: 'Elena Rostova',
      contactRole: 'VP of Sales Strategy',
      notes: 'Elena mentioned adding 15 new Enterprise SDR seats next quarter. CFO Marcus Vance requested ROI breakdown on seat consolidation.',
      signalsCount: 3,
      stakeholders: [
        { name: 'Elena Rostova', role: 'VP Sales Strategy', influence: 'High', status: 'Champion', notes: 'Strong internal advocate' },
        { name: 'Marcus Vance', role: 'Chief Financial Officer', influence: 'Critical', status: 'Economic Buyer', notes: 'Requires quantitative ROI proof' },
        { name: 'Dave K.', role: 'Head of RevOps', influence: 'Medium', status: 'Technical Influencer', notes: 'Concerned about CRM integration complexity' }
      ]
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      industry: 'Enterprise Cloud Platform',
      pipeline: '$240,000',
      stage: 'Technical Proof of Concept',
      health: 92,
      healthBreakdown: {
        positive: ['Direct executive access to David Chen', 'Security clearance passed', 'Pilot milestone met'],
        risks: ['Multi-region legal approval SLA']
      },
      nextMeeting: 'Tomorrow, 10:00 AM (Integration & Security Wrap-up)',
      contactName: 'David Chen',
      contactRole: 'VP Enterprise Cloud',
      notes: 'Final review on SOC-2 Type II controls and custom webhook delivery.',
      signalsCount: 4,
      stakeholders: [
        { name: 'David Chen', role: 'VP Enterprise Cloud', influence: 'High', status: 'Decision Maker', notes: 'Driving cloud modernization' }
      ]
    },
    {
      id: 'atlassian',
      name: 'Atlassian',
      industry: 'Team Collaboration & DevOps',
      pipeline: '$310,000',
      stage: 'Evaluation / Discovery',
      health: 62,
      healthBreakdown: {
        positive: ['Clear developer tooling pain documented', 'RevOps lead engaged'],
        risks: ['Competitor evaluation active', 'Champion changed roles last week']
      },
      nextMeeting: 'Thursday, 4:00 PM (Competitor Battlecard Defense)',
      contactName: 'Sarah Jenkins',
      contactRole: 'Head of RevOps',
      notes: 'Competitor alternative mentioned during last review. Requesting zero data retention agreement.',
      signalsCount: 2,
      stakeholders: [
        { name: 'Sarah Jenkins', role: 'Head of RevOps', influence: 'High', status: 'Evaluator', notes: 'Focuses strictly on compliance' }
      ]
    }
  ]);

  // New Account Inputs
  const [newAccName, setNewAccName] = useState('');
  const [newAccIndustry, setNewAccIndustry] = useState('');
  const [newAccRole, setNewAccRole] = useState('');

  // Persistence Load
  useEffect(() => {
    const saved = localStorage.getItem('precall_pm_profile');
    if (saved) {
      try { setSellerProfile(JSON.parse(saved)); } catch (e) {}
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const saveProfile = (updated: SellerProfile) => {
    setSellerProfile(updated);
    localStorage.setItem('precall_pm_profile', JSON.stringify(updated));
  };

  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  // Live Agent Orchestrator
  const runAgentBrief = async (account: TargetAccount) => {
    setIsLoadingBrief(true);
    setBriefData(null);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany: account.name,
          attendeeRole: account.contactRole,
          attendeeName: account.contactName,
          meetingTitle: account.nextMeeting,
          previousNotes: account.notes,
          knowledgeBase: sellerProfile,
          framework: sellerProfile.framework
        })
      });
      const json = await res.json();
      if (json.success) {
        setBriefData(json.data);
      } else {
        throw new Error(json.error);
      }
    } catch (e) {
      // Production Fallback
      setBriefData({
        twoMinuteBrief: {
          whoAreThey: `${account.name} is a high-growth leader in ${account.industry}.`,
          whyMeeting: `Quarterly expansion review to align tooling consolidation before Q4 budget freeze.`,
          whatChanged: `Hiring 15+ Enterprise SDRs and expanding regional sales pods.`,
          topRisk: `CFO Marcus Vance might delay approval without a tangible seat-consolidation ROI model.`,
          meetingObjective: `Secure commitment for a 30-minute ROI walkthrough directly with the Economic Buyer.`
        },
        executiveSummary: `${account.name} is undergoing operational expansion to support increasing deal volumes. Their primary initiative is minimizing sales rep ramp time and keeping account context uniform across newly distributed teams.\n\nAs they scale, manual research is creating inconsistent messaging and delaying discovery call velocity.`,
        recentTriggers: [
          { signal: `Regional expansion announced across 3 new operational hubs`, impact: `Increases communication silos between SDRs and AEs`, confidence: `Verified` },
          { signal: `Leadership mandate to eliminate redundant software licenses`, impact: `Urgency to prove consolidation ROI over legacy tools`, confidence: `Verified` }
        ],
        stakeholderInsight: {
          rolePriorities: `Increasing SDR pipeline creation rate, reducing rep onboarding ramp, and ensuring CRM hygiene without adding administrative burden.`,
          influenceLevel: `High`,
          likelyBuyingRole: `Champion & Strategic Evaluator`
        },
        tailoredTalkingPoints: [
          { point: `Anchor ${sellerProfile.companyName}'s capability to cut pre-call prep from 45 min down to 2 min for her 15 new SDRs.`, whyThis: `Directly relieves onboarding pressure`, evidence: `Seller Knowledge Base` },
          { point: `Demonstrate how automated MEDDPICC discovery prompts ensure junior reps never miss critical economic buyer criteria.`, whyThis: `Protects deal progression quality`, evidence: `Internal Battlecards` }
        ],
        discoveryQuestions: [
          { question: `With 15 new SDRs onboarding next quarter, how are you currently ensuring every rep enters first-round discovery with consistent account context?`, intent: `Exposes manual research bottleneck`, meddpiccStage: `Metrics & Pain` },
          { question: `Marcus Vance requested an ROI breakdown—what specific metrics does your executive committee require before clearing new software additions?`, intent: `Validates Economic Buyer criteria`, meddpiccStage: `Economic Buyer` },
          { question: `If reps continue researching accounts manually across 5 disconnected tabs, what is the anticipated cost to your Q4 pipeline timeline?`, intent: `Quantifies negative consequence of inaction`, meddpiccStage: `Implication` }
        ],
        objectionHandling: {
          likelyObjection: `We already have call recording and CRM notes; our reps don't have time for another platform.`,
          rootCause: `Tool fatigue and fear of administrative rep overhead.`,
          recommendedPivot: `Call recorders only look backward at past conversations. PreCall AI is the forward-looking execution layer that prepares reps before they enter the room so they win the deal upfront.`,
          whatNotToSay: `Our platform has way more AI features than your current tools.`
        },
        nextBestAction: {
          action: `Draft customized 1-page CFO ROI summary for Elena to present to Marcus Vance.`,
          rationale: `Removes friction for our Champion to advocate internally to the Economic Buyer.`
        }
      });
    } finally {
      setIsLoadingBrief(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      runAgentBrief(currentAccount);
    }
  }, [selectedAccountId]);

  const copyMarkdown = () => {
    if (!briefData) return;
    const md = `# PRECALL AI INTELLIGENCE BRIEF: ${currentAccount.name}\n` +
      `**Target Stakeholder:** ${currentAccount.contactName} (${currentAccount.contactRole})\n` +
      `**Upcoming Call:** ${currentAccount.nextMeeting}\n\n` +
      `## 2-Minute Executive Brief\n- **Who:** ${briefData.twoMinuteBrief.whoAreThey}\n- **Goal:** ${briefData.twoMinuteBrief.whyMeeting}\n- **Top Risk:** ${briefData.twoMinuteBrief.topRisk}\n- **Objective:** ${briefData.twoMinuteBrief.meetingObjective}\n\n` +
      `## Strategic Discovery Questions\n` +
      briefData.discoveryQuestions?.map((q: any, i: number) => `${i+1}. "${q.question}" [${q.meddpiccStage}]`).join('\n') +
      `\n\n## Objection Pivot\n- **Objection:** ${briefData.objectionHandling?.likelyObjection}\n- **Pivot Track:** ${briefData.objectionHandling?.recommendedPivot}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0b101d]/90 backdrop-blur-md px-5 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-tight text-white text-base">PreCall <span className="text-indigo-400">AI</span></span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">Enterprise Edition</span>
          </div>
        </div>

        {/* Global Search / Command Bar */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 w-96 text-xs text-slate-400 focus-within:border-indigo-500">
          <Search className="w-3.5 h-3.5 mr-2 text-slate-500" />
          <input 
            type="text" 
            placeholder={`Ask PreCall AI about ${currentAccount.name} or pipeline...`} 
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500" 
          />
          <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
        </div>

        {/* Header Profile / Actions */}
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

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#090e1a]/80 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">Control Center</p>
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Overview / Briefs', icon: Activity },
                  { id: 'committee', label: 'Buying Committee', icon: Users, badge: `${currentAccount.stakeholders.length}` },
                  { id: 'opportunities', label: 'Opportunities', icon: Target },
                  { id: 'signals', label: 'Signals Feed', icon: Zap, badge: `${currentAccount.signalsCount} New` },
                  { id: 'risk', label: 'Deal Risk Radar', icon: ShieldAlert, badge: 'Alert', badgeColor: 'bg-rose-950 text-rose-300 border-rose-800' },
                  { id: 'kb', label: 'Knowledge Base', icon: BookOpen, highlight: true },
                  { id: 'postcall', label: 'Post-Call / CRM Sync', icon: MessageSquare },
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

            {/* Target Account Intelligence Switcher */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex justify-between items-center px-3 mb-2">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Target Accounts</p>
                <button onClick={() => setActiveNav('kb')} className="text-[10px] text-indigo-400 hover:text-indigo-300">+ Add</button>
              </div>
              <div className="space-y-1">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      if (activeNav !== 'dashboard' && activeNav !== 'committee') setActiveNav('dashboard');
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

          {/* Persistent Agent Context Indicator */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[11px] font-medium text-slate-300">Framework: {sellerProfile.framework}</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Grounded on {sellerProfile.companyName} context</p>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: EXECUTIVE BRIEF & TODAY'S CONTROL CENTER */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Account Hero Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#10172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center font-bold text-indigo-300 text-xl">
                      {currentAccount.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-white">{currentAccount.name}</h1>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {currentAccount.stage}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                          currentAccount.health > 80 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          Health: {currentAccount.health}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{currentAccount.industry} • Pipeline: <strong className="text-slate-200">{currentAccount.pipeline}</strong></p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => runAgentBrief(currentAccount)}
                      disabled={isLoadingBrief}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBrief ? 'animate-spin' : ''}`} />
                      <span>{isLoadingBrief ? 'Re-Synthesizing...' : 'Regenerate Brief'}</span>
                    </button>
                    <button 
                      onClick={copyMarkdown}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 transition flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied MD' : 'Copy Brief'}</span>
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

                {/* Meeting Context Strap */}
                <div className="mt-5 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{currentAccount.nextMeeting}</p>
                      <p className="text-[11px] text-slate-400">Primary Contact: <strong className="text-slate-300">{currentAccount.contactName}</strong> ({currentAccount.contactRole})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-indigo-400 font-medium">Delta Anchor Active</span>
                    <p className="text-[10px] text-slate-400 max-w-sm truncate">{currentAccount.notes}</p>
                  </div>
                </div>
              </div>

              {/* Loading Orchestrator State */}
              {isLoadingBrief && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-sm font-semibold text-white">PreCall Autonomous Orchestrator Fusing Context...</h3>
                  <div className="text-xs text-slate-400 max-w-md mx-auto space-y-1">
                    <p className="text-indigo-300">✓ Ingesting {sellerProfile.companyName} battlecards & positioning</p>
                    <p className="text-indigo-300">✓ Grounding on {currentAccount.name} recent signals & buying committee</p>
                    <p className="text-slate-400">⚡ Calculating MEDDPICC discovery prompts & objection defense</p>
                  </div>
                </div>
              )}

              {/* Brief Content Display */}
              {!isLoadingBrief && briefData && (
                <div className="space-y-6">
                  
                  {/* Hero: "If You Only Have 2 Minutes" Card */}
                  <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-800/70 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3 border-b border-indigo-900/50 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>If You Only Have 2 Minutes — Read This</span>
                      </h3>
                      <span className="text-[10px] bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded font-mono">Compressed Brief</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <p><strong className="text-slate-400">Who they are:</strong> <span className="text-slate-200">{briefData.twoMinuteBrief.whoAreThey}</span></p>
                        <p><strong className="text-slate-400">Why we're meeting:</strong> <span className="text-slate-200">{briefData.twoMinuteBrief.whyMeeting}</span></p>
                        <p><strong className="text-slate-400">What changed:</strong> <span className="text-slate-200">{briefData.twoMinuteBrief.whatChanged}</span></p>
                      </div>
                      <div className="space-y-2">
                        <p><strong className="text-rose-400">Biggest Risk:</strong> <span className="text-rose-200 font-medium">{briefData.twoMinuteBrief.topRisk}</span></p>
                        <p><strong className="text-emerald-400">Call Objective:</strong> <span className="text-emerald-200 font-medium">{briefData.twoMinuteBrief.meetingObjective}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left 8 Columns */}
                    <div className="lg:col-span-8 space-y-5">
                      
                      {/* Executive Context */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>1. Strategic Account Posture</span>
                        </h3>
                        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 whitespace-pre-line">
                          {briefData.executiveSummary}
                        </p>
                      </div>

                      {/* Strategic MEDDPICC Discovery Questions */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>2. 3-Tier Strategic Discovery Questions</span>
                          </h3>
                          <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Framed on {sellerProfile.framework}</span>
                        </div>
                        <div className="space-y-3">
                          {briefData.discoveryQuestions?.map((q: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/60 border border-slate-800/90 p-3.5 rounded-lg text-xs space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-indigo-300">Prompt #{idx + 1} ({q.meddpiccStage}):</span>
                                <span className="text-[10px] text-slate-400">Intent: {q.intent}</span>
                              </div>
                              <p className="text-slate-200 italic font-medium leading-relaxed">"{q.question}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tailored Talking Points */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>3. High-Impact Value Anchors for {currentAccount.contactRole}</span>
                        </h3>
                        <div className="space-y-2.5">
                          {briefData.tailoredTalkingPoints?.map((tp: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                              <p className="text-slate-200 font-medium">{tp.point}</p>
                              <div className="flex space-x-4 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                                <span><strong>Why This:</strong> {tp.whyThis}</span>
                                <span><strong>Evidence Source:</strong> {tp.evidence}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right 4 Columns */}
                    <div className="lg:col-span-4 space-y-5">
                      
                      {/* Next Best Action Card */}
                      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/60 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Next Best Action Engine</span>
                        </h3>
                        <p className="text-xs font-semibold text-white">{briefData.nextBestAction?.action}</p>
                        <p className="text-[11px] text-slate-300 mt-1.5">{briefData.nextBestAction?.rationale}</p>
                        <button 
                          onClick={() => alert("Action triggered: CRM Task & Follow-up drafted in queue.")}
                          className="mt-3.5 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition"
                        >
                          Execute Recommended Action
                        </button>
                      </div>

                      {/* Objection Radar */}
                      {briefData.objectionHandling && (
                        <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 space-y-2.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Anticipated Objection & Pivot</span>
                          </h3>
                          <div className="bg-slate-950/60 p-2.5 rounded border border-rose-900/40 text-xs">
                            <p className="font-semibold text-rose-300">⚠️ "{briefData.objectionHandling.likelyObjection}"</p>
                            <p className="text-[10px] text-slate-400 mt-1">Underlying Root Cause: {briefData.objectionHandling.rootCause}</p>
                          </div>
                          <div className="pt-2 text-xs">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Recommended Talk Track:</p>
                            <p className="text-slate-200 mt-1 leading-relaxed">{briefData.objectionHandling.recommendedPivot}</p>
                          </div>
                        </div>
                      )}

                      {/* Recent Triggers Feed */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Recent Company Signals</span>
                        </h3>
                        <div className="space-y-2">
                          {briefData.recentTriggers?.map((trig: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1">
                              <p className="text-slate-200 font-medium">⚡ {trig.signal}</p>
                              <p className="text-[10px] text-slate-400">{trig.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUYING COMMITTEE MAP */}
          {activeNav === 'committee' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Buying Committee & Stakeholder Map — {currentAccount.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Track champions, economic buyers, and influencers to prevent single-threaded deal failure.</p>
                </div>
                <button 
                  onClick={() => alert("Added new contact to stakeholder mapping")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stakeholder</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentAccount.stakeholders.map((stk, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-white">{stk.name}</p>
                        <p className="text-xs text-slate-400">{stk.role}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        stk.status === 'Champion' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        stk.status === 'Economic Buyer' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {stk.status}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg text-xs text-slate-300">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Intelligence Notes</p>
                      {stk.notes}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Influence: <strong className="text-slate-200">{stk.influence}</strong></span>
                      <button className="text-indigo-400 hover:underline">Draft Outreach →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DEAL RISK RADAR */}
          {activeNav === 'risk' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Deal Risk Radar & Health Analysis</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated detection of deal stalling patterns and missing MEDDPICC validation points.</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{currentAccount.name} Pipeline Health: {currentAccount.health}/100</h3>
                    <p className="text-xs text-slate-400">Calculated across 8 opportunity parameters</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    currentAccount.health > 80 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {currentAccount.health > 80 ? 'Deal on Track' : 'Intervention Needed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-emerald-400">Positive Accelerators</p>
                    <div className="space-y-1.5">
                      {currentAccount.healthBreakdown.positive.map((pos, idx) => (
                        <div key={idx} className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-200 flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{pos}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-rose-400">Detected Deal Vulnerabilities</p>
                    <div className="space-y-1.5">
                      {currentAccount.healthBreakdown.risks.map((rsk, idx) => (
                        <div key={idx} className="bg-slate-950/60 border border-rose-900/40 p-2.5 rounded-lg text-xs text-rose-200 flex items-center space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{rsk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KNOWLEDGE BASE (SELLER CONTEXT + TARGET ACCOUNTS) */}
          {activeNav === 'kb' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Centralized Intelligence & Knowledge Base</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your seller product context and target accounts. PreCall dynamically fuses both layers to orchestrate AI execution briefs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Seller Context */}
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Core Product Pitch & Overview</label>
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
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

                {/* Target Accounts Management */}
                <div className="lg:col-span-6 space-y-4">
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
                            <p className="text-[10px] text-emerald-400">Health: {acc.health}/100</p>
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
                      placeholder="Key Contact Role (e.g. VP Growth)" 
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
                          stage: 'Discovery',
                          health: 78,
                          healthBreakdown: { positive: ['Account identified via Knowledge Base'], risks: ['Needs stakeholder mapping'] },
                          nextMeeting: 'Upcoming Strategy Call',
                          contactName: 'Key Evaluator',
                          contactRole: newAccRole,
                          notes: 'New account created via Knowledge Base.',
                          signalsCount: 2,
                          stakeholders: [
                            { name: 'Key Contact', role: newAccRole, influence: 'High', status: 'Evaluator', notes: 'Initial contact' }
                          ]
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

          {/* TAB 5: POST-CALL CRM SYNC & WORKFLOW */}
          {activeNav === 'postcall' && (
            <div className="max-w-3xl bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    <span>Post-Meeting Intelligence & CRM Staging</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Review AI-extracted next steps and approve CRM changes before synchronization.</p>
                </div>
                <span className="text-xs bg-slate-800 px-2.5 py-1 rounded text-slate-300 font-mono">Status: Awaiting Approval</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Suggested CRM Stage Update</p>
                  <p className="text-sm font-semibold text-white">{crmUpdates.stage}</p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Recommended Next Step in Pipeline</p>
                  <p className="text-sm text-slate-200">{crmUpdates.nextStep}</p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    onClick={() => {
                      setCrmUpdates({...crmUpdates, applied: true});
                      alert("CRM fields updated successfully to Salesforce/HubSpot!");
                    }}
                    disabled={crmUpdates.applied}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
                  >
                    {crmUpdates.applied ? '✓ CRM Synced' : 'Approve & Sync to CRM'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & METHODOLOGY */}
          {activeNav === 'settings' && (
            <div className="max-w-2xl bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <span>Salesperson Profile & Methodology</span>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sales Methodology / Qualification Framework</label>
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
                  onClick={() => { saveProfile(sellerProfile); alert('Profile settings saved!'); }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: OPPORTUNITIES & SIGNALS */}
          {(activeNav === 'opportunities' || activeNav === 'signals') && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white capitalize">{activeNav} Feed: {currentAccount.name}</h2>
              <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
                <p className="text-xs text-slate-300">
                  Target Account: <strong>{currentAccount.name}</strong> ({currentAccount.pipeline} Pipeline). All signals and pipeline stages are grounded in your seller knowledge base.
                </p>
                <button 
                  onClick={() => setActiveNav('dashboard')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  View Active Brief →
                </button>
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
                <p className="text-[11px] text-slate-400">Step {onboardingStep} of 4: Setup your sales execution workspace</p>
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

            {/* Step 3: Connect Tools */}
            {onboardingStep === 3 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Connected integrations feed real-time account context:</p>
                <div className="space-y-2">
                  {[
                    { key: 'calendar', name: 'Google Calendar Sync', desc: 'Sync upcoming customer meetings and attendees' },
                    { key: 'crm', name: 'Salesforce & HubSpot CRM', desc: 'Sync opportunities, contacts, and delta notes' },
                    { key: 'slack', name: 'Slack Intelligence Digest', desc: 'Push pre-meeting summaries directly to #sales-team' },
                  ].map((stack) => (
                    <div key={stack.key} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-white">{stack.name}</p>
                        <p className="text-[10px] text-slate-400">{stack.desc}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        ✓ Connected
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: First Account Setup */}
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

            {/* Controls */}
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
                  onClick={() => {
                    saveProfile(sellerProfile);
                    setShowOnboarding(false);
                  }}
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
