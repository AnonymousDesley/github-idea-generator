"use client";

import { useState } from "react";
import { Terminal, Settings, User } from "lucide-react";
import TagInput from "./TagInput";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userState: any;
    setUserState: (s: any) => void;
    activeContext?: string;
}

export default function DashboardLayout({ children, userState, setUserState, activeContext }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-black text-white flex font-sans overflow-hidden">

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Protocol */}
            <motion.aside
                initial={{ width: 0, opacity: 0, x: -300 }}
                animate={{
                    width: sidebarOpen ? 300 : 0,
                    opacity: sidebarOpen ? 1 : 0,
                    x: sidebarOpen ? 0 : -300
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed md:static h-full bg-black border-r border-border flex-shrink-0 flex flex-col z-30 shadow-2xl md:shadow-none`}
            >
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <span className="font-mono text-xs tracking-widest uppercase text-text-muted">GIGAI</span>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-zinc-500">
                        <Settings size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-mono">Identity ID</label>
                            <input
                                value={userState.id}
                                onChange={e => setUserState({ ...userState, id: e.target.value })}
                                className="bg-transparent border-b border-border py-1 text-sm font-mono focus:border-primary outline-none transition-colors placeholder:text-text-muted/20"
                                placeholder="DEV_ID"
                            />
                        </div>

                        <TagInput
                            label="Core Stack"
                            placeholder="LANGUAGES"
                            tags={userState.skills}
                            suggestions={['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'Ruby', 'Swift', 'PHP']}
                            onChange={(tags) => setUserState({ ...userState, skills: tags })}
                        />

                        <TagInput
                            label="Frameworks"
                            placeholder="LIBS"
                            tags={userState.frameworks}
                            suggestions={['React', 'Next.js', 'Vue', 'Svelte', 'Django', 'Flask', 'Express', 'Spring Boot', 'Laravel', 'Flutter']}
                            onChange={(tags) => setUserState({ ...userState, frameworks: tags })}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-mono">Clearance Level</label>
                            <div className="flex flex-col gap-1 bg-surface rounded-md p-1 border border-border">
                                {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setUserState({ ...userState, level: l })}
                                        className={`w-full text-[10px] uppercase py-2 rounded transition-all flex items-center justify-center ${userState.level === l ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                                    >
                                        {l.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border text-[10px] text-text-muted font-mono flex justify-between">
                    <span>SYSTEM: ONLINE</span>
                    <span className="text-green-500">●</span>
                </div>
            </motion.aside>

            {/* Main Stage */}
            <main className="flex-1 h-screen overflow-y-auto bg-background bg-grid-pattern relative w-full">
                <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-border p-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-muted hover:text-white">
                        <Terminal size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-muted hidden sm:inline-block">GIGAI_COMMAND_CENTER</span>
                        <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded border border-primary/20">BETA</span>
                    </div>
                    <div className="w-8" />
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
