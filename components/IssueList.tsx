"use client";

import { useState } from "react";
import { UXIssue, Severity } from "@/lib/api";

interface IssueListProps {
    issues: UXIssue[];
}

const severityConfig: Record<Severity, { label: string; className: string; dot: string }> = {
    critical: { label: "Critical", className: "badge-critical", dot: "bg-red-400" },
    warning: { label: "Warning", className: "badge-warning", dot: "bg-amber-400" },
    info: { label: "Info", className: "badge-info", dot: "bg-blue-400" },
};

const severityOrder: Record<Severity, number> = {
    critical: 0,
    warning: 1,
    info: 2,
};

export default function IssueList({ issues }: IssueListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Severity | "all">("all");

    const sorted = [...issues].sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );

    const filtered = filter === "all" ? sorted : sorted.filter((i) => i.severity === filter);

    const counts = {
        critical: issues.filter((i) => i.severity === "critical").length,
        warning: issues.filter((i) => i.severity === "warning").length,
        info: issues.filter((i) => i.severity === "info").length,
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "critical", "warning", "info"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === f
                                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                                : "bg-white/5 text-[#6b7299] border border-white/5 hover:border-white/10 hover:text-[#9ca3c4]"
                            }`}
                    >
                        {f === "all" ? `All (${issues.length})` :
                            f === "critical" ? `⚠ Critical (${counts.critical})` :
                                f === "warning" ? `◎ Warning (${counts.warning})` :
                                    `ℹ Info (${counts.info})`}
                    </button>
                ))}
            </div>

            {/* Issue cards */}
            <div className="flex flex-col gap-2">
                {filtered.length === 0 && (
                    <div className="glass-card rounded-xl p-6 text-center text-[#6b7299] text-sm">
                        No issues in this category.
                    </div>
                )}
                {filtered.map((issue, idx) => {
                    const sev = severityConfig[issue.severity];
                    const isExpanded = expandedId === issue.id;

                    return (
                        <div
                            key={issue.id}
                            className="glass-card rounded-xl overflow-hidden"
                            style={{ animationDelay: `${idx * 60}ms` }}
                        >
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* Severity dot */}
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />

                                {/* Issue info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${sev.className}`}
                                        >
                                            {sev.label}
                                        </span>
                                        <span className="text-xs text-[#4b5280]">{issue.id}</span>
                                        <span className="text-xs text-[#5b6280] truncate">{issue.element}</span>
                                    </div>
                                    <p className="text-sm text-[#c4c9e8] leading-snug line-clamp-1">
                                        {issue.finding}
                                    </p>
                                </div>

                                {/* Impact score */}
                                <div className="text-right flex-shrink-0">
                                    <span className="text-xs text-[#4b5280]">Impact</span>
                                    <div className="text-sm font-bold text-[#9ca3c4]">
                                        {issue.impact_score.toFixed(1)}
                                    </div>
                                </div>

                                {/* Chevron */}
                                <span
                                    className={`text-[#4b5280] transition-transform duration-200 text-sm ${isExpanded ? "rotate-180" : ""}`}
                                >
                                    ▾
                                </span>
                            </button>

                            {/* Expanded detail */}
                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                                    <div>
                                        <p className="text-xs font-semibold text-[#4b5280] uppercase tracking-wider mb-1">Finding</p>
                                        <p className="text-sm text-[#9ca3c4] leading-relaxed">{issue.finding}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[#4b5280] uppercase tracking-wider mb-1">Recommendation</p>
                                        <p className="text-sm text-[#c4c9e8] leading-relaxed">{issue.recommendation}</p>
                                    </div>
                                    {issue.heuristic && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                            <span className="text-purple-400 text-xs">◈</span>
                                            <span className="text-xs text-purple-300">{issue.heuristic}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
