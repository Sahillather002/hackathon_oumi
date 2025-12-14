'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Play, Eye, Filter, Search, Star, Zap, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const models = [
  {
    id: 'gpt2-base',
    name: 'GPT-2 Base',
    description: 'Original GPT-2 model for text generation',
    parameters: '124M',
    size: '500MB',
    trainingTime: '~30 min',
    accuracy: 6.5,
    status: 'available',
    fineTuned: false,
    downloadUrl: '/api/models/gpt2-base/download',
    tags: ['base-model', 'small', 'fast']
  },
  {
    id: 'gpt2-python',
    name: 'GPT-2 Python Fine-tuned',
    description: 'GPT-2 fine-tuned on Python programming tutorials using GRPO',
    parameters: '124M',
    size: '502MB',
    trainingTime: '~30 min',
    accuracy: 9.2,
    status: 'available',
    fineTuned: true,
    downloadUrl: '/api/models/gpt2-python/download',
    tags: ['fine-tuned', 'python', 'grpo-trained'],
    trainingJob: '1'
  },
  {
    id: 'llama-2-base',
    name: 'Llama-2-7B Base',
    description: 'Meta\'s Llama-2 base model for general tasks',
    parameters: '7B',
    size: '13GB',
    trainingTime: '~2 hours',
    accuracy: 7.8,
    status: 'available',
    fineTuned: false,
    downloadUrl: '/api/models/llama-2-base/download',
    tags: ['base-model', 'medium', 'meta']
  },
  {
    id: 'llama-2-chat',
    name: 'Llama-2-7B Chat Fine-tuned',
    description: 'Llama-2 fine-tuned for conversational AI using GRPO',
    parameters: '7B',
    size: '13.2GB',
    trainingTime: '~2 hours',
    accuracy: 8.9,
    status: 'available',
    fineTuned: true,
    downloadUrl: '/api/models/llama-2-chat/download',
    tags: ['fine-tuned', 'chat', 'grpo-trained'],
    trainingJob: '2'
  },
  {
    id: 'mistral-7b-base',
    name: 'Mistral-7B Base',
    description: 'Mistral AI\'s 7B parameter model with strong reasoning',
    parameters: '7B',
    size: '14GB',
    trainingTime: '~2.5 hours',
    accuracy: 8.2,
    status: 'training',
    fineTuned: false,
    downloadUrl: null,
    tags: ['base-model', 'medium', 'reasoning']
  },
  {
    id: 'falcon-7b',
    name: 'Falcon-7B',
    description: 'Falcon LLM with excellent performance on reasoning tasks',
    parameters: '7B',
    size: '14GB',
    trainingTime: '~2.5 hours',
    accuracy: 8.5,
    status: 'available',
    fineTuned: false,
    downloadUrl: '/api/models/falcon-7b/download',
    tags: ['base-model', 'medium', 'reasoning']
  }
];

function ModelCard({ model }: { model: typeof models[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'training': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'training': return 'Training';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 9) return 'text-green-400';
    if (accuracy >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-1">{model.name}</CardTitle>
              <CardDescription className="text-slate-400 text-sm line-clamp-2">
                {model.description}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(model.status)} text-white border-none`}>
              {getStatusText(model.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Parameters:</span>
              <span className="text-white">{model.parameters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Size:</span>
              <span className="text-white">{model.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Training:</span>
              <span className="text-white">{model.trainingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy:</span>
              <span className={`font-bold ${getAccuracyColor(model.accuracy)}`}>
                {model.accuracy}/10
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {model.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Special Indicators */}
          {model.fineTuned && (
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-xs">Fine-tuned</Badge>
              <Badge variant="outline" className="text-green-400 text-xs">GRPO Trained</Badge>
              {model.trainingJob && (
                <Link href={`/training/${model.trainingJob}`}>
                  <Badge variant="outline" className="text-blue-400 text-xs cursor-pointer hover:bg-blue-400/10">
                    View Training
                  </Badge>
                </Link>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/playground?model=${model.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
            </Link>
            {model.downloadUrl && (
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    
    const matchesSize = sizeFilter === 'all' || 
                         (sizeFilter === 'small' && model.parameters.includes('M')) ||
                         (sizeFilter === 'medium' && model.parameters.includes('B'));
    
    return matchesSearch && matchesStatus && matchesSize;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Logo size="md" showText={true} />
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/training" className="text-slate-300 hover:text-white transition-colors">Training</Link>
                <Link href="/models" className="text-white font-medium">Models</Link>
                <Link href="/datasets" className="text-slate-300 hover:text-white transition-colors">Datasets</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Model Library</h1>
            <p className="text-slate-300">Browse and download available models</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (&lt;1B)</SelectItem>
                <SelectItem value="medium">Medium (1-10B)</SelectItem>
                <SelectItem value="large">Large (&gt;10B)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Models</p>
                  <p className="text-2xl font-bold text-white">{models.length}</p>
                </div>
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Fine-tuned</p>
                  <p className="text-2xl font-bold text-white">
                    {models.filter(m => m.fineTuned).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-white">
                    {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}/10
                  </p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Storage</p>
                  <p className="text-2xl font-bold text-white">68GB</p>
                </div>
                <HardDrive className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No models found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' || sizeFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No models are currently available'
              }
            </p>
            <Link href="/training/new">
              <Button>
                <Brain className="w-4 h-4 mr-2" />
                Train New Model
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}