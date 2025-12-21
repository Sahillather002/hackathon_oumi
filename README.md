# Oumi RL Studio

A comprehensive web application for fine-tuning Large Language Models using Reinforcement Learning (GRPO algorithm from Oumi library).

## 🚀 Features

### Core Features
- **GRPO Training Interface** - Visual UI for RL training with Oumi integration
- **Real-Time Metrics Dashboard** - Live charts and training progress monitoring
- **Model Playground** - Interactive model testing and comparison
- **Dataset Management** - Upload and manage training datasets
- **LLM-as-a-Judge** - Automated model evaluation
- **Data Synthesis** - Generate synthetic training data using AI

### Technical Features
- **Real-time WebSocket Updates** - Live training progress
- **Beautiful UI** - Modern, animated, responsive design
- **Full-stack Architecture** - Next.js frontend + Node.js backend
- **AI Integration** - Uses z-ai-web-dev-sdk for AI capabilities

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand + TanStack Query
- **TypeScript**: Full type safety

### Backend (Node.js)
- **API**: Express.js server on port 3001
- **WebSocket**: Real-time updates on port 3002
- **AI Integration**: z-ai-web-dev-sdk
- **Storage**: In-memory (production ready for database)

## 📁 Project Structure

```
src/app/
├── page.tsx                 # Landing page
├── dashboard/page.tsx         # Main dashboard
├── training/
│   ├── new/page.tsx         # Training wizard
│   └── [id]/page.tsx        # Training details
├── playground/page.tsx        # Model testing
├── datasets/
│   ├── page.tsx             # Dataset list
│   └── upload/page.tsx      # Upload dataset
├── judge/page.tsx            # LLM-as-a-Judge
└── synthesize/page.tsx       # Data synthesis

mini-services/
└── oumi-service/           # Backend API service
```

## 🎯 Key Pages

### 1. Landing Page (`/`)
- Hero section with animated gradients
- Feature showcase
- Statistics display
- Call-to-action sections

### 2. Dashboard (`/dashboard`)
- Training job overview
- Real-time statistics
- Quick actions
- Job status tracking

### 3. Training Wizard (`/training/new`)
- Multi-step form
- Model selection
- Dataset configuration
- Training parameters

### 4. Training Details (`/training/[id]`)
- Real-time metrics charts
- Live progress updates
- System monitoring
- Training logs

### 5. Model Playground (`/playground`)
- Interactive testing
- Model comparison
- Response rating
- Example prompts

### 6. Dataset Management (`/datasets`)
- Dataset browsing
- Upload interface
- Format validation
- Preview functionality

### 7. LLM-as-a-Judge (`/judge`)
- Model evaluation
- Custom criteria
- Scoring visualization
- Example analysis

### 8. Data Synthesis (`/synthesize`)
- AI-powered data generation
- Customizable parameters
- Preview and export
- Multiple difficulty levels


\`\`\`mermaid
graph TB
    subgraph Frontend["🎨 Frontend Layer - Next.js + React"]
        Models["📋 Models Page"]
        Datasets["📊 Datasets Page"]
        Training["🚀 Training Page"]
        Playground["🎮 Playground Page"]
        Client["🔌 Oumi Client<br/>(axios)"]
        
        Models --> Client
        Datasets --> Client
        Training --> Client
        Playground --> Client
    end
    
    subgraph Motia["⚡ MOTIA RUNTIME - Single Service<br/>━━━━━━━━━━━━━━━━━━━━━━━"]
        subgraph API["📡 API Steps (16)"]
            API1["models-list.step.ts"]
            API2["datasets-list.step.ts"]
            API3["training-create.step.ts"]
            API4["training-stop.step.ts"]
            API5["evaluation-create.step.ts"]
            API6["synthesis-create.step.ts"]
        end
        
        EventBus["🔄 Event Bus<br/>(Built-in)"]
        
        subgraph Events["⚡ Event Steps (7)"]
            Event1["🔄 training-simulator<br/>Listens: start-training<br/>Updates every 5s"]
            Event2["⚖️ evaluation-processor<br/>Listens: process-evaluation"]
            Event3["🔬 synthesis-processor<br/>Listens: process-synthesis"]
        end
        
        Observability["📊 Built-in Observability<br/>Traces | Logs | Metrics"]
    end
    
    subgraph Database["🗄️ Supabase Database - PostgreSQL"]
        DB1[("📦 models<br/>4 rows")]
        DB2[("📁 datasets<br/>1+ rows")]
        DB3[("🚂 training_jobs<br/>dynamic")]
        DB4[("📈 training_metrics<br/>history")]
        DB5[("⚖️ evaluation_jobs")]
        DB6[("🔬 synthesis_jobs")]
        DB7[("🗄️ state_store")]
    end
    
    Client -->|"REST API"| API
    Client -->|"WebSocket"| EventBus
    
    API3 -.->|"emit('start-training')"| EventBus
    API4 -.->|"emit('stop-training')"| EventBus
    API5 -.->|"emit('process-evaluation')"| EventBus
    API6 -.->|"emit('process-synthesis')"| EventBus
    
    EventBus -->|"auto-route"| Event1
    EventBus -->|"auto-route"| Event2
    EventBus -->|"auto-route"| Event3
    
    API --> Database
    Events --> Database
    
    style Frontend fill:#6366f1,stroke:#4f46e5,color:#fff
    style Motia fill:#10b981,stroke:#059669,color:#fff
    style API fill:#3b82f6,stroke:#2563eb,color:#fff
    style Events fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style EventBus fill:#fbbf24,stroke:#f59e0b,color:#000
    style Database fill:#f59e0b,stroke:#d97706,color:#fff
    style Observability fill:#06b6d4,stroke:#0891b2,color:#fff
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Oumi](https://github.com/oumi-ai/oumi) - RL training library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Chart library

---
