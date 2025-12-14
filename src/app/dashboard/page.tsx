'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, Activity, Clock, CheckCircle, Play, Plus, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/logo';
import Link from 'next/link';

// Mock data - in real app, this would come from API
const mockJobs = [
  {
    id: '1',
    name: 'GPT-2 Fine-tuning',
    model: 'gpt2',
    status: 'running',
    progress: 65,
    currentStep: 650,
    totalSteps: 1000,
    loss: 0.842,
    reward: 0.723,
    startTime: new Date(Date.now() - 45 * 60 * 1000),
    estimatedTime: '25 min'
  },
  {
    id: '2',
    name: 'Llama-2-7B Chat',
    model: 'meta-llama/Llama-2-7b-chat-hf',
    status: 'completed',
    progress: 100,
    currentStep: 500,
    totalSteps: 500,
    loss: 0.234,
    reward: 0.892,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedTime: '1h 45min'
  },
  {
    id: '3',
    name: 'Mistral-7B Instruction',
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    status: 'failed',
    progress: 30,
    currentStep: 150,
    totalSteps: 500,
    loss: 1.234,
    reward: 0.456,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    error: 'GPU memory insufficient'
  },
  {
    id: '4',
    name: 'GPT-NeoX-20B',
    model: 'EleutherAI/gpt-neox-20b',
    status: 'pending',
    progress: 0,
    currentStep: 0,
    totalSteps: 1000,
    loss: 0,
    reward: 0,
    startTime: new Date(),
    queuePosition: 2
  }
];

const stats = [
  {
    label: 'Active Jobs',
    value: '3',
    change: '+1',
    changeType: 'increase',
    icon: Activity,
    color: 'text-blue-500'
  },
  {
    label: 'Total Models',
    value: '12',
    change: '+2',
    changeType: 'increase',
    icon: Brain,
    color: 'text-purple-500'
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+0.3%',
    changeType: 'increase',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    label: 'Avg Training Time',
    value: '2.3h',
    change: '-15min',
    changeType: 'decrease',
    icon: Clock,
    color: 'text-orange-500'
  }
];

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${
                  stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500">vs last week</span>
              </div>
            </div>
            <Icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function JobCard({ job }: { job: typeof mockJobs[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">{job.name}</CardTitle>
            <Badge className={`${getStatusColor(job.status)} text-white border-none`}>
              {getStatusText(job.status)}
            </Badge>
          </div>
          <CardDescription className="text-slate-400">
            Model: {job.model}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.status === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Step {job.currentStep}/{job.totalSteps}</span>
                <span>~{job.estimatedTime} left</span>
              </div>
            </div>
          )}

          {job.status === 'completed' && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Final Loss:</span>
                <span className="ml-2 text-white font-mono">{job.loss.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-slate-400">Final Reward:</span>
                <span className="ml-2 text-white font-mono">{job.reward.toFixed(3)}</span>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                Completed in {job.completedTime}
              </div>
            </div>
          )}

          {job.status === 'failed' && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{job.error}</span>
            </div>
          )}

          {job.status === 'pending' && (
            <div className="text-center text-slate-400 text-sm">
              Queue position: #{job.queuePosition}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Link href={`/training/${job.id}`}>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </Link>
            {job.status === 'running' && (
              <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState(mockJobs);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.status === 'running' && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 2, 100);
            const newStep = Math.floor((newProgress / 100) * job.totalSteps);
            const newLoss = Math.max(0.1, job.loss - Math.random() * 0.01);
            const newReward = Math.min(1.0, job.reward + Math.random() * 0.005);
            
            return {
              ...job,
              progress: newProgress,
              currentStep: newStep,
              loss: newLoss,
              reward: newReward,
              status: newProgress >= 100 ? 'completed' : 'running'
            };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
                <Link href="/training" className="text-slate-300 hover:text-white transition-colors">Training</Link>
                <Link href="/models" className="text-slate-300 hover:text-white transition-colors">Models</Link>
                <Link href="/datasets" className="text-slate-300 hover:text-white transition-colors">Datasets</Link>
              </nav>
            </div>
            <Link href="/training/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Training
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Training Dashboard</h1>
          <p className="text-slate-300">Monitor and manage your RL training jobs</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Recent Training Jobs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Training Jobs</h2>
            <Link href="/training">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/training/new" className="block">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Training Job
                </Button>
              </Link>
              <Link href="/playground" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Play className="w-4 h-4 mr-2" />
                  Test Model in Playground
                </Button>
              </Link>
              <Link href="/judge" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Run Model Evaluation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">GPU Utilization</span>
                <span className="text-green-400">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Memory Usage</span>
                <span className="text-yellow-400">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Queue Length</span>
                <span className="text-white">2 jobs</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}