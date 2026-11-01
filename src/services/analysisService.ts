import { AnalysisResult, Source, AnalysisOptions } from '../types';
import { mockAnalysisResult } from '../data/mockAnalysis';

// Simulates an analysis API call
// In production, this would call your AI backend
export async function runAnalysis(
  question: string,
  sources: Source[],
  _options: AnalysisOptions
): Promise<AnalysisResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Return mock result customized with the user's question and sources
  const result: AnalysisResult = {
    ...mockAnalysisResult,
    id: `analysis-${Date.now()}`,
    question,
    date: new Date().toISOString(),
    sources: sources.length > 0 ? sources : mockAnalysisResult.sources,
  };

  return result;
}
