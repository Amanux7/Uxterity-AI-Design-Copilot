"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UXAuditReport } from "@/lib/api";
import ScoreRing from "@/components/ScoreRing";
import DimensionCard from "@/components/DimensionCard";
import IssueList from "@/components/IssueList";

export default function ReportPage() {
    const router = useRouter();
    const [report, setReport] = useState<UXAuditReport | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("ux_report");
        const preview = sessionStorage.getItem("ux_preview");
        if (!stored) { router.replace("/"); return; }
        setReport(JSON.parse(stored));
        if (preview) setPreviewUrl(preview);
    }, [router]);

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="text-4xl animate-spin-slow inline-block text-purple-500">◈</div>
                    <p className="text-[#4b5280] text-sm">Loading report…</p>
                </div>
            </div>
        );
    }

    const analyzedAt = new Date(report.analyzed_at).toLocaleString();

    return (
        <main className="min-h-screen flex flex-col">
            {/* Nav */}
            <nav className="px-6 py-4 flex items-center justify-between border-b border-purple-500/10 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                        U
                    </div>
                    <span className="font-bold text-base gradient-text">UXterity</span>
                </div>
                <div className="flex items-center gap-3">
                    {report.mock && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            ◎ Demo Report
                        </span>
                    )}
                    <Link
                        href="/"
                        className="text-sm px-4 py-2 rounded-xl glass-card border border-purple-500/20 text-[#9ca3c4] hover:text-white hover:border-purple-500/40 transition-all"
                    >
                        ← New Analysis
                    </Link>
                </div>
            </nav>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 space-y-8">

                {/* Header row */}
                <div className="animate-fade-in-up">
                    <div className="flex items-start gap-2 mb-1">
                        <h1 className="text-2xl font-bold">UX Audit Report</h1>
                    </div>
                    <p className="text-sm text-[#4b5280]">
                        {report.component_count} components analyzed · {analyzedAt} · Model: {report.model_used}
                    </p>
                </div>

                {/* Score + preview */}
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                    {/* Score ring */}
                    <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-6 glow-purple">
                        <ScoreRing score={report.overall_score} grade={report.grade} size={180} />

                        {/* Top recommendations */}
                        {report.top_recommendations.length > 0 && (
                            <div className="w-full space-y-2">
                                <p className="text-xs font-semibold text-[#4b5280] uppercase tracking-wider">Top Priorities</p>
                                {report.top_recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-2.5 items-start">
                                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] flex items-center justify-center font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-xs text-[#9ca3c4] leading-relaxed">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Uploaded screenshot */}
                    <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-white/5 text-xs font-semibold text-[#4b5280] uppercase tracking-wider">
                            Analyzed Screenshot
                        </div>
                        {previewUrl ? (
                            <div className="flex-1 flex items-center justify-center p-4 bg-white/[0.02]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="Analyzed UI"
                                    className="max-h-64 max-w-full object-contain rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-[#2d2d4e] text-sm">
                                No preview available
                            </div>
                        )}
                    </div>
                </div>

                {/* Issue summary row */}
                <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
                    {(["critical", "warning", "info"] as const).map((sev) => {
                        const count = report.issues.filter((i) => i.severity === sev).length;
                        const colors = {
                            critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", icon: "⚠" },
                            warning: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: "◎" },
                            info: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", icon: "ℹ" },
                        }[sev];
                        return (
                            <div
                                key={sev}
                                className={`glass-card rounded-xl p-4 border ${colors.border} flex flex-col items-center gap-1`}
                            >
                                <span className={`text-xl font-bold ${colors.text}`}>{count}</span>
                                <span className={`text-xs font-semibold capitalize ${colors.text}`}>
                                    {colors.icon} {sev}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Dimensions grid */}
                <div className="animate-fade-in-up">
                    <h2 className="text-base font-semibold mb-4 text-[#c4c9e8]">UX Dimension Scores</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(report.dimensions).map(([key, dim]) => (
                            <DimensionCard key={key} dimensionKey={key} dimension={dim} />
                        ))}
                    </div>
                </div>

                {/* Issues list */}
                <div className="animate-fade-in-up pb-8">
                    <h2 className="text-base font-semibold mb-4 text-[#c4c9e8]">
                        Issues & Recommendations
                        <span className="ml-2 text-xs font-normal text-[#4b5280]">({report.issues.length} total)</span>
                    </h2>
                    <IssueList issues={report.issues} />
                </div>
            </div>
        </main>
    );
}
