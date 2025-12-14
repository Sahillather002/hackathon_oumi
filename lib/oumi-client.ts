import axios, { AxiosInstance } from 'axios';

export interface TrainingConfig {
  model_name: string;
  dataset_id: string;
  learning_rate: number;
  batch_size: number;
  num_epochs: number;
  max_steps?: number;
  warmup_steps: number;
  gradient_accumulation_steps: number;
  use_grpo: boolean;
  reward_model?: string;
}

export interface TrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  config: TrainingConfig;
  metrics?: TrainingMetrics;
  created_at: string;
  updated_at: string;
}

export interface TrainingMetrics {
  loss: number;
  reward: number;
  kl_divergence: number;
  tokens_per_second: number;
  gpu_utilization: number;
  memory_usage: number;
  current_step: number;
  total_steps: number;
}

export interface Dataset {
  id: string;
  name: string;
  size: number;
  num_examples: number;
  format: 'json' | 'csv' | 'parquet';
  created_at: string;
}

export interface Model {
  id: string;
  name: string;
  base_model: string;
  size: string;
  parameters: number;
  training_job_id?: string;
  created_at: string;
}

export interface EvaluationResult {
  id: string;
  model_id: string;
  judge_model: string;
  scores: {
    helpfulness: number;
    accuracy: number;
    safety: number;
    overall: number;
  };
  examples: Array<{
    prompt: string;
    response: string;
    score: number;
    feedback: string;
  }>;
  created_at: string;
}

class OumiClient {
  private client: AxiosInstance;
  private wsUrl: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

    this.client = axios.create({
      baseURL: `${apiUrl}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  // Training endpoints
  async createTrainingJob(config: TrainingConfig): Promise<TrainingJob> {
    const response = await this.client.post<TrainingJob>('/training/create', config);
    return response.data;
  }

  async getTrainingJob(jobId: string): Promise<TrainingJob> {
    const response = await this.client.get<TrainingJob>(`/training/${jobId}`);
    return response.data;
  }

  async listTrainingJobs(): Promise<TrainingJob[]> {
    const response = await this.client.get<TrainingJob[]>('/training/list');
    return response.data;
  }

  async stopTrainingJob(jobId: string): Promise<void> {
    await this.client.post(`/training/${jobId}/stop`);
  }

  async getTrainingMetrics(jobId: string): Promise<TrainingMetrics> {
    const response = await this.client.get<TrainingMetrics>(`/training/${jobId}/metrics`);
    return response.data;
  }

  // Dataset endpoints
  async uploadDataset(file: File, name: string): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await this.client.post<Dataset>('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async listDatasets(): Promise<Dataset[]> {
    const response = await this.client.get<Dataset[]>('/datasets/list');
    return response.data;
  }

  async getDataset(datasetId: string): Promise<Dataset> {
    const response = await this.client.get<Dataset>(`/datasets/${datasetId}`);
    return response.data;
  }

  async deleteDataset(datasetId: string): Promise<void> {
    await this.client.delete(`/datasets/${datasetId}`);
  }

  // Model endpoints
  async listModels(): Promise<Model[]> {
    const response = await this.client.get<Model[]>('/models/list');
    return response.data;
  }

  async getModel(modelId: string): Promise<Model> {
    const response = await this.client.get<Model>(`/models/${modelId}`);
    return response.data;
  }

  async generateCompletion(modelId: string, prompt: string): Promise<string> {
    const response = await this.client.post<{ completion: string }>(
      `/models/${modelId}/generate`,
      { prompt }
    );
    return response.data.completion;
  }

  // Evaluation endpoints
  async evaluateModel(
    modelId: string,
    judgeModel: string,
    testSet: string[]
  ): Promise<EvaluationResult> {
    const response = await this.client.post<EvaluationResult>('/evaluation/run', {
      model_id: modelId,
      judge_model: judgeModel,
      test_set: testSet,
    });
    return response.data;
  }

  async getEvaluationResult(evaluationId: string): Promise<EvaluationResult> {
    const response = await this.client.get<EvaluationResult>(
      `/evaluation/${evaluationId}`
    );
    return response.data;
  }

  // Data Synthesis endpoints
  async synthesizeData(config: {
    topic: string;
    num_examples: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }): Promise<Dataset> {
    const response = await this.client.post<Dataset>('/synthesis/generate', config);
    return response.data;
  }

  // WebSocket connection for real-time updates
  connectToTrainingJob(jobId: string, onMessage: (metrics: TrainingMetrics) => void): WebSocket {
    const ws = new WebSocket(`${this.wsUrl}/training/${jobId}/stream`);

    ws.onmessage = (event) => {
      const metrics = JSON.parse(event.data);
      onMessage(metrics);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

export const oumiClient = new OumiClient();
