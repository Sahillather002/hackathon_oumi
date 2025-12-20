# Motia Backend for Oumi RL Studio

Complete backend implementation using the Motia framework - a unified backend system that brings APIs, background jobs, queueing, state management, and observability into one framework.

## Architecture

### Step-Based Design

Motia uses **Steps** as the core primitive. Each step is a self-contained unit that defines:
- **When it runs** (via `config`)
- **What it does** (via `handler`)

### Directory Structure

```
motia_backend/
├── src/
│   ├── api/                    # API endpoint steps
│   │   ├── models-api.step.ts
│   │   ├── datasets-api.step.ts
│   │   ├── training-api.step.ts
│   │   ├── training-detail-api.step.ts
│   │   ├── evaluate-api.step.ts
│   │   ├── synthesize-api.step.ts
│   │   ├── playground-api.step.ts
│   │   └── health-api.step.ts
│   ├── events/                 # Event processing steps
│   │   ├── process-training.step.py
│   │   ├── process-dataset.step.py
│   │   ├── process-evaluation.step.ts
│   │   ├── process-synthesis.step.ts
│   │   └── update-metrics.step.ts
│   └── shared/                 # Shared utilities
│       ├── types.ts
│       ├── state-keys.ts
│       └── utils.ts
├── motia.config.ts            # Motia configuration
├── package.json
└── requirements.txt           # Python dependencies
```

## API Endpoints

All endpoints are available at `http://localhost:3000/api/*`

### Models
- `GET /api/models` - List available models

### Datasets
- `GET /api/datasets` - List datasets
- `POST /api/datasets` - Create new dataset

### Training
- `GET /api/training` - List training jobs
- `POST /api/training` - Create training job
- `GET /api/training/:id` - Get training job details

### Evaluation
- `POST /api/evaluate` - Run LLM-as-a-Judge evaluation

### Synthesis
- `POST /api/synthesize` - Generate synthetic training data

### Playground
- `POST /api/playground/generate` - Generate model responses

### Health
- `GET /api/health` - Health check

## Event-Driven Workflows

Background processing is handled by event steps:

1. **Training Processing** (`process-training.step.py`)
   - Listens for: `start-training` event
   - Simulates GRPO training with metric updates
   - Emits: `training-complete` event

2. **Dataset Processing** (`process-dataset.step.py`)
   - Listens for: `process-dataset` event
   - Validates and processes uploaded datasets

3. **Evaluation Processing** (`process-evaluation.step.ts`)
   - Listens for: `process-evaluation` event
   - Runs LLM-as-a-Judge evaluation
   - Emits: `evaluation-complete` event

4. **Synthesis Processing** (`process-synthesis.step.ts`)
   - Listens for: `process-synthesis` event
   - Generates synthetic training data
   - Emits: `synthesis-complete` event

5. **Metrics Updates** (`update-metrics.step.ts`)
   - Listens for: `update-metrics` event
   - Handles real-time metric notifications

## State Management

Uses Motia's built-in state plugin for data persistence:

```typescript
// Models
state.models.list = string[]
state.models.{id} = Model

// Datasets
state.datasets.list = string[]
state.datasets.{id} = Dataset

// Training Jobs
state.training.jobs.list = string[]
state.training.jobs.{id} = TrainingJob

// Evaluations
state.evaluations.list = string[]
state.evaluations.{id} = Evaluation

// Synthesis Results
state.synthesis.list = string[]
state.synthesis.{id} = SynthesisResult
```

## Development

### Prerequisites
- Node.js 18+
- Python 3.8+ (for Python steps)
- Redis (optional, for BullMQ job queuing)

### Setup

```bash
cd motia_backend
npm install
```

### Run Development Server

```bash
npm run dev
```

This starts:
- Motia runtime on port 3000
- Workbench UI at http://localhost:3000 (for debugging)

### Generate TypeScript Types

```bash
npm run generate-types
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Plugins

The backend uses the following Motia plugins:

1. **Observability Plugin** - Monitoring and metrics
2. **States Plugin** - State management
3. **Endpoint Plugin** - HTTP API handling
4. **Logs Plugin** - Structured logging
5. **BullMQ Plugin** - Job queuing

## Integration with Frontend

The Next.js frontend proxies requests to the Motia backend:

```typescript
// Frontend API route (src/app/api/training/route.ts)
const BACKEND_URL = 'http://localhost:3000';  // Motia backend

export async function GET() {
  const response = await fetch(`${BACKEND_URL}/api/training`);
  return response.json();
}
```

## Future Enhancements

- [ ] Real Oumi GRPO training integration
- [ ] WebSocket support for real-time updates
- [ ] Redis-based state persistence
- [ ] Production-ready error handling
- [ ] Rate limiting and authentication
- [ ] Metrics dashboard integration
- [ ] Distributed job processing

## Learn More

- [Motia Documentation](https://motia.dev/docs)
- [Motia GitHub](https://github.com/motia-dev/motia)
- [Oumi Library](https://github.com/oumi-ai/oumi)

## License

MIT