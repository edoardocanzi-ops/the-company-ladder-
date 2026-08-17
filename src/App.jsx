import React, { useState, useEffect } from 'react';

const Icons = {
    Desk: () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>,
    Coffee: () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
    Ascend: () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>,
    Shop: () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
};

const RANKS = [
    { id: 0, title: "Unpaid Intern", salary: 0, reqHard: 0, reqSoft: 0, reqPol: 0 },
    { id: 1, title: "Junior Analyst", salary: 150, reqHard: 15, reqSoft: 5, reqPol: 0 },
    { id: 2, title: "Associate", salary: 400, reqHard: 35, reqSoft: 20, reqPol: 15 },
    { id: 3, title: "Project Manager", salary: 900, reqHard: 60, reqSoft: 50, reqPol: 40 },
    { id: 4, title: "Department Director", salary: 2500, reqHard: 100, reqSoft: 90, reqPol: 85 },
    { id: 5, title: "Vice President", salary: 6000, reqHard: 150, reqSoft: 140, reqPol: 150 },
    { id: 6, title: "CEO", salary: 20000, reqHard: 250, reqSoft: 250, reqPol: 250 }
];

const SHOP_ITEMS = [
    { id: 1, name: "Online Coding Bootcamp", cost: 200, type: "hard", boost: 10 },
    { id: 2, name: "Public Speaking Seminar", cost: 300, type: "soft", boost: 15 },
    { id: 3, name: "Golf Club Membership", cost: 1000, type: "pol", boost: 30 },
    { id: 4, name: "Custom Tailored Suit", cost: 800, type: "soft", boost: 25 },
    { id: 5, name: "Executive MBA", cost: 5000, type: "hard", boost: 100 }
];

