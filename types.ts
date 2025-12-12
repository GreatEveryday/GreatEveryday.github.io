export interface FeatureAnalysis {
  score: number;
  pros: string;
  cons: string;
}

export interface DetailedAnalysis {
  eyes: FeatureAnalysis;
  nose: FeatureAnalysis;
  mouth: FeatureAnalysis;
  faceShape: FeatureAnalysis;
}

export interface FaceType {
  category: string;
  description: string;
  tags: string[];
}

export interface MakeupTip {
  area: string;
  advice: string;
}

export interface SkinAnalysis {
  textureScore: number;
  lusterScore: number;
  advice: string;
}

export interface AnalysisResult {
  overallScore: number;
  features: DetailedAnalysis;
  faceType: FaceType;
  skinAnalysis: SkinAnalysis;
  makeupAdvice: MakeupTip[];
}

export enum AppState {
  AUTH = 'AUTH',
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}