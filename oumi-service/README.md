# Oumi RL Studio - Python Backend Service

This is the FastAPI backend service that handles Oumi integration for GRPO training, data synthesis, and LLM-as-a-Judge evaluation.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Oumi

```bash
# Install Oumi from GitHub
pip install git+https://github.com/oumi-ai/oumi.git
```

### 4. Set Environment Variables

Create a `.env` file in this directory:

```env
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/oumi_studio
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Running the Service

### Development Mode

```bash
uvicorn main:app --reload --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Training
- `POST /api/training/create` - Create training job
- `GET /api/training/{job_id}` - Get job details
- `GET /api/training/list` - List all jobs
- `POST /api/training/{job_id}/stop` - Stop job
- `GET /api/training/{job_id}/metrics` - Get metrics

### Datasets
- `POST /api/datasets/upload` - Upload dataset
- `GET /api/datasets/list` - List datasets
- `GET /api/datasets/{id}` - Get dataset
- `DELETE /api/datasets/{id}` - Delete dataset

### Models
- `GET /api/models/list` - List models
- `GET /api/models/{id}` - Get model
- `POST /api/models/{id}/generate` - Generate text

### Evaluation
- `POST /api/evaluation/run` - Run evaluation
- `GET /api/evaluation/{id}` - Get results

### Data Synthesis
- `POST /api/synthesis/generate` - Generate synthetic data

## Oumi Integration

This service integrates Oumi's key features:

1. **GRPO Training**: Using `oumi.train()` with GRPO config
2. **Data Synthesis**: Using `oumi.synthesize()` for data generation
3. **LLM-as-a-Judge**: Using `oumi.evaluate()` for model evaluation

See `/routers` and `/services` directories for implementation details.
