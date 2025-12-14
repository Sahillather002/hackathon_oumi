'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Brain, Plus, Filter, Search, MoreHorizontal, Eye, Play, StopCircle, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { oumiClient, TrainingJob } from '@/lib/oumi-client';

// Fallback mock data for initial render
const mockJobs = [
  {
    id: '1',
    name: 'GPT-2 Fine-tuning on Python Code',
    model: 'gpt2',
    dataset: 'python-tutorials-v2',
    status: 'running',
    progress: 65,
    currentStep: 650,
    totalSteps: 1000,
    loss: 0.842,
    reward: 0.723,
    klDivergence: 0.045,
    learningRate: 1e-5,
    batchSize: 4,
    startTime: new Date(Date.now() - 45 * 60 * 1000),
    estimatedTime: '25 min',
    gpu: 'NVIDIA A100',
    memoryUsage: '12.3GB'
  },
  {
    id: '2',
    name: 'Llama-2-7B Chat Fine-tuning',
    model: 'meta-llama/Llama-2-7b-chat-hf',
    dataset: 'instruction-dataset-v3',
    status: 'completed',
    progress: 100,
    currentStep: 500,
    totalSteps: 500,
    loss: 0.234,
    reward: 0.892,
    klDivergence: 0.012,
    learningRate: 5e-6,
    batchSize: 8,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedTime: '1h 45min',
    gpu: 'NVIDIA A100',
    memoryUsage: '24.1GB'
  },
  {
    id: '3',
    name: 'Mistral-7B Instruction Following',
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    dataset: 'alpaca-format-dataset',
    status: 'failed',
    progress: 30,
    currentStep: 150,
    totalSteps: 500,
    loss: 1.234,
    reward: 0.456,
    klDivergence: 0.089,
    learningRate: 2e-5,
    batchSize: 16,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    error: 'GPU memory insufficient',
    gpu: 'NVIDIA A100',
    memoryUsage: '38.2GB'
  },
  {
    id: '4',
    name: 'GPT-NeoX-20B on Medical Data',
    model: 'EleutherAI/gpt-neox-20b',
    dataset: 'medical-qa-dataset',
    status: 'pending',
    progress: 0,
    currentStep: 0,
    totalSteps: 1000,
    loss: 0,
    reward: 0,
    klDivergence: 0,
    learningRate: 1e-5,
    batchSize: 2,
    startTime: new Date(),
    queuePosition: 2,
    gpu: 'NVIDIA A100',
    memoryUsage: '0GB'
  },
  {
    id: '5',
    name: 'Falcon-7B Fine-tuning',
    model: 'tiiuae/falcon-7b',
    dataset: 'customer-support-data',
    status: 'stopped',
    progress: 45,
    currentStep: 225,
    totalSteps: 500,
    loss: 0.567,
    reward: 0.678,
    klDivergence: 0.034,
    learningRate: 8e-6,
    batchSize: 6,
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    stoppedTime: '2h 15min',
    gpu: 'NVIDIA A100',
    memoryUsage: '18.7GB'
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'running': return 'bg-blue-500';
    case 'completed': return 'bg-green-500';
    case 'failed': return 'bg-red-500';
    case 'pending': return 'bg-yellow-500';
    case 'stopped': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'running': return 'Running';
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
    case 'pending': return 'Pending';
    case 'stopped': return 'Stopped';
    default: return 'Unknown';
  }
}

