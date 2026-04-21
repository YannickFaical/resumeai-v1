export type Plan = "free" | "starter" | "pro";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: Plan;
  credits_remaining: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  cv_text: string;
  ats_score: number;
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  cover_letter: string | null;
  created_at: string;
}

export interface ATSResult {
  ats_score: number;
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  cover_letter?: string;
}
