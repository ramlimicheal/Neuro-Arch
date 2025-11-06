
export interface CbtStep {
  title: string;
  content: string;
}

export interface StrategicInsights {
  title: string;
  content: string;
}

export interface AnalysisResult {
  sixStepTransformation: CbtStep[];
  strategicInsights: StrategicInsights;
}