const App = () => {
    const [activeApp, setActiveApp] = useState('desk');
    const [toast, setToast] = useState(null);
    
    const [player, setPlayer] = useState({
        day: 1,
        money: 50,
        energy: 100,
        stress: 0,
        rank: 0,
        stats: { hard: 0, soft: 0, pol: 0 }
    });

    const [logs, setLogs] = useState(["Welcome to Quantum Inc. You are an unpaid intern. Get to work."]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
    const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 15));
    const formatMoney = (num) => '$' + Math.floor(num).toLocaleString();
      const doWork = () => {
        if (player.energy < 20) { showToast("You are too exhausted to work!"); return; }
        if (player.stress >= 90) { showToast("You are on the verge of a breakdown! Rest!"); return; }

        const hardGain = Math.floor(Math.random() * 3) + 1;
        const stressGain = Math.floor(Math.random() * 10) + 5;

        setPlayer(p => ({
            ...p, 
            energy: p.energy - 20, 
            stress: Math.min(100, p.stress + stressGain),
            stats: { ...p.stats, hard: p.stats.hard + hardGain }
        }));
        
        addLog(`You grinded at your desk. Hard Skills +${hardGain}, Stress +${stressGain}%`);
    };

    const doNetwork = () => {
        if (player.energy < 30) { showToast("You lack the energy to socialize."); return; }
        if (player.stress >= 90) { showToast("You are too stressed to fake a smile."); return; }

        const polGain = Math.floor(Math.random() * 3) + 1;
        const softGain = Math.floor(Math.random() * 2) + 1;
        const stressGain = Math.floor(Math.random() * 5) + 2;

        setPlayer(p => ({
            ...p, 
            energy: p.energy - 30, 
            stress: Math.min(100, p.stress + stressGain),
            stats: { ...p.stats, pol: p.stats.pol + polGain, soft: p.stats.soft + softGain }
        }));

        addLog(`You schmoozed in the breakroom. Politics +${polGain}, Soft Skills +${softGain}`);
    };

    const advanceDay = () => {
        let eventMsg = "";
        let stressRelief = 40;
        
        // Random Event logic
        if (Math.random() > 0.7) {
            const events = [
                { msg: "The boss yelled at you. Stress +20%", effect: (p) => ({...p, stress: Math.min(100, p.stress + 20)}) },
                { msg: "You took credit for a coworker's idea. Politics +5", effect: (p) => ({...p, stats: {...p.stats, pol: p.stats.pol + 5}}) },
                { msg: "Free donuts in the breakroom! Stress -10%", effect: (p) => ({...p, stress: Math.max(0, p.stress - 10)}) }
            ];
            const ev = events[Math.floor(Math.random() * events.length)];
            eventMsg = ev.msg;
            setPlayer(prev => ev.effect(prev));
        }

        setPlayer(p => {
            const dailyPay = RANKS[p.rank].salary;
            const newMoney = p.money + dailyPay;
            const newStress = Math.max(0, p.stress - stressRelief);
            
            if (eventMsg) addLog(eventMsg);
            addLog(`Day ${p.day} ended. You rested and earned ${formatMoney(dailyPay)}.`);
            
            return {
                ...p,
                day: p.day + 1,
                money: newMoney,
                energy: 100,
                stress: newStress
            };
        });
    };

    const buyItem = (item) => {
        if (player.money < item.cost) { showToast("Insufficient funds!"); return; }
        
        setPlayer(p => ({
            ...p,
            money: p.money - item.cost,
            stats: { ...p.stats, [item.type]: p.stats[item.type] + item.boost }
        }));
        addLog(`Bought ${item.name}! ${item.type.toUpperCase()} +${item.boost}`);
        showToast("Purchase successful!");
    };

    const requestPromotion = () => {
        const nextRank = RANKS[player.rank + 1];
        if (!nextRank) { showToast("You are already the CEO!"); return; }

        if (player.stats.hard >= nextRank.reqHard && 
            player.stats.soft >= nextRank.reqSoft && 
            player.stats.pol >= nextRank.reqPol) {
            
            setPlayer(p => ({ ...p, rank: p.rank + 1, stress: 0 }));
            addLog(`PROMOTED! You are now a ${nextRank.title}.`);
            showToast(`Promoted to ${nextRank.title}!`);
        } else {
            setPlayer(p => ({ ...p, stress: Math.min(100, p.stress + 20) }));
            addLog(`Promotion denied. You lack the required skills. Stress +20%`);
            showToast("You bombed the review. Keep grinding.");
        }
    };

    const WindowApp = ({ title, children }) => (
        <div className="absolute inset-0 md:top-[5%] md:left-[5%] md:w-[90%] md:h-[90%] bg-slate-900 md:rounded-xl border-slate-700 md:border shadow-2xl flex flex-col z-10 overflow-hidden">
            <div className="h-12 bg-slate-950 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                <div className="text-slate-400 text-xs font-bold tracking-widest uppercase truncate ml-4">{title}</div>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col relative bg-slate-900 p-4 md:p-6 custom-scrollbar">
                {children}
            </div>
        </div>
    );
      return (
        <div className="h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
            
            {/* Top Corporate ID Badge */}
            <div className="w-full bg-black/80 flex flex-col md:flex-row justify-between items-center px-4 py-3 z-40 shrink-0 border-b border-slate-800 gap-2">
                <div className="flex justify-between w-full md:w-auto md:gap-6">
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Employee ID: 9482</div>
                        <div className="font-bold text-sky-400 text-sm md:text-base">{RANKS[player.rank].title}</div>
                    </div>
                    <div className="text-right md:text-left">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bank</div>
                        <div className="font-mono text-green-400 font-bold">{formatMoney(player.money)}</div>
                    </div>
                </div>
                
                <div className="flex w-full md:w-auto gap-4 md:gap-6 text-xs md:text-sm font-bold bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="flex-1 text-center">
                        <div className="text-slate-500 text-[10px] uppercase mb-1">Energy</div>
                        <div className="text-yellow-400">{player.energy}/100</div>
                    </div>
                    <div className="w-px bg-slate-700"></div>
                    <div className="flex-1 text-center">
                        <div className="text-slate-500 text-[10px] uppercase mb-1">Stress</div>
                        <div className={`${player.stress > 80 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>{player.stress}%</div>
                    </div>
                    <div className="w-px bg-slate-700"></div>
                    <div className="flex-1 text-center">
                        <div className="text-slate-500 text-[10px] uppercase mb-1">Day</div>
                        <div className="text-white">{player.day}</div>
                    </div>
                </div>
            </div>

            {/* Desktop / Workspace Area */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-neutral-900">
                
                {activeApp === 'desk' && (
                    <WindowApp title="Your Cubicle">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
                                    <h2 className="text-lg font-bold text-sky-400 mb-4 uppercase tracking-wide">Daily Grind</h2>
                                    <p className="text-xs text-slate-400 mb-6">Complete tasks to gain Hard Skills. Network to gain Politics and Soft Skills. Do not let Stress reach 100%.</p>
                                    
                                    <div className="space-y-3">
                                        <button onClick={doWork} className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-lg font-bold flex justify-between items-center transition-colors text-sm shadow-md">
                                            <span>Process Paperwork</span><span className="text-yellow-400 text-xs">-20 EN</span>
                                        </button>
                                        <button onClick={doNetwork} className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-4 rounded-lg font-bold flex justify-between items-center transition-colors text-sm shadow-md">
                                            <span>Watercooler Gossip</span><span className="text-yellow-400 text-xs">-30 EN</span>
                                        </button>
                                        <button onClick={advanceDay} className="w-full mt-4 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 p-4 rounded-lg font-bold text-base transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                                            Go Home & Sleep ➔
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-y-auto shadow-md">
                                <h3 className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wider sticky top-0 bg-slate-800 pb-2 border-b border-slate-700">Activity Log</h3>
                                <div className="space-y-2 text-xs md:text-sm font-mono text-slate-300">
                                    {logs.map((log, i) => (
                                        <div key={i} className={`pb-2 ${i !== logs.length -1 ? 'border-b border-slate-700/50' : ''} ${i === 0 ? 'text-white font-bold' : 'opacity-70'}`}>
                                            > {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </WindowApp>
                )}

                {activeApp === 'career' && (
                    <WindowApp title="Career Portal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto">
                            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md h-fit">
                                <h2 className="text-lg font-bold text-sky-400 mb-4 uppercase tracking-wide">Your Resume</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-400 font-bold uppercase">Hard Skills (Tech/Data)</span><span className="text-white font-mono">{player.stats.hard}</span></div>
                                        <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-sky-500 h-2 rounded-full" style={{width: `${Math.min(100, (player.stats.hard / 250) * 100)}%`}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-400 font-bold uppercase">Soft Skills (Leadership)</span><span className="text-white font-mono">{player.stats.soft}</span></div>
                                        <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{width: `${Math.min(100, (player.stats.soft / 250) * 100)}%`}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-400 font-bold uppercase">Office Politics</span><span className="text-white font-mono">{player.stats.pol}</span></div>
                                        <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min(100, (player.stats.pol / 250) * 100)}%`}}></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
                                <h2 className="text-lg font-bold text-yellow-400 mb-1 uppercase tracking-wide">Performance Review</h2>
                                {RANKS[player.rank + 1] ? (
                                    <>
                                        <p className="text-xs text-slate-400 mb-4">Requirements for: <span className="text-white font-bold">{RANKS[player.rank + 1].title}</span></p>
                                        <div className="space-y-2 font-mono text-xs mb-6 bg-slate-900 p-4 rounded border border-slate-700">
                                            <div className="flex justify-between"><span>Req. Hard Skills:</span><span className={player.stats.hard >= RANKS[player.rank+1].reqHard ? 'text-green-400' : 'text-red-400'}>{player.stats.hard} / {RANKS[player.rank + 1].reqHard}</span></div>
                                            <div className="flex justify-between"><span>Req. Soft Skills:</span><span className={player.stats.soft >= RANKS[player.rank+1].reqSoft ? 'text-green-400' : 'text-red-400'}>{player.stats.soft} / {RANKS[player.rank + 1].reqSoft}</span></div>
                                            <div className="flex justify-between"><span>Req. Politics:</span><span className={player.stats.pol >= RANKS[player.rank+1].reqPol ? 'text-green-400' : 'text-red-400'}>{player.stats.pol} / {RANKS[player.rank + 1].reqPol}</span></div>
                                            <div className="pt-2 mt-2 border-t border-slate-700 flex justify-between text-sky-400 font-bold"><span>New Salary:</span><span>{formatMoney(RANKS[player.rank + 1].salary)}/day</span></div>
                                        </div>
                                        <button onClick={requestPromotion} className="w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-slate-950 py-3 rounded font-bold transition-colors shadow-md">
                                            Request Promotion
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-green-400 font-bold text-xl">You are the CEO. You won the game.</div>
                                )}
                            </div>
                        </div>
                    </WindowApp>
                )}

                {activeApp === 'shop' && (
                    <WindowApp title="Corporate Marketplace">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto">
                            {SHOP_ITEMS.map(item => (
                                <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="font-bold text-white mb-1">{item.name}</div>
                                        <div className="text-xs font-mono mb-4 inline-block px-2 py-1 rounded bg-slate-900 border border-slate-700">
                                            +{item.boost} <span className="uppercase text-sky-400">{item.type} skill</span>
                                        </div>
                                    </div>
                                    <button onClick={() => buyItem(item)} className="w-full bg-slate-700 hover:bg-green-600 active:bg-green-700 text-white py-2 rounded font-bold text-sm transition-colors flex justify-between px-4 shadow-md">
                                        <span>Purchase</span><span className="font-mono text-green-300">{formatMoney(item.cost)}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </WindowApp>
                )}

                {toast && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded shadow-2xl z-50 text-xs md:text-sm whitespace-nowrap animate-bounce">{toast}</div>}
            </div>

            {/* Bottom Taskbar */}
            <div className="h-[60px] md:h-[70px] bg-slate-950 flex justify-center items-center gap-6 md:gap-10 border-t border-slate-800 z-50 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex justify-center items-center cursor-pointer transition-all ${activeApp === 'desk' ? 'bg-slate-800 border-sky-400 text-sky-400 border' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveApp('desk')}>
                    <Icons.Desk />
                </div>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex justify-center items-center cursor-pointer transition-all ${activeApp === 'career' ? 'bg-slate-800 border-sky-400 text-sky-400 border' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveApp('career')}>
                    <Icons.Ascend />
                </div>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex justify-center items-center cursor-pointer transition-all ${activeApp === 'shop' ? 'bg-slate-800 border-sky-400 text-sky-400 border' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveApp('shop')}>
                    <Icons.Shop />
                </div>
            </div>

        </div>
    );
};

export default App;

  
