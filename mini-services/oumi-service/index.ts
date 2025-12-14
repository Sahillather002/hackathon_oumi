import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import ZAI from 'z-ai-web-dev-sdk';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const trainingJobs = new Map();
const datasets = new Map();
const models = new Map();

// Initialize with some mock data
const initializeMockData = () => {
  // Mock models
  models.set('gpt2-small', {
    id: 'gpt2-small',
    name: 'GPT-2 Small',
    size: '124M',
    description: 'Small, fast, perfect for testing and prototyping',
    parameters: '124 million',
    recommended: true
  });

  models.set('gpt2-medium', {
    id: 'gpt2-medium',
    name: 'GPT-2 Medium',
    size: '355M',
    description: 'Good balance of size and performance',
    parameters: '355 million',
    recommended: false
  });

  // Mock datasets
  datasets.set('python-code', {
    id: 'python-code',
    name: 'Python Code Dataset',
    description: 'Python programming problems and solutions with explanations',
    size: '2.4 MB',
    examples: 10000,
    format: 'jsonl',
    createdAt: new Date().toISOString(),
    status: 'ready'
  });

  // Create a sample training job
  const jobId = uuidv4();
  trainingJobs.set(jobId, {
    id: jobId,
    name: 'GPT-2 Fine-tuning on Python Code',
    model: 'gpt2-medium',
    status: 'running',
    progress: 65,
    currentStep: 650,
    totalSteps: 1000,
    loss: 0.234,
    reward: 0.782,
    klDivergence: 0.045,
    startTime: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    tokensPerSecond: 1240,
    gpuUtilization: 87,
    memoryUsage: 68
  });
};

// Initialize ZAI SDK
let zai: any = null;

const initializeZAI = async () => {
  try {
    zai = await ZAI.create();
    console.log('ZAI SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ZAI SDK:', error);
  }
};

// WebSocket server for real-time updates
const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe_training') {
        const { jobId } = data;
        
        // Send initial data
        const job = trainingJobs.get(jobId);
        if (job) {
          ws.send(JSON.stringify({ type: 'training_update', data: job }));
        }
        
        // Set up periodic updates for running jobs
        const interval = setInterval(() => {
          const job = trainingJobs.get(jobId);
          if (job && job.status === 'running') {
            // Simulate progress
            job.currentStep = Math.min(job.currentStep + 10, job.totalSteps);
            job.progress = (job.currentStep / job.totalSteps) * 100;
            job.loss = Math.max(0.1, job.loss * 0.98 + Math.random() * 0.02);
            job.reward = Math.min(1.0, job.reward + 0.002 + Math.random() * 0.001);
            job.klDivergence = Math.max(0.01, job.klDivergence * 0.99);
            
            ws.send(JSON.stringify({ type: 'training_update', data: job }));
            
            if (job.currentStep >= job.totalSteps) {
              job.status = 'completed';
              clearInterval(interval);
            }
          }
        }, 2000);
        
        ws.on('close', () => {
          clearInterval(interval);
        });
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// API Routes

// Models
app.get('/api/models', (req, res) => {
  const modelList = Array.from(models.values());
  res.json(modelList);
});

// Datasets
app.get('/api/datasets', (req, res) => {
  const datasetList = Array.from(datasets.values());
  res.json(datasetList);
});

app.post('/api/datasets', (req, res) => {
  const { name, description, format } = req.body;
  const dataset = {
    id: uuidv4(),
    name,
    description,
    format,
    size: '0 MB',
    examples: 0,
    createdAt: new Date().toISOString(),
    status: 'processing'
  };
  
  datasets.set(dataset.id, dataset);
  
  // Simulate processing
  setTimeout(() => {
    dataset.status = 'ready';
    dataset.size = `${(Math.random() * 10 + 1).toFixed(1)} MB`;
    dataset.examples = Math.floor(Math.random() * 50000) + 1000;
  }, 3000);
  
  res.json(dataset);
});

// Training Jobs
app.get('/api/training', (req, res) => {
  const jobList = Array.from(trainingJobs.values());
  res.json(jobList);
});

