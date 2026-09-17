export interface CopyCheckHit { text: string; label: string }
export interface CopyCheckGroup { id: string; title: string; hits: CopyCheckHit[]; advisory?: boolean }
export interface CopyCheckResult { score: number; status: "empty" | "clean" | "review"; wordCount: number; groups: CopyCheckGroup[]; profile: string }
export function normalize(text?: string): string;
export function analyze(input: string, options?: { allowProof?: boolean; profile?: string }): CopyCheckResult;
export function summary(result: CopyCheckResult): string;
