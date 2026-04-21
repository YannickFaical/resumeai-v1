"use client";

interface Props {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 80 }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#4A7C59" :
    score >= 50 ? "#E8572A" :
    "#DC2626";

  const label =
    score >= 75 ? "Excellent" :
    score >= 50 ? "Moyen" :
    "Faible";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(10,10,10,0.08)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
            fontSize: size < 60 ? "13px" : "16px",
            fontWeight: "700",
            fontFamily: "'Syne', sans-serif",
            fill: "#0A0A0A",
          }}
        >
          {score}
        </text>
      </svg>
      {size >= 80 && (
        <span
          className="text-xs font-mono font-semibold"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
