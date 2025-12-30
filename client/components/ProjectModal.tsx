"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Database, List, Code, Layers } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectIdea } from "@/types/api";

interface ProjectModalProps {
    idea: ProjectIdea | null;
    onClose: () => void;
}

import { createPortal } from "react-dom";

// ... (keep props interface)

export default function ProjectModal({ idea, onClose }: ProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [spec, setSpec] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (idea) {
            setSpec("");
            setLoading(true);
            axios.post('http://localhost:5000/api/github/elaborate', {
                title: idea.title,
                description: idea.description,
                tech_stack: idea.tech_stack
            })
                .then(res => setSpec(res.data.spec))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [idea]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {idea && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#1F1F1F] flex justify-between items-start bg-grid-pattern">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${idea.difficulty === 'Advanced' ? 'text-red-400 border-red-400/20 bg-red-400/10' :
                                        idea.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10' :
                                            'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
                                        }`}>
                                        {idea.difficulty.toUpperCase()}
                                    </span>
                                    <span className="text-xs font-mono text-zinc-500">{idea.estimated_time}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{idea.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-zinc-500 hover:text-white transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-zinc-800 relative z-0">
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Layers size={14} /> Overview
                                </h3>
                                <p className="text-zinc-300 leading-relaxed text-sm bg-[#111] p-4 rounded-lg border border-[#1F1F1F]">
                                    {idea.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Code size={14} /> Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(idea.tech_stack)
                                        ? idea.tech_stack
                                        : typeof idea.tech_stack === 'object' && idea.tech_stack !== null
                                            ? Object.values(idea.tech_stack).flat()
                                            : [idea.tech_stack]
                                    ).map((tech, i) => (
                                        <span key={i} className="text-xs font-mono text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded">
                                            {String(tech)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AI Spec */}
                            <div className="border-t border-[#1F1F1F] pt-8">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Database size={14} /> Technical Specification (AI)
                                </h3>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
                                        <Loader2 className="animate-spin text-primary" size={24} />
                                        <span className="font-mono text-xs animate-pulse">GENERATING ARCHITECTURE...</span>
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none font-mono text-zinc-300 prose-headings:text-white prose-headings:font-bold prose-strong:text-primary prose-ul:list-disc prose-ul:pl-4">
                                        {spec ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                                <ReactMarkdown>{spec}</ReactMarkdown>
                                            </motion.div>
                                        ) : (
                                            <span className="text-red-400">Failed to load specification.</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#1F1F1F] bg-[#050505] flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                                CLOSE ORBIT
                            </button>
                            <button className="px-4 py-2 text-xs font-bold bg-white text-black rounded hover:bg-zinc-200 transition-colors">
                                INITIATE PROJECT
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
