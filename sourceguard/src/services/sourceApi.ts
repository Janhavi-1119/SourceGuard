
import { AnalysisResult, Source } from '../types';

const API_URL = 'http://127.0.0.1:8787';

export async function analyzeSources(
    question: string,
    sources: Source[]
): Promise<AnalysisResult> {
    try {
        const response = await fetch(`${API_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                sources,
            }),
        });

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
