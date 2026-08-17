import React, { useState, useEffect } from 'react';

const Icons = {
    Desk: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>,
    Stats: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
    Shop: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
    Lock: () => <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
    Refresh: () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
};

const RANKS = [
    { id: 0, title: "Data Entry Temp", salary: 400, quotaBase: 50, reqPol: 0 },
    { id: 1, title: "Junior Analyst", salary: 800, quotaBase: 120, reqPol: 30 },
    { id: 2, title: "Associate", salary: 1500, quotaBase: 250, reqPol: 80 },
    { id: 3, title: "Project Manager", salary: 3000, quotaBase: 450, reqPol: 150 },
    { id: 4, title: "Director", salary: 6500, quotaBase: 800, reqPol: 300 },
    { id: 5, title: "VP of Operations", salary: 15000, quotaBase: 1500, reqPol: 600 }
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const App = () => {
    const [activeTab, setActiveTab] = useState('desk');
    const [toast, setToast] = useState(null);
    
    const [time, setTime] = useState({ week: 1, day: 0, hour: 9 });
    const [status, setStatus] = useState({ strikes: 0, isFired: false });
    
    const [player, setPlayer] = useState({
        money: 100, perf: 0, pol: 0, burnout: 0, rank: 0, tools: 0
    });

    const [quota, setQuota] = useState(RANKS[0].quotaBase);
    const [logs, setLogs] = useState([`Welcome to the intranet. Hit your quota by Friday 5 PM. 3 strikes = fired.`]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
    const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 15));
    const formatMoney = (num) => '$' + Math.floor(num).toLocaleString();
    const formatTime = (h) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;

    const getUrl = () => {
        if (activeTab === 'desk') return 'https://intranet.quantum.inc/workspace';
        if (activeTab === 'career') return 'https://hr.quantum.inc/performance-review';
        if (activeTab === 'shop') return 'https://procurement.quantum.inc/software-catalog';
    };
        const advanceTime = (hoursSpent) => {
        let newHour = time.hour + hoursSpent;
        let newDay = time.day;
        let newWeek = time.week;

        if (newHour >= 17) { 
            newHour = 9; 
            if (time.day === 4) { 
                handleEndOfWeek();
                newDay = 0;
                newWeek++;
            } else {
                newDay++;
                addLog(`End of ${DAYS[time.day]}. You went home to sleep. (-30% Burnout)`);
                setPlayer(p => ({ ...p, burnout: Math.max(0, p.burnout - 30) }));
            }
        }
        setTime({ week: newWeek, day: newDay, hour: newHour });
    };

    const handleEndOfWeek = () => {
        let currentRank = RANKS[player.rank];
        
        if (player.perf >= quota) {
            const bonus = Math.floor((player.perf - quota) * 0.5); 
            const totalPay = currentRank.salary + bonus;
            
            addLog(`FRIDAY REVIEW: Quota met! You earned ${formatMoney(totalPay)}.`);
            showToast(`Payday! +${formatMoney(totalPay)}`);
            
            let nextRank = RANKS[player.rank + 1];
            if (nextRank && player.pol >= nextRank.reqPol && player.perf >= (quota * 1.2)) {
                addLog(`PROMOTED! You are now a ${nextRank.title}.`);
                showToast(`Promoted to ${nextRank.title}!`);
                setPlayer(p => ({ ...p, rank: p.rank + 1, money: p.money + totalPay, perf: 0 }));
                setQuota(nextRank.quotaBase);
            } else {
                setPlayer(p => ({ ...p, money: p.money + totalPay, perf: 0, burnout: Math.max(0, p.burnout - 50) }));
                setQuota(Math.floor(quota * 1.1)); 
            }
        } else {
            let newStrikes = status.strikes + 1;
            addLog(`FRIDAY REVIEW: You MISSED quota! Strike ${newStrikes}/3.`);
            showToast(`Strike ${newStrikes}! Boss is furious.`);
            
            if (newStrikes >= 3) {
                setStatus(s => ({ ...s, isFired: true }));
            } else {
                setStatus(s => ({ ...s, strikes: newStrikes }));
                setPlayer(p => ({ ...p, perf: 0, burnout: Math.max(0, p.burnout - 20) }));
            }
        }
    };

    const doAction = (type) => {
        if (status.isFired) return;

        if (player.burnout >= 100) {
            showToast("COLLAPSE! You are forced to take a sick day.");
            addLog("You collapsed from burnout and lost a whole day. (-50% Burnout)");
            setPlayer(p => ({ ...p, burnout: 50 }));
            advanceTime(8); 
            return;
        }

        let hours = 0; let pGain = 0; let polGain = 0; let bGain = 0;
        const multiplier = 1 + (player.tools * 0.2);

        if (type === 'deepwork') { hours = 2; pGain = Math.floor(15 * multiplier); bGain = 20; addLog(`Deep Work (2h): +${pGain} Perf, +${bGain}% Burnout.`); } 
        else if (type === 'emails') { hours = 1; pGain = Math.floor(5 * multiplier); bGain = 8; addLog(`Cleared Inbox (1h): +${pGain} Perf, +${bGain}% Burnout.`); }
        else if (type === 'network') { hours = 1; pGain = 0; polGain = 5; bGain = 5; addLog(`Watercooler Gossip (1h): +${polGain} Politics.`); }
        else if (type === 'slack') { hours = 1; pGain = -2; bGain = -15; addLog(`Slacked Off (1h): -15% Burnout, Lost 2 Perf.`); }

        setPlayer(p => ({ ...p, perf: Math.max(0, p.perf + pGain), pol: p.pol + polGain, burnout: p.burnout + bGain }));
        advanceTime(hours);
    };

    const buyTool = (cost, boostName) => {
        if (player.money < cost) { showToast("Not enough money."); return; }
        setPlayer(p => ({ ...p, money: p.money - cost, tools: p.tools + 1 }));
        addLog(`Bought ${boostName}. Work efficiency increased!`);
        showToast("Purchased!");
    };
        if (status.isFired) {
        return (
            <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center font-sans">
                <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md p-8 rounded-2xl max-w-md w-full shadow-[0_8px_32px_rgba(239,68,68,0.2)]">
                    <h1 className="text-4xl font-bold mb-4 text-red-500">401 Unauthorized</h1>
                    <p className="text-lg mb-2">Access Denied. Your credentials have been revoked.</p>
                    <p className="text-slate-400 mb-8 text-sm">Reason: 3 Strikes. Terminated at Week {time.week} as a {RANKS[player.rank].title}.</p>
                    <button onClick={() => window.location.reload()} className="w-full bg-red-600/80 hover:bg-red-500 text-white py-3 rounded-lg font-bold transition-colors backdrop-blur-sm">Clear Cookies & Restart</button>
                </div>
            </div>
        );
    }

    // Tab styling helpers
    const activeTabStyle = "bg-slate-800/80 backdrop-blur-md border-t border-x border-white/10 text-sky-400 shadow-[0_-4px_10px_rgba(0,0,0,0.2)] rounded-t-lg z-10 relative -mb-[1px]";
    const inactiveTabStyle = "bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300 border-t border-x border-transparent rounded-t-lg transition-colors";

    return (
        <div className="h-[100dvh] w-full flex flex-col font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden text-slate-200 selection:bg-sky-500/30">
            
            {/* Fake Browser Chrome */}
            <div className="w-full flex flex-col bg-slate-950/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                
                {/* 1. Window Controls & Tabs */}
                <div className="flex items-end px-3 pt-2 gap-2 overflow-x-auto hide-scroll">
                    <div className="flex gap-1.5 pb-2 pr-4 pl-1 hidden md:flex">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    
                    <button onClick={() => setActiveTab('desk')} className={`flex items-center gap-2 px-4 py-2 min-w-[140px] text-xs font-semibold ${activeTab === 'desk' ? activeTabStyle : inactiveTabStyle}`}>
                        <Icons.Desk /> Workspace
                    </button>
                    <button onClick={() => setActiveTab('career')} className={`flex items-center gap-2 px-4 py-2 min-w-[140px] text-xs font-semibold ${activeTab === 'career' ? activeTabStyle : inactiveTabStyle}`}>
                        <Icons.Stats /> HR Profile
                    </button>
                    <button onClick={() => setActiveTab('shop')} className={`flex items-center gap-2 px-4 py-2 min-w-[140px] text-xs font-semibold ${activeTab === 'shop' ? activeTabStyle : inactiveTabStyle}`}>
                        <Icons.Shop /> Procurement
                    </button>
                </div>

                {/* 2. Address Bar */}
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 border-y border-white/5">
                    <div className="flex gap-2">
                        <div className="p-1 rounded hover:bg-white/10 text-slate-500 cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></div>
                        <div className="p-1 rounded hover:bg-white/10 text-slate-500 cursor-pointer"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></div>
                        <div className="p-1 rounded hover:bg-white/10 cursor-pointer"><Icons.Refresh /></div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/5 rounded-full px-4 py-1.5 backdrop-blur-md">
                        <Icons.Lock />
                        <span className="text-xs font-mono text-slate-300 truncate">{getUrl()}</span>
                    </div>
                </div>

                {/* 3. Bookmarks Bar (Game HUD) */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/30 text-[10px] md:text-xs">
                    <div className="flex items-center gap-4 md:gap-6 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5"><span className="text-slate-500">Date:</span> <span className="text-sky-300">{DAYS[time.day]}, Wk {time.week}</span></div>
                        <div className="flex items-center gap-1.5"><span className="text-slate-500">Time:</span> <span className="text-white">{formatTime(time.hour)}</span></div>
                        <div className="flex items-center gap-1.5 hidden sm:flex"><span className="text-slate-500">Bank:</span> <span className="text-green-400 font-bold">{formatMoney(player.money)}</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">Quota:</span>
                            <div className="w-16 md:w-24 bg-black/50 rounded-full h-1.5 border border-white/5"><div className={`h-1.5 rounded-full ${player.perf >= quota ? 'bg-green-400' : 'bg-sky-400'}`} style={{width: `${Math.min(100, (player.perf / quota) * 100)}%`}}></div></div>
                            <span className={player.perf >= quota ? 'text-green-400 font-bold' : ''}>{player.perf}/{quota}</span>
                        </div>
                        <div className="flex items-center gap-2 hidden md:flex">
                            <span className="text-slate-500">Burnout:</span>
                            <div className="w-24 bg-black/50 rounded-full h-1.5 border border-white/5"><div className={`h-1.5 rounded-full ${player.burnout > 80 ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} style={{width: `${Math.min(100, player.burnout)}%`}}></div></div>
                            <span className={player.burnout > 80 ? 'text-red-500 font-bold' : ''}>{player.burnout}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Browser Viewport (The App Content) */}
            <div className="flex-1 relative overflow-y-auto p-4 md:p-6 custom-scrollbar">
                
                {activeTab === 'desk' && (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="flex flex-col gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                                <h2 className="text-xl font-bold text-sky-300 mb-1">Intranet Workspace</h2>
                                <p className="text-xs text-slate-400 mb-6">Action center. Select a task to advance the workday.</p>
                                
                                <div className="space-y-3">
                                    <button onClick={() => doAction('deepwork')} className="w-full bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center transition-all">
                                        <div className="text-left"><div className="font-bold text-slate-200">Deep Work</div><div className="text-[10px] text-slate-400 mt-0.5">High Perf, High Burnout</div></div>
                                        <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-2 py-1 rounded">2 Hours</span>
                                    </button>
                                    <button onClick={() => doAction('emails')} className="w-full bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center transition-all">
                                        <div className="text-left"><div className="font-bold text-slate-200">Clear Inbox</div><div className="text-[10px] text-slate-400 mt-0.5">Low Perf, Low Burnout</div></div>
                                        <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-2 py-1 rounded">1 Hour</span>
                                    </button>
                                    <button onClick={() => doAction('network')} className="w-full bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center transition-all">
                                        <div className="text-left"><div className="font-bold text-slate-200">Office Politics</div><div className="text-[10px] text-slate-400 mt-0.5">Gain Pol, Moderate Burnout</div></div>
                                        <span className="bg-purple-500/20 text-purple-300 text-[10px] font-mono px-2 py-1 rounded">1 Hour</span>
                                    </button>
                                    <button onClick={() => doAction('slack')} className="w-full bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center transition-all">
                                        <div className="text-left"><div className="font-bold text-slate-200">Slack Off</div><div className="text-[10px] text-slate-400 mt-0.5">Reduce Burnout, Lose Perf</div></div>
                                        <span className="bg-green-500/20 text-green-300 text-[10px] font-mono px-2 py-1 rounded">1 Hour</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Mobile-only visible Burnout/Money fallback */}
                            <div className="md:hidden grid grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Burnout Level</div>
                                    <div className={`font-mono text-xl ${player.burnout > 80 ? 'text-red-500' : 'text-orange-400'}`}>{player.burnout}%</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Bank Balance</div>
                                    <div className="font-mono text-xl text-green-400">{formatMoney(player.money)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 flex flex-col h-[400px] md:h-auto">
                            <h3 className="font-bold text-xs text-slate-400 mb-4 uppercase tracking-widest border-b border-white/10 pb-3">Activity Log</h3>
                            <div className="flex-1 overflow-y-auto space-y-3 text-xs md:text-sm font-mono text-slate-300 pr-2">
                                {logs.map((log, i) => (
                                    <div key={i} className={`pb-3 ${i !== logs.length -1 ? 'border-b border-white/5' : ''} ${i === 0 ? 'text-sky-100 font-bold' : 'opacity-60'}`}>
                                        <span className="text-sky-500/50 mr-2">{'>'}</span>{log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'career' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-1">{RANKS[player.rank].title}</h2>
                            <p className="text-sm text-red-400 font-bold mb-8 flex items-center gap-2">
                                Strikes: <span className="flex gap-1">
                                    {[1,2,3].map(s => <span key={s} className={`w-3 h-3 rounded-full ${s <= status.strikes ? 'bg-red-500' : 'bg-white/10'}`}></span>)}
                                </span>
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Politics Score</span>
                                    <span className="text-purple-400 font-mono font-bold text-2xl">{player.pol}</span>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Efficiency Multiplier</span>
                                    <span className="text-sky-400 font-mono font-bold text-2xl">x{(1 + (player.tools * 0.2)).toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Next Promotion Path</h3>
                                {RANKS[player.rank + 1] ? (
                                    <div className="bg-sky-900/10 p-5 rounded-xl border border-sky-500/20 font-mono text-sm">
                                        <div className="text-sky-200 font-bold mb-4 text-lg">{RANKS[player.rank + 1].title}</div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400">Required Politics:</span>
                                                <span className={`px-2 py-1 rounded text-xs ${player.pol >= RANKS[player.rank+1].reqPol ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{player.pol} / {RANKS[player.rank + 1].reqPol}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-400">
                                                <span>Required Perf:</span>
                                                <span className="text-right text-xs">Exceed Quota by 20% on Friday</span>
                                            </div>
                                        </div>
                                        <div className="mt-5 pt-4 border-t border-white/5 text-sky-400 font-bold flex justify-between">
                                            <span>New Salary Target:</span> <span>{formatMoney(RANKS[player.rank + 1].salary)}/week</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-green-400 font-bold text-center">
                                        Maximum clearance achieved. You are at the top of the corporate ladder.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'shop' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[
                                { name: 'Productivity Software', cost: 300, desc: 'Increases Task Performance' },
                                { name: 'Dual Monitors', cost: 800, desc: 'Increases Task Performance' },
                                { name: 'Ergonomic Chair', cost: 2500, desc: 'Increases Task Performance' },
                                { name: 'Mechanical Keyboard', cost: 120, desc: 'Increases Task Performance' },
                                { name: 'Noise Cancelling Headphones', cost: 450, desc: 'Increases Task Performance' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex flex-col justify-between group hover:bg-white/10 transition-all">
                                    <div className="mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                                            <Icons.Shop />
                                        </div>
                                        <div className="font-bold text-slate-200 mb-1">{item.name}</div>
                                        <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc} permanently by a flat multiplier.</div>
                                    </div>
                                    <button onClick={() => buyTool(item.cost, item.name)} className="w-full bg-white/5 group-hover:bg-sky-500 border border-white/10 group-hover:border-sky-400 text-slate-300 group-hover:text-white py-2.5 rounded-xl font-bold text-xs transition-all flex justify-between px-4 items-center">
                                        <span>Requisition</span>
                                        <span className="font-mono">{formatMoney(item.cost)}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toasts */}
                {toast && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 text-sm font-semibold whitespace-nowrap animate-[bounce_1s_infinite]">
                        {toast}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
                                        
    
    
