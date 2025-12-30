"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGIGAI } from "@/hooks/useGIGAI";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal"; // Import Modal
import Typewriter from "@/components/Typewriter";
import { Lightbulb, Code2, BookOpen, Github, Search, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectIdea } from "@/types/api";

export default function Home() {
  const { loading, ideas, roadmap, issues, explanation, actions } = useGIGAI();
  const [activeTab, setActiveTab] = useState<'ideas' | 'roadmap' | 'contribute' | 'explain'>('ideas');

  // Modal State
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

  const [userState, setUserState] = useState({
    id: "",
    skills: [] as string[],
    frameworks: [] as string[],
    level: "Intermediate",
    interests: ""
  });

  const [repoUrl, setRepoUrl] = useState("");
  const [roadmapTopic, setRoadmapTopic] = useState("");

  return (
    <DashboardLayout userState={userState} setUserState={setUserState} activeContext={activeTab}>

      {/* Hero Command Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
          <span className="text-text-muted font-normal">Welcome back,</span> {userState.id || 'Engineer'}
        </h1>
        <div className="flex flex-wrap gap-4 border-b border-border pb-4 mt-8">
          {[
            { id: 'ideas', label: 'Idea Generator', icon: Lightbulb },
            { id: 'explain', label: 'Decrypt Repo', icon: Code2 },
            { id: 'roadmap', label: 'Learning Path', icon: BookOpen },
            { id: 'contribute', label: 'Open Source', icon: Github },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeTab === tab.id
                  ? 'bg-surface border border-primary/30 text-white shadow-glow'
                  : 'text-text-muted hover:text-white hover:bg-surface border border-transparent'}
                `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">

        {/* IDEAS TAB */}
        {activeTab === 'ideas' && (
          <motion.div
            key="ideas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="relative group">
              <input
                value={userState.interests}
                onChange={e => setUserState({ ...userState, interests: e.target.value })}
                className="w-full bg-surface border border-border p-6 pr-48 rounded-xl text-xl outline-none focus:border-primary transition-all placeholder:text-text-muted/20"
                placeholder="Target Protocol (e.g. AI Agents, DeFi...)"
              />
              <button
                onClick={() => actions.suggestIdeas({
                  user_id: userState.id || 'guest',
                  languages: userState.skills,
                  frameworks: userState.frameworks,
                  experience_level: userState.level,
                  interests: userState.interests
                })}
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 bg-white text-black hover:bg-zinc-200 px-8 rounded-lg font-bold tracking-wide transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>GENERATE <ArrowRight size={18} /></>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea, i) => (
                <div key={i} onClick={() => setSelectedIdea(idea)} className="cursor-pointer">
                  <ProjectCard idea={idea} index={i} />
                </div>
              ))}
              {ideas.length === 0 && !loading && (
                <div className="col-span-full h-64 flex items-center justify-center border border-dashed border-border rounded-xl text-text-muted font-mono text-sm">
                  AWAITING TARGET INPUT...
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Other Tabs... (Keep them as is) */}
        {activeTab === 'explain' && (
          <motion.div key="explain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8">
              <input
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                className="flex-1 bg-surface border border-border rounded-lg p-4 font-mono text-sm focus:border-primary outline-none"
                placeholder="https://github.com/..."
              />
              <button
                onClick={() => actions.explainer(repoUrl, userState.level)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 rounded-lg font-bold shadow-glow transition-all"
              >
                ANALYZE
              </button>
            </div>
            {explanation && (
              <div className="bg-surface border border-border p-8 rounded-xl font-mono text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                <Typewriter text={explanation} speed={1} />
              </div>
            )}
          </motion.div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8">
              <input
                value={roadmapTopic}
                onChange={e => setRoadmapTopic(e.target.value)}
                className="flex-1 bg-surface border border-border rounded-lg p-4 font-mono text-sm focus:border-primary outline-none"
                placeholder="Skill Target (e.g. Kernel Dev)"
              />
              <button
                onClick={() => actions.generateRoadmap(roadmapTopic)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 rounded-lg font-bold shadow-glow transition-all"
              >
                INITIATE
              </button>
            </div>
            {roadmap && (
              <div className="bg-surface border border-border p-8 rounded-xl font-mono text-sm text-text-muted leading-relaxed whitespace-pre-wrap relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                <Typewriter text={roadmap} speed={1} />
              </div>
            )}
          </motion.div>
        )}

        {/* CONTRIBUTIONS TAB */}
        {activeTab === 'contribute' && (
          <motion.div key="contribute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-xl">
              <div>
                <h3 className="text-lg font-bold text-white">Open Source Recon</h3>
                <p className="text-sm text-text-muted">Targeting issues for: {userState.skills.join(', ')}</p>
              </div>
              <button
                onClick={() => actions.findContributions(userState.skills)}
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-lg font-bold transition-all"
              >
                SCAN
              </button>
            </div>

            <div className="grid gap-3">
              {issues.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center justify-between bg-surface border border-border p-4 rounded-lg hover:border-text-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Github size={20} className="text-text-muted group-hover:text-white" />
                    <div>
                      <a href={issue.html_url} target="_blank" className="font-medium text-white hover:underline decoration-primary underline-offset-4">{issue.title}</a>
                      <div className="flex gap-2 mt-1">
                        {issue.labels.map(l => (
                          <span key={l} className="text-[10px] bg-black border border-border px-1.5 rounded text-text-muted uppercase">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a href={issue.html_url} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-primary">ACCESS &rarr;</a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Project Modal Integration */}
      <ProjectModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />

    </DashboardLayout>
  );
}
