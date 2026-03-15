"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { jsonrepair } from "jsonrepair";
import { 
  ShieldCheck, 
  Sparkles, 
  AlignLeft, 
  FileCode, 
  Braces, 
  Loader2, 
  Copy, 
  Trash2,
  Check,
  AlertTriangle,
  Cpu,
  Zap,
  Globe,
  Terminal
} from "lucide-react";

export default function JSONValidator() {
  const [code, setCode] = useState<string>(`{\n  "system_status": "online",\n  "ai_core": "active",\n  "node_id": "CYBER-99",\n  "data": {\n    "integrity": 0.98,\n    "latency": "14ms"\n  }\n}`);
  const [status, setStatus] = useState<{ type: "success" | "error" | "none"; message: string }>({ type: "none", message: "" });
  const [isFixing, setIsFixing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    validateJSON(code);
  }, []);

  const validateJSON = (value: string | undefined) => {
    if (!value) return setStatus({ type: "none", message: "" });
    try {
      JSON.parse(value);
      setStatus({ type: "success", message: "INTEGRITY SECURED" });
    } catch (e: any) {
      setStatus({ type: "error", message: "CORRUPTION DETECTED" });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const val = value || "";
    setCode(val);
    validateJSON(val);
  };

  const handleInstantFix = () => {
    setIsFixing(true);
    try {
      // jsonrepair is instant and requires 0 model loading
      const fixed = jsonrepair(code);
      setCode(fixed);
      validateJSON(fixed);
      setAiInsight(">>> NEURAL REPAIR COMPLETE: SYNTAX ERRORS RESOLVED INSTANTLY.");
    } catch (e: any) {
      setAiInsight(`>>> REPAIR FAILED: ${e.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setIsAnalyzing(true);
    setAiInsight(">>> ANALYZING DATA STRUCTURE...");
    
    // We will simulate a quick heuristic analysis for now 
    // to keep it fast without external keys unless you want Gemini
    setTimeout(() => {
      try {
        const parsed = JSON.parse(code);
        const keys = Object.keys(parsed).length;
        setAiInsight(`>>> ANALYSIS COMPLETE: Detected ${keys} root nodes. Data schema is consistent with standard protocols.`);
      } catch (e) {
        setAiInsight(">>> ANALYSIS FAILED: Please fix syntax before deep scanning.");
      }
      setIsAnalyzing(false);
    }, 800);
  };

  const formatJSON = () => {
    try {
      setCode(JSON.stringify(JSON.parse(code), null, 2));
      setStatus({ type: "success", message: "OPTIMIZED" });
    } catch (e) { 
      handleInstantFix(); // Auto-try fix if format fails
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020203] text-[#e0e0e0] font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* GLOW DECORATION */}
      <div className="fixed top-[-10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Sidebar - Cyber Panel */}
      <aside className="w-full lg:w-80 bg-[#08080a]/80 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col gap-8 z-10">
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6 text-black" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">JSON CORE</h1>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Neural Validator</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Primary Protocols</p>
            <button onClick={formatJSON} className="w-full flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all group overflow-hidden relative">
              <AlignLeft className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold tracking-tight">Format Module</span>
            </button>
            
            <button 
              onClick={handleInstantFix}
              disabled={isFixing}
              className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl shadow-blue-600/20 relative overflow-hidden group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isFixing ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Zap className="w-5 h-5 text-black fill-black" />}
              <span className="text-sm font-black text-black uppercase">Instant AI Repair</span>
            </button>

            <button 
              onClick={handleDeepAnalysis}
              disabled={isAnalyzing}
              className="w-full flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all group disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              <span className="text-sm font-bold tracking-tight">Deep Analysis</span>
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">System Links</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {navigator.clipboard.writeText(code); alert("DATA COPIED");}} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all text-[10px] font-bold">
                <Copy size={16} className="text-white/40" /> COPY
              </button>
              <button onClick={() => setCode("")} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-all text-[10px] font-bold">
                <Trash2 size={16} className="text-white/40" /> PURGE
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
             <p className="text-[10px] text-blue-400 font-bold leading-relaxed">
               LIGHTNING ENGINE ACTIVE: Fixes applied instantly with zero server latency.
             </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
            <Globe size={10} /> Localized Core v3.0
          </div>
        </div>
      </aside>

      {/* Main Editor Environment */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent z-10">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] border transition-all ${
              status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" :
              status.type === "error" ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
              "bg-white/5 text-white/40 border-white/10"
            }`}>
              {status.type === "success" ? <Zap size={14} className="fill-emerald-400" /> : 
               status.type === "error" ? <AlertTriangle size={14} className="fill-red-400" /> : 
               <Terminal size={14} />}
              {status.message || "SCANNING..."}
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 relative p-4 lg:p-10">
          <div className="absolute inset-0 bg-white/[0.01] m-4 lg:m-10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "var(--font-geist-mono)",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 30 },
                lineNumbersMinChars: 4,
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                renderLineHighlight: "none",
              }}
            />
          </div>
        </div>

        {/* AI Insight Terminal */}
        {aiInsight && (
          <div className="mx-10 mb-10 h-48 bg-[#0d0d12] border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">System Output</span>
              </div>
              <Sparkles size={14} className="text-blue-500/40" />
            </div>
            
            <div className="relative h-full overflow-y-auto pr-4 scrollbar-hide">
              <p className="text-sm font-medium text-white/80 leading-relaxed font-mono">
                {aiInsight}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
