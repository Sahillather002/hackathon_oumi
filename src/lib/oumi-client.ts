import axios, { AxiosInstance } from 'axios';

// Use Next.js API routes in browser, direct backend in server
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use Next.js API routes
    return '';
  }
  // Server-side: use backend directly
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const API_URL = getApiUrl();
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

export interface TrainingConfig {
  model_name: string;
  dataset_id: string;
  learning_rate: number;
  batch_size: number;
  num_epochs: number;
  use_grpo: boolean;
  job_name?: string;
  description?: string;
}

export interface TrainingJob {
  id: string;
  name: string;
  model: string;
  dataset: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  currentStep: number;
  totalSteps: number;
  loss: number;
  reward: number;
  klDivergence: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  useGRPO: boolean;
  startTime: Date;
  endTime?: Date;
  error?: string;
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
}

export interface EvaluationConfig {
  model_id: string;
  judge_model: string;
  test_prompts: string[];
  criteria: string[];
}

export interface SynthesisConfig {
  topic: string;
  num_examples: number;
  difficulty: string;
  format: string;
  temperature: number;
}

class OumiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Training endpoints
  async createTrainingJob(config: TrainingConfig): Promise<{ job_id: string; status: string }> {
    const response = await this.client.post('/api/training', config);
    return response.data;
  }

  async getTrainingJob(jobId: string): Promise<TrainingJob> {
    const response = await this.client.get(`/api/training/${jobId}`);
    return response.data;
  }

  async listTrainingJobs(): Promise<TrainingJob[]> {
    try {
      const response = await this.client.get('/api/training');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error listing training jobs:', error);
      return [];
    }
  }

  async stopTrainingJob(jobId: string): Promise<{ message: string }> {
    const response = await this.client.post(`/api/training/${jobId}/stop`);
    return response.data;
  }

  async deleteTrainingJob(jobId: string): Promise<{ message: string }> {
    const response = await this.client.delete(`/api/training/${jobId}`);
    return response.data;
  }

  // WebSocket for real-time metrics
  connectToTrainingMetrics(
    jobId: string,
    onMessage: (metrics: TrainingMetrics) => void
  ): WebSocket {
    const wsUrl = typeof window !== 'undefined' 
      ? `${WS_URL.replace('http://', 'ws://').replace('https://', 'wss://')}/ws/${jobId}`
      : `ws://localhost:3002/ws/${jobId}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`WebSocket connected for job ${jobId}`);
      // Subscribe to training updates
      ws.send(JSON.stringify({ type: 'subscribe_training', jobId }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'training_update' && data.data) {
          // Transform backend format to TrainingMetrics
          const metrics: TrainingMetrics = {
            step: data.data.currentStep || data.data.step || 0,
            loss: data.data.loss || 0,
            reward: data.data.reward || 0,
            klDivergence: data.data.klDivergence || data.data.kl_divergence || 0,
            learningRate: data.data.learningRate || data.data.learning_rate || 1e-5,
            tokensPerSecond: data.data.tokensPerSecond || data.data.tokens_per_second || 0,
            gpuUtilization: data.data.gpuUtilization || data.data.gpu_utilization || 0,
            memoryUsage: data.data.memoryUsage || data.data.memory_usage || 0,
          };
          onMessage(metrics);
        } else {
          // Direct metrics format
          onMessage(data as TrainingMetrics);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log(`WebSocket connection closed for job ${jobId}`);
    };
    
    return ws;
  }

  // Models endpoints
  async listModels(): Promise<any[]> {
    const response = await this.client.get('/api/models');
    return response.data;
  }

  // Hugging Face integration
  async searchHuggingFaceModels(query: string, limit: number = 10): Promise<any[]> {
    try {
      // Use Hugging Face API to search for models
      const response = await fetch(
        `https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Hugging Face');
      }
      
      const data = await response.json();
      return data.map((model: any) => ({
        id: model.id,
        name: model.id,
        author: model.author || 'Unknown',
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        tags: model.tags || [],
        pipeline_tag: model.pipeline_tag,
        library_name: model.library_name,
        model_type: model.model_type,
      }));
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return [];
    }
  }

  async getHuggingFaceModelInfo(modelId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://huggingface.co/api/models/${modelId}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch model info');
      }
      
      const data = await response.json();
      return {
        id: data.id,
        name: data.id,
        author: data.author || 'Unknown',
        downloads: data.downloads || 0,
        likes: data.likes || 0,
        tags: data.tags || [],
        pipeline_tag: data.pipeline_tag,
        library_name: data.library_name,
        model_type: data.model_type,
        config: data.config,
        siblings: data.siblings || [],
      };
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return null;
    }
  }

  // Datasets endpoints
  async listDatasets(): Promise<any[]> {
    const response = await this.client.get('/api/datasets');
    return response.data;
  }

  // Evaluation endpoints
  async runEvaluation(config: EvaluationConfig): Promise<{ message: string; evaluation_id: string }> {
    const response = await this.client.post('/api/evaluation', config);
    return response.data;
  }

  // Synthesis endpoints
  async synthesizeData(config: SynthesisConfig): Promise<{ message: string; synthesis_id: string }> {
    const response = await this.client.post('/api/synthesis', config);
    return response.data;
  }
}

export const oumiClient = new OumiClient();