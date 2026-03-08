"use client";

import { DimensionScore } from "@/lib/api";

interface DimensionCardProps {
    dimensionKey: string;
    dimension: DimensionScore;
}

const dimensionIcons: Record<string, string> = {
    visual_hierarchy: "◈",
    navigation_clarity: "◎",
    accessibility: "⬡",
    layout_consistency: "▦",
    cognitive_load: "◉",
    information_architecture: "⬢",
};

export default function DimensionCard({ dimensionKey, dimension }: DimensionCardProps) {
    const { score, name, issue_count, summary } = dimension;

    const color =
        score >= 80 ? "#34d399" :
            score >= 60 ? "#60a5fa" :
                score >= 40 ? "#fbbf24" : "#f87171";

    const barWidth = `${score}%`;
    const icon = dimensionIcons[dimensionKey] ?? "◇";

    return (
        <div className="glass-card rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <span
                        className="text-xl leading-none"
                        style={{ color }}
                    >
                        {icon}
                    </span>
                    <span className="text-sm font-semibold text-[#c4c9e8]">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                    {issue_count > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            {issue_count} {issue_count === 1 ? "issue" : "issues"}
                        </span>
                    )}
                    <span className="text-lg font-bold" style={{ color }}>
                        {score}
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: barWidth,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                    }}
                />
            </div>

            {/* Summary */}
            {summary && (
                <p className="text-xs text-[#6b7299] leading-relaxed line-clamp-2 group-hover:text-[#9ca3c4] transition-colors">
                    {summary}
                </p>
            )}
        </div>
    );
}
