// FIX: Import React to resolve the 'React' namespace error for React.ElementType.
import type React from 'react';

export interface User {
  full_name: string;
  email: string;
  level: number;
  total_points: number;
  age_group: 'kids' | 'teens' | 'adults';
  preferred_language: 'en' | 'ar';
  learning_progress?: {
    current_streak: number;
  };
  badges?: string[];
  profile_photo_base64?: string;
}

export interface DetailedFinding {
  category: 'Anatomy & Proportions' | 'Lighting & Shadows' | 'Background & Environment' | 'Texture & Detail' | 'AI Artifacts' | 'Facial & Speech Analysis' | 'Scene & Object Consistency' | 'Audio-Visual Sync' | 'Compression & Artifacts' | 'Other';
  finding: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface ScanResult {
  id: string;
  created_date: string;
  file_url: string;
  file_type: 'image' | 'video' | 'audio';
  trust_score: number;
  summary: string;
  verdict?: 'Likely Authentic' | 'Potentially Manipulated' | 'Likely AI-Generated' | 'High Confidence AI-Generated';
  detailed_findings?: DetailedFinding[];
  artifacts_detected?: string[]; // Keep for mock non-image scans
  processing_time: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  module_type: 'game' | 'lesson' | 'challenge';
  age_group: 'kids' | 'teens' | 'adults';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration?: number;
  points_reward?: number;
  locked?: boolean;
  content?: string;
  quiz?: QuizQuestion[];
  icon?: React.ElementType;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface UrlAnalysisResult {
  verdict: 'Safe' | 'Caution' | 'Dangerous' | 'Unknown';
  summary: string;
  threats_found: string[];
  sources: GroundingSource[];
}

export interface NewsVerificationResult {
  verdict: 'Likely Factual' | 'Misleading' | 'Potentially False' | 'Unverifiable';
  credibility_score: number;
  summary: string;
  key_findings: string[];
  detected_biases: string[];
}

export interface PasswordAnalysisResult {
  score: number;
  verdict: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  enhancements: string[];
  positive_points: string[];
}
