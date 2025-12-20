// Complete type definitions for Oumi RL Studio backend

export interface Model {
    id: string;
    name: string;
    size: string;
    description: string;
    parameters: string;
    recommended: boolean;
}

export interface Dataset {
    id: string;
    name: string;
    description: string;
    size: string;
    examples: number;
    format: string;
    createdAt: string;
    status: 'processing' | 'ready' | 'error';
}

export interface TrainingConfig {
    learning_rate?: number;
    learningRate?: number;
    batch_size?: number;
    batchSize?: number;
    num_epochs?: number;
    epochs?: number;
    use_grpo?: boolean;
    useGRPO?: boolean;
    max_steps?: number;
    maxSteps?: number;
    [key: string]: any;
}

export interface TrainingJob {
    id: string;
    name: string;
    model: string;
    dataset: string;
    status: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'stopped';
    progress: number;
    currentStep: number;
    totalSteps: number;
    loss: number;
    reward: number;
    klDivergence: number;
    learningRate?: number;
    batchSize?: number;
    epochs?: number;
    useGRPO?: boolean;
    startTime: string;
    endTime?: string;
    estimatedCompletion?: string;
    tokensPerSecond: number;
    gpuUtilization: number;
    memoryUsage: number;
    error?: string;
    config?: TrainingConfig;
}

export interface TrainingMetrics {
    step: number;
    loss: number;
    reward: number;
    klDivergence: number;
    learningRate: number;
    tokensPerSecond: number;
    gpuUtilization: number;
    memoryUsage: number;
    timestamp: string;
}

export interface Evaluation {
    id: string;
    model: string;
    judgeModel: string;
    overallScore: number;
    criteria: {
        helpfulness: number;
        accuracy: number;
        safety: number;
        clarity: number;
        completeness: number;
    };
    examples: Array<{
        prompt: string;
        response: string;
        score: number;
        feedback: string;
    }>;
    createdAt: string;
}

export interface SynthesisResult {
    id: string;
    topic: string;
    difficulty: string;
    numExamples: number;
    examples: Array<{
        prompt: string;
        response: string;
        topic: string;
        difficulty: string;
    }>;
    createdAt: string;
}

export interface PlaygroundResponse {
    model: string;
    prompt: string;
    response: string;
    tokenCount: number;
    generationTime: number;
}
