"use client";

interface ScoreRingProps {
    score: number;
    grade: string;
    size?: number;
}

export default function ScoreRing({ score, grade, size = 160 }: ScoreRingProps) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const gradeColor: Record<string, string> = {
        A: "#34d399",
        B: "#60a5fa",
        C: "#fbbf24",
        D: "#f97316",
        F: "#f87171",
    };

    const color = gradeColor[grade] ?? "#7c5df9";

    const label =
        score >= 85 ? "Excellent" :
            score >= 70 ? "Good" :
                score >= 55 ? "Fair" :
                    score >= 40 ? "Poor" : "Critical";

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Glow layer */}
                <svg
                    className="absolute inset-0 opacity-30 blur-sm"
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                >
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>

                {/* Track */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={8}
                    />
                    {/* Progress */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold leading-none" style={{ color }}>
                        {score}
                    </span>
                    <span className="text-xs font-semibold mt-1" style={{ color: "rgba(156,163,196,0.7)" }}>
                        / 100
                    </span>
                </div>
            </div>

            {/* Grade badge */}
            <div
                className="px-5 py-1.5 rounded-full text-sm font-bold tracking-widest"
                style={{
                    backgroundColor: `${color}20`,
                    color,
                    border: `1px solid ${color}40`,
                }}
            >
                Grade {grade} — {label}
            </div>
        </div>
    );
}
