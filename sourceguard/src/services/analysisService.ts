
import { AnalysisResult, Source, AnalysisOptions } from '../types';
import { analyzeSources } from './sourceApi';

export async function runAnalysis(
  question: string,
  sources: Source[],
  _options: AnalysisOptions
): Promise<AnalysisResult> {
  if (!question.trim()) {
    throw new Error('Please enter a research question.');
  }

  if (sources.length === 0) {
    throw new Error('Please add at least one source.');
  }

  const result = await analyzeSources(question, sources);

  return result;
}
