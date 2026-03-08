"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import { analyzeDesign, UXAuditReport } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const report: UXAuditReport = await analyzeDesign(selectedFile, useMock);
      // Store in sessionStorage and navigate
      sessionStorage.setItem("ux_report", JSON.stringify(report));
      sessionStorage.setItem("ux_preview", URL.createObjectURL(selectedFile));
      router.push("/report");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between border-b border-purple-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
            U
          </div>
          <span className="font-bold text-base gradient-text">UXterity</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#4b5280]">
          <span className="hidden md:block">AI Design Copilot</span>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
            v1.0 MVP
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/20 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
              <span className="text-[#9ca3c4]">Privacy-first · Runs locally with Qwen + Ollama</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              AI-Powered{" "}
              <span className="gradient-text">UX Intelligence</span>
              <br />
              for Your Designs
            </h1>
            <p className="text-base text-[#6b7299] max-w-lg mx-auto leading-relaxed">
              Upload any UI screenshot and receive a structured audit covering
              visual hierarchy, accessibility, cognitive load, and more — powered
              by local AI models.
            </p>
          </div>

          {/* Features row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "◈", label: "6 UX Dimensions" },
              { icon: "⬡", label: "WCAG 2.1 AA" },
              { icon: "◉", label: "Actionable Fixes" },
            ].map(({ icon, label }) => (
              <div key={label} className="glass-card rounded-xl p-3 border border-purple-500/10">
                <div className="text-purple-400 text-lg mb-1">{icon}</div>
                <div className="text-xs text-[#6b7299] font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Upload zone */}
          <UploadZone onFileSelected={setSelectedFile} isLoading={isLoading} />

          {/* Mock mode toggle */}
          <div className="flex items-center justify-center gap-2.5">
            <button
              role="switch"
              aria-checked={useMock}
              onClick={() => setUseMock((v) => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${useMock ? "bg-purple-600" : "bg-white/10"
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${useMock ? "translate-x-5" : ""
                  }`}
              />
            </button>
            <label className="text-xs text-[#4b5280] cursor-pointer" onClick={() => setUseMock((v) => !v)}>
              Demo mode (no Ollama required)
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="glass-card border border-red-500/30 rounded-xl p-4 text-sm text-red-400 flex items-start gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Analyze button */}
          <button
            className="btn-primary w-full text-base relative z-10"
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            id="analyze-button"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <span className="animate-spin-slow inline-block">◈</span>
                  Analyzing Design…
                </>
              ) : (
                <>
                  ✦ Analyze Design
                </>
              )}
            </span>
          </button>

          {/* Pipeline hint */}
          {isLoading && (
            <div className="glass-card rounded-xl p-4 border border-purple-500/10">
              <p className="text-xs text-center text-[#4b5280] mb-3">Running AI pipeline…</p>
              <div className="flex items-center gap-1.5 justify-center flex-wrap text-xs text-[#4b5280]">
                {["Vision Analysis", "Component Detection", "Layout Parsing", "UX Rules", "LLM Reasoning", "Report Generation"].map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="text-purple-500/60">{step}</span>
                    {i < 5 && <span className="text-[#2d2d4e]">→</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-purple-500/10 text-center text-xs text-[#2d2d4e]">
        UXterity · AI Design Copilot · Phase 1 MVP · March 2026
      </footer>
    </main>
  );
}
