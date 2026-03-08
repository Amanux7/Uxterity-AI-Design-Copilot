export interface DimensionScore {
  name: string;
  score: number;
  issue_count: number;
  summary: string;
}

export type Severity = "critical" | "warning" | "info";
export type Category =
  | "visual_hierarchy"
  | "navigation"
  | "accessibility"
  | "consistency"
  | "cognitive_load"
  | "information_architecture";

export interface UXIssue {
  id: string;
  severity: Severity;
  category: Category;
  element: string;
  finding: string;
  recommendation: string;
  heuristic?: string;
  impact_score: number;
}

export interface UXAuditReport {
  overall_score: number;
  grade: string;
  dimensions: Record<string, DimensionScore>;
  issues: UXIssue[];
  top_recommendations: string[];
  component_count: number;
  analyzed_at: string;
  model_used: string;
  mock: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeDesign(
  file: File,
  mock = false
): Promise<UXAuditReport> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE}/analyze${mock ? "?mock=true" : ""}`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export interface HealthResponse {
  status: string;
  api_version: string;
  active_backend: "ollama" | "vllm" | "mock";
  backends: {
    ollama?: { status: string; models: string[] };
    vllm?: { status: string; models: string[] };
  };
  configured_models: {
    vision: string;
    reasoning: string;
    vllm_model: string;
  };
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
