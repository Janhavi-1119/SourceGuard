import { AnalysisResult, Source } from '../types';

const DIRECT_BACKEND_URL = 'https://sourceguard-worker.janhavinanaware11.workers.dev';

export async function analyzeSources(
  question: string,
  sources: Source[]
): Promise<AnalysisResult> {
  const endpoint = import.meta.env.DEV
    ? '/api/analyze'
    : `${DIRECT_BACKEND_URL}/api/analyze`;

  try {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          sources,
        }),
      });
    } catch (fetchErr) {
      if (endpoint !== `${DIRECT_BACKEND_URL}/api/analyze`) {
        response = await fetch(`${DIRECT_BACKEND_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            sources,
          }),
        });
      } else {
        throw fetchErr;
      }
    }

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
      throw new Error(data.error || 'SourceGuard analysis failed.');
    }

    return data.report as AnalysisResult;
  } catch (error) {
    console.error('SourceGuard API Error:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Could not connect to the SourceGuard backend.');
  }
}