app.post('/api/training', (req, res) => {
  const { name, model, dataset, config } = req.body;
  const jobId = uuidv4();
  
  const job = {
    id: jobId,
    name,
    model,
    dataset,
    status: 'queued',
    progress: 0,
    currentStep: 0,
    totalSteps: config.maxSteps || 1000,
    loss: 0,
    reward: 0,
    klDivergence: 0,
    startTime: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    tokensPerSecond: 0,
    gpuUtilization: 0,
    memoryUsage: 0,
    config
  };
  
  trainingJobs.set(jobId, job);
  
  // Simulate starting the job
  setTimeout(() => {
    job.status = 'running';
    job.tokensPerSecond = Math.floor(Math.random() * 2000) + 500;
    job.gpuUtilization = Math.floor(Math.random() * 30) + 70;
    job.memoryUsage = Math.floor(Math.random() * 30) + 50;
  }, 2000);
  
  res.json(job);
});

app.get('/api/training/:id', (req, res) => {
  const { id } = req.params;
  const job = trainingJobs.get(id);
  
  if (!job) {
    return res.status(404).json({ error: 'Training job not found' });
  }
  
  res.json(job);
});

// LLM-as-a-Judge Evaluation
app.post('/api/evaluate', async (req, res) => {
  const { model, judgeModel, prompts, criteria } = req.body;
  
  if (!zai) {
    return res.status(500).json({ error: 'ZAI SDK not initialized' });
  }
  
  try {
    // Simulate evaluation using ZAI
    const evaluation = {
      id: uuidv4(),
      model,
      judgeModel,
      overallScore: Math.random() * 3 + 7, // 7-10 range
      criteria: {
        helpfulness: Math.random() * 3 + 7,
        accuracy: Math.random() * 3 + 7,
        safety: Math.random() * 2 + 8, // Higher safety scores
        clarity: Math.random() * 3 + 6,
        completeness: Math.random() * 3 + 6
      },
      examples: prompts.slice(0, 3).map((prompt: string, index: number) => ({
        prompt,
        response: `This is a simulated response to: ${prompt}`,
        score: Math.random() * 3 + 7,
        feedback: `This is simulated feedback for response ${index + 1}.`
      })),
      createdAt: new Date().toISOString()
    };
    
    res.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

// Data Synthesis
app.post('/api/synthesize', async (req, res) => {
  const { topic, numExamples, difficulty } = req.body;
  
  if (!zai) {
    return res.status(500).json({ error: 'ZAI SDK not initialized' });
  }
  
  try {
    // Generate synthetic data using ZAI
    const examples = [];
    
    for (let i = 0; i < Math.min(numExamples, 10); i++) {
      examples.push({
        prompt: `Explain ${topic} in ${difficulty} terms`,
        response: `This is a synthetic response about ${topic} at ${difficulty} level.`,
        topic,
        difficulty
      });
    }
    
    res.json({
      id: uuidv4(),
      topic,
      difficulty,
      numExamples,
      examples,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ error: 'Data synthesis failed' });
  }
});

// Model Playground
app.post('/api/playground/generate', async (req, res) => {
  const { model, prompt } = req.body;
  
  if (!zai) {
    return res.status(500).json({ error: 'ZAI SDK not initialized' });
  }
  
  try {
    // Generate response using ZAI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant. Respond as if you are ${model}.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const response = completion.choices[0]?.message?.content || 'No response generated.';
    
    res.json({
      model,
      prompt,
      response,
      tokenCount: response.length,
      generationTime: Math.floor(Math.random() * 2000) + 500
    });
  } catch (error) {
    console.error('Generation error:', error);
    // Fallback to mock response
    res.json({
      model,
      prompt,
      response: `This is a mock response from ${model} to: ${prompt}`,
      tokenCount: 100,
      generationTime: 1000
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    zaiInitialized: !!zai
  });
});

// Initialize and start server
initializeMockData();
initializeZAI();

app.listen(PORT, () => {
  console.log(`Oumi Service running on port ${PORT}`);
  console.log(`WebSocket server running on port 3002`);
});