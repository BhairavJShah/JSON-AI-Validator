"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
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
  AlertTriangle
} from "lucide-react";

export default function JSONValidator() {
  const [code, setCode] = useState<string>(`{\n  "name": "John Doe",\n  "age": 25,\n  "status": "active",\n  "tags": ["developer", "json"]\n}`);
  const [status, setStatus] = useState<{ type: "success" | "error" | "none"; message: string }>({ type: "none", message: "" });
  const [isFixing, setIsFixing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  
  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    worker.current = new Worker(new URL("../app/ai.worker.ts", import.meta.url));

    worker.current.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'progress') {
        if (data.status === 'progress') setProgress(data.progress);
      } else if (type === 'result') {
        if (isFixing) {
          setCode(data);
          validateJSON(data);
          setAiInsight("AI has attempted to fix the syntax.");
          setIsFixing(false);
        } else {
          setAiInsight(data);
          setIsAnalyzing(false);
        }
        setProgress(0);
      } else if (type === 'error') {
        setAiInsight(`AI Error: ${data}`);
        setIsFixing(false);
        setIsAnalyzing(false);
        setProgress(0);
      }
    };

    validateJSON(code);

    return () => {
      worker.current?.terminate();
    };
  }, [isFixing, isAnalyzing]);

  const validateJSON = (value: string | undefined) => {
    if (!value) {
      setStatus({ type: "none", message: "" });
      return;
    }
    try {
      JSON.parse(value);
      setStatus({ type: "success", message: "Valid JSON Syntax" });
    } catch (e: any) {
      setStatus({ type: "error", message: e.message });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const val = value || "";
    setCode(val);
    validateJSON(val);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(code);
      const formatted = JSON.stringify(parsed, null, 2);
      setCode(formatted);
      setStatus({ type: "success", message: "Formatted Successfully" });
    } catch (e) {
      setStatus({ type: "error", message: "Cannot format invalid JSON" });
    }
  };

  const handleFixWithAI = () => {
    if (!worker.current) return;
    setIsFixing(true);
    setAiInsight("AI background worker is fixing syntax...");
    worker.current.postMessage({ type: 'fix', jsonString: code });
  };

  const handleAnalyzeWithAI = () => {
    if (!worker.current) return;
    setIsAnalyzing(true);
    setAiInsight("AI background worker is analyzing data...");
    worker.current.postMessage({ type: 'analyze', jsonString: code });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Copied to clipboard!");
  };

  const clearEditor = () => {
    if (confirm("Clear all code?")) {
      setCode("");
      setStatus({ type: "none", message: "" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar Tools */}
      <aside className="w-full lg:w-72 bg-[#111] border-r border-[#222] p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Braces className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">JSON AI Validator</h1>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Actions</p>
          <button 
            onClick={formatJSON}
            className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl transition-all text-sm group"
          >
            <AlignLeft className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            Beautify & Format
          </button>
          
          <button 
            onClick={handleFixWithAI}
            disabled={isFixing}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl transition-all text-sm font-semibold shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            {isFixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Fix with AI
          </button>

          <button 
            onClick={handleAnalyzeWithAI}
            disabled={isAnalyzing}
            className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl transition-all text-sm group disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            Analyze Data
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Utilities</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-xs">
              <Copy size={14} /> Copy
            </button>
            <button onClick={clearEditor} className="flex items-center justify-center gap-2 p-3 bg-[#1a1a1a] hover:bg-red-950/30 border border-[#333] hover:border-red-900/50 rounded-xl text-xs text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <div className="mt-auto">
          {progress > 0 && (
            <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>AI MODEL LOADING</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-blue-900/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          <div className="p-4 bg-[#1a1a1a] border border-[#222] rounded-xl text-[10px] text-gray-500 mt-4 leading-relaxed">
            <p>Runs in an isolated background worker. No freezing, no data leaks.</p>
          </div>
        </div>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        <header className="h-14 border-b border-[#222] flex items-center justify-between px-6 bg-[#0d0d0d]">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
              status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              status.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
              "bg-gray-500/10 text-gray-400 border border-gray-500/20"
            }`}>
              {status.type === "success" ? <Check size={12} /> : 
               status.type === "error" ? <AlertTriangle size={12} /> : 
               null}
              {status.message || "Checking JSON..."}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-[11px] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              <FileCode size={14} /> JSON
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0 relative">
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-geist-mono)",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              bracketPairColorization: { enabled: true },
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: true,
            }}
          />
        </div>

        {/* AI Insight Panel */}
        {aiInsight && (
          <div className="h-40 border-t border-[#222] bg-[#0d0d0d] p-6 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">AI Insight</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
              {aiInsight}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
