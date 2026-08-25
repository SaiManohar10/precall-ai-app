'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  
  const [sellerProfile, setSellerProfile] = useState({
    userName: 'Sales Rep',
    userRole: 'Account Executive',
    companyName: 'Acme SaaS',
    valueProp: 'Enterprise AI automation saving sales teams 40+ hours per month',
    battlecards: 'Fast 2-minute onboarding, SOC-2 certified, Native CRM sync'
  });

  const [accounts, setAccounts] = useState([
    { id: '1', name: 'HubSpot', role: 'VP of Sales', meeting: 'Quarterly Expansion & Review', delta: 'Elena mentioned adding 15 SDR seats next month' },
    { id: '2', name: 'Salesforce', role: 'Enterprise Account Director', meeting: 'Platform Integration Review', delta: 'Pilot evaluation phase completed' },
    { id: '3', name: 'Atlassian', role: 'Head of RevOps', meeting: 'Security & Compliance Review', delta: 'Requested zero data retention agreement' }
  ]);

  const [selectedAccountId, setSelectedAccountId] = useState('1');
  const [activeTab, setActiveTab] = useState<'brief' | 'kb'>('brief');
  const [isLoading, setIsLoading] = useState(false);
  const [briefResult, setBriefResult] = useState<any>(null);

  const [newCompanyName, setNewCompanyName] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('precall_profile');
    if (saved) {
      setSellerProfile(JSON.parse(saved));
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const saveOnboarding = () => {
    localStorage.setItem('precall_profile', JSON.stringify(sellerProfile));
    setShowOnboarding(false);
  };

  const handleGenerateBrief = async (company: string, role: string, delta: string = '') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany: company,
          attendeeRole: role,
          previousNotes: delta,
          knowledgeBase: sellerProfile
        })
      });
      const json = await res.json();
      if (json.success) {
        setBriefResult(json.data);
      } else {
        alert(json.error || 'Failed to generate brief');
      }
    } catch (e) {
      alert('Error contacting AI agent');
    } finally {
      setIsLoading(false);
    }
  };

  const currentAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-3.5 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">PreCall <span className="text-indigo-400">AI</span></span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">Live Release</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { setOnboardingStep(1); setShowOnboarding(true); }} 
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 transition"
          >
            ⚙️ Setup & Onboarding
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-200">{sellerProfile.userName}</p>
            <p className="text-[10px] text-slate-400">{sellerProfile.companyName} • {sellerProfile.userRole}</p>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Target Accounts</span>
              <span className="text-xs font-normal lowercase text-slate-400">{accounts.length} active</span>
            </h2>
            <div className="space-y-2">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    handleGenerateBrief(acc.name, acc.role, acc.delta);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition duration-150 ${
                    selectedAccountId === acc.id 
                      ? 'bg-indigo-950/70 border-indigo-600/80 text-white shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{acc.name}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">{acc.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">{acc.meeting}</p>
                </button>
              ))}
            </div>

            {/* Custom Account */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-2">Research New Custom Account</p>
              <input 
                type="text" 
                placeholder="Company (e.g. Nvidia, Stripe)" 
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 mb-2 focus:border-indigo-500 focus:outline-none"
              />
              <input 
                type="text" 
                placeholder="Attendee Role (e.g. VP Engineering)" 
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 mb-2 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!newCompanyName || !newRole) return alert('Please enter company and role');
                  const newAcc = { id: Date.now().toString(), name: newCompanyName, role: newRole, meeting: 'Strategy Call', delta: 'New Account' };
                  setAccounts([newAcc, ...accounts]);
                  setSelectedAccountId(newAcc.id);
                  handleGenerateBrief(newCompanyName, newRole);
                  setNewCompanyName('');
                  setNewRole('');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-md text-xs transition shadow-md shadow-indigo-600/20"
              >
                ✨ Trigger Agent Research
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex space-x-1">
            <button 
              onClick={() => setActiveTab('brief')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${activeTab === 'brief' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📋 Meeting Brief
            </button>
            <button 
              onClick={() => setActiveTab('kb')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${activeTab === 'kb' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📚 Knowledge Base
            </button>
          </div>
        </aside>

        {/* Right Column */}
        <main className="lg:col-span-8">
          {activeTab === 'kb' ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">📚 Seller Knowledge Base</h2>
              <p className="text-xs text-slate-400">
                Your custom product information below is dynamically injected into Gemini to tailor every talking point.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Company Name</label>
                <input 
                  type="text" 
                  value={sellerProfile.companyName}
                  onChange={e => setSellerProfile({...sellerProfile, companyName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Core Product Pitch & Value Proposition</label>
                <textarea 
                  rows={3}
                  value={sellerProfile.valueProp}
                  onChange={e => setSellerProfile({...sellerProfile, valueProp: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Battlecards & Differentiators</label>
                <textarea 
                  rows={4}
                  value={sellerProfile.battlecards}
                  onChange={e => setSellerProfile({...sellerProfile, battlecards: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  localStorage.setItem('precall_profile', JSON.stringify(sellerProfile));
                  alert('Knowledge Base saved!');
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition"
              >
                Save Knowledge Base
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h1 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>🏢 {currentAccount?.name}</span>
                    <span className="text-xs font-normal text-slate-400">• {currentAccount?.role}</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">{currentAccount?.meeting}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleGenerateBrief(currentAccount?.name || '', currentAccount?.role || '', currentAccount?.delta || '')}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                  >
                    {isLoading ? 'Researching Live...' : '⚡ Refresh AI Brief'}
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700"
                  >
                    🖨️ Print / PDF
                  </button>
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-slate-200 font-semibold">Autonomous Agents researching {currentAccount?.name}...</p>
                  <p className="text-xs text-slate-400 mt-1">Gathering market context, matching battlecards, and generating talking points</p>
                </div>
              )}

              {/* Brief */}
              {!isLoading && briefResult && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">1. Executive Overview</h3>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                      {briefResult.executiveSummary}
                    </p>
                  </div>

                  {briefResult.recentTriggers?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">2. Key Signals & Recent Triggers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {briefResult.recentTriggers.map((trig: string, idx: number) => (
                          <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-xs text-slate-300">
                            ⚡ {trig}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">3. Personalized Talking Points ({currentAccount?.role})</h3>
                    <ul className="space-y-2">
                      {briefResult.tailoredTalkingPoints?.map((tp: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">4. Strategic Discovery Questions</h3>
                    <ul className="space-y-2">
                      {briefResult.discoveryQuestions?.map((q: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                          <span className="text-blue-400 font-bold">?</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {briefResult.objectionHandling && (
                    <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-lg">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                        🛡️ Anticipated Objection & Recommended Pivot
                      </h3>
                      <p className="text-xs font-semibold text-rose-200 mt-2">⚠️ Objection: "{briefResult.objectionHandling.likelyObjection}"</p>
                      <p className="text-xs text-slate-300 mt-1">💡 Response: {briefResult.objectionHandling.recommendedPivot}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Initial State */}
              {!isLoading && !briefResult && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
                  <p className="text-sm font-semibold text-slate-200">No brief generated yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "⚡ Refresh AI Brief" above or select any target account on the left.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">🚀 Welcome to PreCall AI Setup</h3>
              <span className="text-xs text-slate-400">Step {onboardingStep} of 3</span>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">Set up your profile to tailor meeting briefs:</p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Full Name</label>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>Account Executive (AE)</option>
                    <option>Sales Development Rep (SDR)</option>
                    <option>Founder / CEO (Sales)</option>
                    <option>Sales Manager / Director</option>
                  </select>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">Define your product so the AI knows what you sell:</p>
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
                  <label className="block text-xs text-slate-400 mb-1">Value Proposition / Product Pitch</label>
                  <textarea 
                    rows={3} 
                    value={sellerProfile.valueProp} 
                    onChange={e => setSellerProfile({...sellerProfile, valueProp: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4 text-center py-4">
                <div className="text-4xl mb-2">🎉</div>
                <h4 className="text-base font-bold text-white">You're Ready to Launch!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your Knowledge Base is linked to the Gemini Agent. Select any account to generate a brief.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              {onboardingStep > 1 ? (
                <button 
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
                >
                  Back
                </button>
              ) : <div />}

              {onboardingStep < 3 ? (
                <button 
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Continue →
                </button>
              ) : (
                <button 
                  onClick={saveOnboarding}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2 rounded-lg"
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
