'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  Brain, 
  ArrowLeft, 
  Play, 
  StopCircle, 
  Download, 
  Eye, 
  Settings,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Logo } from '@/components/logo';
import Link from 'next/link';

// Mock training metrics data
const generateMockMetrics = () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    data.push({
      step: i * 10,
      loss: Math.max(0.1, 2.5 * Math.exp(-i * 0.03) + Math.random() * 0.1),
      reward: Math.min(1.0, 0.2 + i * 0.008 + Math.random() * 0.05),
      klDivergence: Math.max(0.001, 0.1 * Math.exp(-i * 0.02) + Math.random() * 0.01),
      learningRate: 1e-5 * Math.exp(-i * 0.01),
      tokensPerSecond: 1200 + Math.random() * 200,
      gpuUtilization: 75 + Math.random() * 15,
      memoryUsage: 12.3 + Math.random() * 2
    });
  }
  return data;
};

function MetricCard({ title, value, change, icon, color }: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
}) {
  const Icon = icon;
  const isPositive = change && change > 0;
  
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center text-xs mt-1 ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(change).toFixed(1)}%
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function LogsPanel() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Generate mock logs
    const mockLogs = [
      '[2024-01-15 10:30:45] Starting GRPO training with Oumi v0.1.0',
      '[2024-01-15 10:30:46] Loading model: gpt2',
      '[2024-01-15 10:30:48] Model loaded successfully on GPU: NVIDIA A100',
      '[2024-01-15 10:30:49] Loading dataset: python-tutorials-v2',
      '[2024-01-15 10:30:50] Dataset loaded: 10,000 examples',
      '[2024-01-15 10:30:51] Initializing GRPO trainer',
      '[2024-01-15 10:30:52] Training configuration:',
      '[2024-01-15 10:30:52]   - Learning rate: 1e-05',
      '[2024-01-15 10:30:52]   - Batch size: 4',
      '[2024-01-15 10:30:52]   - KL coefficient: 0.10',
      '[2024-01-15 10:30:52]   - Clip range: 0.20',
      '[2024-01-15 10:30:53] Starting training loop...',
      '[2024-01-15 10:31:00] Step 10/1000 - Loss: 2.234 - Reward: 0.245 - KL: 0.089',
      '[2024-01-15 10:31:10] Step 20/1000 - Loss: 2.156 - Reward: 0.267 - KL: 0.085',
      '[2024-01-15 10:31:20] Step 30/1000 - Loss: 2.089 - Reward: 0.289 - KL: 0.082',
      '[2024-01-15 10:31:30] Step 40/1000 - Loss: 2.023 - Reward: 0.312 - KL: 0.078',
      '[2024-01-15 10:31:40] Step 50/1000 - Loss: 1.967 - Reward: 0.334 - KL: 0.075',
      '[2024-01-15 10:31:50] Step 60/1000 - Loss: 1.912 - Reward: 0.356 - KL: 0.072',
      '[2024-01-15 10:32:00] Step 70/1000 - Loss: 1.856 - Reward: 0.378 - KL: 0.069',
      '[2024-01-15 10:32:10] Step 80/1000 - Loss: 1.801 - Reward: 0.401 - KL: 0.066',
      '[2024-01-15 10:32:20] Step 90/1000 - Loss: 1.756 - Reward: 0.423 - KL: 0.064',
      '[2024-01-15 10:32:30] Step 100/1000 - Loss: 1.712 - Reward: 0.445 - KL: 0.061',
    ];

    setLogs(mockLogs);

    // Simulate real-time log updates
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = `[${new Date().toLocaleString()}] Step ${prev.length + 100}/1000 - Loss: ${(1.7 - Math.random() * 0.1).toFixed(3)} - Reward: ${(0.4 + Math.random() * 0.1).toFixed(3)} - KL: ${(0.06 - Math.random() * 0.01).toFixed(3)}`;
        return [...prev.slice(-20), newLog];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Training Logs</CardTitle>
        <CardDescription>Real-time training output</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs text-green-400">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrainingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [metrics, setMetrics] = useState(generateMockMetrics());
  const [currentStep, setCurrentStep] = useState(650);
  const [totalSteps] = useState(1000);
  const [status, setStatus] = useState<'running' | 'completed' | 'failed' | 'stopped'>('running');
  const [progress, setProgress] = useState(65);

  // Mock job data
  const job = {
    id: jobId,
    name: 'GPT-2 Fine-tuning on Python Code',
    model: 'gpt2',
    dataset: 'python-tutorials-v2',
    status: status,
    startTime: new Date(Date.now() - 45 * 60 * 1000),
    gpu: 'NVIDIA A100',
    memoryUsage: '12.3GB',
    learningRate: 1e-5,
    batchSize: 4,
    epochs: 3,
    useGRPO: true,
    klCoef: 0.1,
    clipRange: 0.2
  };

  // Simulate real-time updates
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const newStep = Math.min(prev + Math.floor(Math.random() * 5) + 1, totalSteps);
          const newProgress = (newStep / totalSteps) * 100;
          setProgress(newProgress);
          
          if (newStep >= totalSteps) {
            setStatus('completed');
          }
          
          return newStep;
        });

        // Update metrics
        setMetrics(prev => {
          const newMetrics = [...prev];
          if (newMetrics.length > 0) {
            const lastMetric = newMetrics[newMetrics.length - 1];
            const newStep = lastMetric.step + 10;
            
            if (newStep <= totalSteps) {
              newMetrics.push({
                step: newStep,
                loss: Math.max(0.1, lastMetric.loss * 0.98 + Math.random() * 0.05),
                reward: Math.min(1.0, lastMetric.reward + 0.005 + Math.random() * 0.01),
                klDivergence: Math.max(0.001, lastMetric.klDivergence * 0.97 + Math.random() * 0.002),
                learningRate: lastMetric.learningRate * 0.99,
                tokensPerSecond: 1200 + Math.random() * 200,
                gpuUtilization: 75 + Math.random() * 15,
                memoryUsage: 12.3 + Math.random() * 2
              });
            }
          }
          return newMetrics;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [status, totalSteps]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'stopped': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const currentMetrics = metrics[metrics.length - 1] || metrics[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/training">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Training
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Logo size="md" showText={false} />
                <div>
                  <h1 className="text-xl font-bold text-white">{job.name}</h1>
                  <p className="text-slate-400 text-sm">Job ID: {job.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(job.status)} text-white border-none`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              {status === 'running' && (
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
              {status === 'completed' && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Model
                  </Button>
                  <Link href="/playground">
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Test Model
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Training Progress</h3>
                <p className="text-slate-400">Step {currentStep} of {totalSteps}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{progress.toFixed(1)}%</div>
                <p className="text-slate-400 text-sm">~{Math.ceil((totalSteps - currentStep) / 10)} min left</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Current Loss"
            value={currentMetrics.loss.toFixed(3)}
            change={-2.3}
            icon={TrendingDown}
            color="text-red-500"
          />
          <MetricCard
            title="Current Reward"
            value={currentMetrics.reward.toFixed(3)}
            change={3.7}
            icon={TrendingUp}
            color="text-green-500"
          />
          <MetricCard
            title="KL Divergence"
            value={currentMetrics.klDivergence.toFixed(3)}
            change={-1.2}
            icon={Activity}
            color="text-purple-500"
          />
          <MetricCard
            title="Tokens/Sec"
            value={Math.round(currentMetrics.tokensPerSecond)}
            change={0.5}
            icon={Cpu}
            color="text-blue-500"
          />
        </div>

        {/* Charts and Logs */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="charts" className="text-white">Metrics Charts</TabsTrigger>
            <TabsTrigger value="system" className="text-white">System Metrics</TabsTrigger>
            <TabsTrigger value="logs" className="text-white">Training Logs</TabsTrigger>
            <TabsTrigger value="config" className="text-white">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Training Loss</CardTitle>
                  <CardDescription>How well the model is learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Reward Score</CardTitle>
                  <CardDescription>Model performance score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="reward" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">KL Divergence</CardTitle>
                  <CardDescription>Difference from original model</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="klDivergence" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Learning Rate</CardTitle>
                  <CardDescription>Learning rate schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => value.toExponential()} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                        formatter={(value: any) => [value.toExponential(), 'Learning Rate']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="learningRate" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">GPU Utilization</CardTitle>
                  <CardDescription>GPU usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="gpuUtilization" 
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Memory Usage</CardTitle>
                  <CardDescription>GPU memory consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memoryUsage" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard
                title="GPU Type"
                value={job.gpu}
                icon={Cpu}
                color="text-blue-500"
              />
              <MetricCard
                title="Memory Used"
                value={job.memoryUsage}
                icon={HardDrive}
                color="text-green-500"
              />
              <MetricCard
                title="Training Time"
                value="45 min"
                icon={Clock}
                color="text-purple-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <LogsPanel />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Training Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Basic Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Model:</span>
                        <span className="text-white">{job.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dataset:</span>
                        <span className="text-white">{job.dataset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Batch Size:</span>
                        <span className="text-white">{job.batchSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Epochs:</span>
                        <span className="text-white">{job.epochs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Learning Rate:</span>
                        <span className="text-white font-mono">{job.learningRate.toExponential()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">GRPO Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Algorithm:</span>
                        <Badge className={job.useGRPO ? 'bg-blue-500' : 'bg-gray-500'}>
                          {job.useGRPO ? 'GRPO' : 'Standard'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">KL Coefficient:</span>
                        <span className="text-white">{job.klCoef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Clip Range:</span>
                        <span className="text-white">{job.clipRange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}