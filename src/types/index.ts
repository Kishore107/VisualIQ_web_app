export interface ImageAnalysis {
  caption: string;
  answer?: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: ImageAnalysis | null;
}