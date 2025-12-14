import Fastify, { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import { randomUUID } from 'crypto';

// Types
interface TrainingJob {
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

interface TrainingMetrics {
  step: number;
  loss: number;
  reward: number;
  klDivergence: number;
  learningRate: number;
  tokensPerSecond: number;
  gpuUtilization: number;
  memoryUsage: number;
}

// In-memory storage (in production, use a proper database)
const trainingJobs = new Map<string, TrainingJob>();
const trainingMetrics = new Map<string, TrainingMetrics[]>();
const connections = new Map<string, any>();

// Initialize Fastify server
const app: FastifyInstance = Fastify({
  logger: true
});

// Register WebSocket plugin
app.register(websocket);

// WebSocket connection handler
app.register(async function (fastify) {
  fastify.get('/ws/:jobId', { websocket: true }, (connection, req) => {
    const jobId = (req.params as any).jobId;
    console.log(`WebSocket connection for job ${jobId}`);
    
    // Store connection
    connections.set(jobId, connection);
    
    // Send initial metrics if available
    const metrics = trainingMetrics.get(jobId);
    if (metrics && metrics.length > 0) {
      connection.send(JSON.stringify(metrics[metrics.length - 1]));
    }
    
    // Handle disconnection
    connection.socket.on('close', () => {
      console.log(`WebSocket disconnected for job ${jobId}`);
      connections.delete(jobId);
    });
  });
});

// Helper function to broadcast metrics
function broadcastMetrics(jobId: string, metrics: TrainingMetrics) {
  const connection = connections.get(jobId);
  if (connection) {
    try {
      connection.send(JSON.stringify(metrics));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      connections.delete(jobId);
    }
  }
}

// Helper function to simulate training progress
function simulateTraining(jobId: string) {
  const job = trainingJobs.get(jobId);
  if (!job) return;

  job.status = 'running';
  const metrics: TrainingMetrics[] = [];

  const interval = setInterval(() => {
    const currentJob = trainingJobs.get(jobId);
    if (!currentJob || currentJob.status !== 'running') {
      clearInterval(interval);
      return;
    }

    // Update progress
    currentJob.currentStep += Math.floor(Math.random() * 10) + 5;
    currentJob.progress = Math.min((currentJob.currentStep / currentJob.totalSteps) * 100, 100);

    // Calculate metrics (simulated)
    const step = currentJob.currentStep;
    const loss = Math.max(0.1, 2.5 * Math.exp(-step * 0.03) + Math.random() * 0.1);
    const reward = Math.min(1.0, 0.2 + step * 0.008 + Math.random() * 0.05);
    const klDivergence = Math.max(0.001, 0.1 * Math.exp(-step * 0.02) + Math.random() * 0.01);
    const learningRate = currentJob.learningRate * Math.exp(-step * 0.01);

    const newMetrics: TrainingMetrics = {
      step,
      loss,
      reward,
      klDivergence,
      learningRate,
      tokensPerSecond: 1200 + Math.random() * 200,
      gpuUtilization: 75 + Math.random() * 15,
      memoryUsage: 12.3 + Math.random() * 2
    };

    currentJob.loss = loss;
    currentJob.reward = reward;
    currentJob.klDivergence = klDivergence;

    metrics.push(newMetrics);
    trainingMetrics.set(jobId, metrics);

    // Broadcast to WebSocket clients
    broadcastMetrics(jobId, newMetrics);

    // Check if training is complete
    if (currentJob.currentStep >= currentJob.totalSteps) {
      currentJob.status = 'completed';
      currentJob.endTime = new Date();
      clearInterval(interval);
      console.log(`Training job ${jobId} completed`);
    }
  }, 2000);

  // Store interval ID for cleanup
  (job as any).interval = interval;
}

// API Routes

// Health check
app.get('/health', async (request, reply) => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Get all training jobs
app.get('/api/training', async (request, reply) => {
  return Array.from(trainingJobs.values());
});

// Create new training job
app.post('/api/training', async (request, reply) => {
  const body = request.body as any;
  
  const job: TrainingJob = {
    id: randomUUID(),
    name: body.name || 'Untitled Training',
    model: body.model_name,
    dataset: body.dataset_id,
    status: 'pending',
    progress: 0,
    currentStep: 0,
    totalSteps: 1000,
    loss: 0,
    reward: 0,
    klDivergence: 0,
    learningRate: body.learning_rate || 1e-5,
    batchSize: body.batch_size || 4,
    epochs: body.num_epochs || 3,
    useGRPO: body.use_grpo !== false,
    startTime: new Date()
  };

  trainingJobs.set(job.id, job);
  trainingMetrics.set(job.id, []);

  // Start training simulation after a short delay
  setTimeout(() => simulateTraining(job.id), 1000);

  return { job_id: job.id, status: 'pending' };
});

// Get specific training job
app.get('/api/training/:jobId', async (request, reply) => {
  const { jobId } = request.params as { jobId: string };
  const job = trainingJobs.get(jobId);
  
  if (!job) {
    reply.code(404).send({ error: 'Job not found' });
    return;
  }
  
  return job;
});

// Stop training job
app.post('/api/training/:jobId/stop', async (request, reply) => {
  const { jobId } = request.params as { jobId: string };
  const job = trainingJobs.get(jobId);
  
  if (!job) {
    reply.code(404).send({ error: 'Job not found' });
    return;
  }
  
  if (job.status === 'running') {
    job.status = 'stopped';
    job.endTime = new Date();
    
    // Clear the interval
    if ((job as any).interval) {
      clearInterval((job as any).interval);
    }
    
    // Close WebSocket connection
    const connection = connections.get(jobId);
    if (connection) {
      connection.socket.close();
      connections.delete(jobId);
    }
  }
  
  return { message: 'Training stopped' };
});

// Delete training job
app.delete('/api/training/:jobId', async (request, reply) => {
  const { jobId } = request.params as { jobId: string };
  const job = trainingJobs.get(jobId);
  
  if (!job) {
    reply.code(404).send({ error: 'Job not found' });
    return;
  }
  
  // Stop if running
  if (job.status === 'running') {
    if ((job as any).interval) {
      clearInterval((job as any).interval);
    }
  }
  
  // Clean up
  trainingJobs.delete(jobId);
  trainingMetrics.delete(jobId);
  
  const connection = connections.get(jobId);
  if (connection) {
    connection.socket.close();
    connections.delete(jobId);
  }
  
  return { message: 'Job deleted' };
});

// Get available models
app.get('/api/models', async (request, reply) => {
  return [
    {
      id: 'gpt2',
      name: 'GPT-2',
      size: '124M',
      description: 'Small, fast, good for testing',
      memory: '2GB',
      trainingTime: '~30 min'
    },
    {
      id: 'llama-2-7b',
      name: 'Llama-2-7B',
      size: '7B',
      description: 'Good balance of performance and efficiency',
      memory: '14GB',
      trainingTime: '~2 hours'
    },
    {
      id: 'mistral-7b',
      name: 'Mistral-7B',
      size: '7B',
      description: 'Excellent performance for instruction following',
      memory: '14GB',
      trainingTime: '~2 hours'
    }
  ];
});

// Get available datasets
app.get('/api/datasets', async (request, reply) => {
  return [
    {
      id: 'python-tutorials',
      name: 'Python Tutorials Dataset',
      size: '10K examples',
      description: 'Programming tutorials and code explanations',
      format: 'JSONL'
    },
    {
      id: 'alpaca-format',
      name: 'Alpaca Format Dataset',
      size: '52K examples',
      description: 'Instruction following dataset',
      format: 'JSONL'
    },
    {
      id: 'customer-support',
      name: 'Customer Support Chat',
      size: '25K examples',
      description: 'Customer service conversations',
      format: 'JSON'
    }
  ];
});

// Model evaluation endpoint
app.post('/api/evaluation', async (request, reply) => {
  const body = request.body as any;
  
  // Simulate evaluation
  setTimeout(() => {
    const results = {
      model_id: body.model_id,
      judge_model: body.judge_model,
      overall_score: 8.2,
      criteria_scores: {
        helpfulness: 8.5,
        accuracy: 9.0,
        safety: 9.5,
        clarity: 7.8,
        completeness: 7.2
      },
      num_examples: 5,
      examples: [
        {
          prompt: "Explain quantum computing in simple terms",
          response: "Quantum computing is like having a super-powerful calculator...",
          scores: { helpfulness: 9.0, accuracy: 8.5, safety: 10.0 },
          feedback: "Great analogy with calculator..."
        }
      ]
    };
    
    // In a real app, you would store and return results
    console.log('Evaluation completed:', results);
  }, 3000);
  
  return { message: 'Evaluation started', evaluation_id: randomUUID() };
});

// Data synthesis endpoint
app.post('/api/synthesis', async (request, reply) => {
  const body = request.body as any;
  
  // Simulate data synthesis
  setTimeout(() => {
    const data = Array.from({ length: body.num_examples }, (_, i) => ({
      prompt: `Example prompt ${i + 1} about ${body.topic}`,
      response: `Example response ${i + 1} explaining ${body.topic} in detail`
    }));
    
    console.log(`Generated ${data.length} examples for topic: ${body.topic}`);
  }, 2000);
  
  return { message: 'Synthesis started', synthesis_id: randomUUID() };
});

// Start server
const start = async () => {
  try {
    const port = 3002; // Different from main Next.js port
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Oumi API server listening on port ${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();