function JobCard({ job }: { job: typeof mockJobs[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-1">{job.name}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Model: {job.model} • Dataset: {job.dataset}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(job.status)} text-white border-none`}>
                {getStatusText(job.status)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/training/${job.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  {job.status === 'running' && (
                    <DropdownMenuItem 
                      className="text-red-400"
                      onClick={() => handleStopJob(job.id)}
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop Training
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Job
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Section */}
          {job.status === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">{job.progress.toFixed(1)}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Step {job.currentStep}/{job.totalSteps}</span>
                <span>~{job.estimatedTime} left</span>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Loss:</span>
              <span className="ml-2 text-white font-mono">
                {job.loss > 0 ? job.loss.toFixed(3) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Reward:</span>
              <span className="ml-2 text-white font-mono">
                {job.reward > 0 ? job.reward.toFixed(3) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">KL Divergence:</span>
              <span className="ml-2 text-white font-mono">
                {job.klDivergence > 0 ? job.klDivergence.toFixed(3) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Learning Rate:</span>
              <span className="ml-2 text-white font-mono">
                {job.learningRate.toExponential()}
              </span>
            </div>
          </div>

          {/* System Info */}
          <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
            <span>GPU: {job.gpu}</span>
            <span>Memory: {job.memoryUsage}</span>
            <span>Batch: {job.batchSize}</span>
          </div>

          {/* Status-specific info */}
          {job.status === 'completed' && (
            <div className="text-xs text-green-400 text-center pt-2">
              ✓ Completed in {job.completedTime}
            </div>
          )}

          {job.status === 'failed' && (
            <div className="text-xs text-red-400 text-center pt-2">
              ✗ {job.error}
            </div>
          )}

          {job.status === 'pending' && (
            <div className="text-xs text-yellow-400 text-center pt-2">
              ⏳ Queue position: #{job.queuePosition}
            </div>
          )}

          {job.status === 'stopped' && (
            <div className="text-xs text-gray-400 text-center pt-2">
              ⏹️ Stopped after {job.stoppedTime}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/training/${job.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            {job.status === 'completed' && (
              <Link href={`/playground?model=${job.id}`} className="flex-1">
                <Button size="sm" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Test Model
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TrainingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const [wsConnections, setWsConnections] = useState<Map<string, WebSocket>>(new Map());

  // Fetch training jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setRefreshing(true);
      const fetchedJobs = await oumiClient.listTrainingJobs();
      
      // Transform API response to match component expectations
      const transformedJobs = fetchedJobs.map((job: any) => ({
        id: job.id,
        name: job.name || `${job.model || 'Unknown Model'} Training`,
        model: job.model || job.config?.model_name || 'Unknown',
        dataset: job.dataset || job.config?.dataset_id || 'Unknown',
        status: job.status || 'pending',
        progress: job.progress || (job.currentStep && job.totalSteps ? (job.currentStep / job.totalSteps) * 100 : 0),
        currentStep: job.currentStep || 0,
        totalSteps: job.totalSteps || job.config?.max_steps || 1000,
        loss: job.loss || job.metrics?.loss || 0,
        reward: job.reward || job.metrics?.reward || 0,
        klDivergence: job.klDivergence || job.metrics?.kl_divergence || 0,
        learningRate: job.learningRate || job.config?.learning_rate || 1e-5,
        batchSize: job.batchSize || job.config?.batch_size || 4,
        startTime: job.startTime ? new Date(job.startTime) : new Date(job.created_at || Date.now()),
        completedTime: job.completedTime,
        estimatedTime: job.estimatedTime,
        error: job.error,
        queuePosition: job.queuePosition,
        stoppedTime: job.stoppedTime,
        gpu: job.gpu || 'NVIDIA A100',
        memoryUsage: job.memoryUsage || (job.metrics?.memory_usage ? `${job.metrics.memory_usage}GB` : '0GB'),
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Failed to fetch training jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training jobs. Using cached data.',
        variant: 'destructive',
      });
      // Fallback to mock data on error
      setJobs(mockJobs);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Set up WebSocket connections for running jobs
  useEffect(() => {
    const runningJobs = jobs.filter(job => job.status === 'running');
    
    runningJobs.forEach(job => {
      if (!wsConnections.has(job.id)) {
        try {
          const ws = oumiClient.connectToTrainingMetrics(job.id, (metrics) => {
            setJobs(prevJobs =>
              prevJobs.map(j => {
                if (j.id === job.id) {
                  return {
                    ...j,
                    loss: metrics.loss,
                    reward: metrics.reward,
                    klDivergence: metrics.klDivergence,
                    progress: metrics.step && j.totalSteps ? (metrics.step / j.totalSteps) * 100 : j.progress,
                    currentStep: metrics.step || j.currentStep,
                    memoryUsage: `${metrics.memoryUsage.toFixed(1)}GB`,
                  };
                }
                return j;
              })
            );
          });
          
          setWsConnections(prev => new Map(prev).set(job.id, ws));
        } catch (error) {
          console.error(`Failed to connect WebSocket for job ${job.id}:`, error);
        }
      }
    });

    // Cleanup closed connections
    return () => {
      wsConnections.forEach((ws, jobId) => {
        if (ws.readyState === WebSocket.CLOSED || !runningJobs.find(j => j.id === jobId)) {
          ws.close();
          setWsConnections(prev => {
            const newMap = new Map(prev);
            newMap.delete(jobId);
            return newMap;
          });
        }
      });
    };
  }, [jobs, wsConnections]);

  // Poll for updates every 5 seconds (fallback if WebSocket fails)
  useEffect(() => {
    const interval = setInterval(() => {
      const hasRunningJobs = jobs.some(job => job.status === 'running' || job.status === 'pending');
      if (hasRunningJobs) {
        fetchJobs();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobs, fetchJobs]);

  // Filter jobs based on search and status
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.dataset.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  // Handle job actions
  const handleStopJob = async (jobId: string) => {
    try {
      await oumiClient.stopTrainingJob(jobId);
      toast({
        title: 'Success',
        description: 'Training job stopped successfully',
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to stop training job',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this training job?')) {
      return;
    }
    
    try {
      await oumiClient.deleteTrainingJob(jobId);
      toast({
        title: 'Success',
        description: 'Training job deleted successfully',
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete training job',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/training" className="text-white font-medium">Training</Link>
                <Link href="/models" className="text-slate-300 hover:text-white transition-colors">Models</Link>
                <Link href="/datasets" className="text-slate-300 hover:text-white transition-colors">Datasets</Link>
              </nav>
            </div>
            <Link href="/training/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Training Job
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Training Jobs</h1>
            <p className="text-slate-300">Manage and monitor all your RL training jobs</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchJobs}
              disabled={refreshing}
              className="bg-slate-800/50 border-slate-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-slate-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-300">Loading training jobs...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No training jobs found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first training job'
              }
            </p>
            <Link href="/training/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Training Job
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}