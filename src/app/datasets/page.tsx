'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, Upload, Search, Filter, Download, Eye, Trash2, FileText, Database } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const datasets = [
  {
    id: 'python-tutorials',
    name: 'Python Tutorials Dataset',
    description: 'Comprehensive collection of Python programming tutorials and code examples',
    size: '10.2K',
    format: 'JSONL',
    uploaded: '2 days ago',
    modified: '1 day ago',
    tags: ['programming', 'python', 'tutorials'],
    status: 'processed',
    downloadUrl: '/api/datasets/python-tutorials/download',
    preview: [
      { prompt: 'How do I create a list comprehension in Python?', response: 'You can create a list comprehension using the syntax: [expression for item in iterable if condition]' },
      { prompt: 'What is a Python decorator?', response: 'A decorator is a function that modifies the behavior of another function' }
    ]
  },
  {
    id: 'alpaca-format',
    name: 'Alpaca Format Dataset',
    description: 'Instruction following dataset in Alpaca format for fine-tuning chat models',
    size: '52.4K',
    format: 'JSONL',
    uploaded: '1 week ago',
    modified: '3 days ago',
    tags: ['instruction', 'chat', 'alpaca'],
    status: 'processed',
    downloadUrl: '/api/datasets/alpaca-format/download',
    preview: [
      { prompt: 'Explain the concept of machine learning', response: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.' },
      { prompt: 'What is the difference between supervised and unsupervised learning?', response: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.' }
    ]
  },
  {
    id: 'customer-support',
    name: 'Customer Support Chat',
    description: 'Customer service conversations and responses for training support bots',
    size: '25.8K',
    format: 'JSON',
    uploaded: '3 days ago',
    modified: '2 days ago',
    tags: ['support', 'chat', 'customer-service'],
    status: 'processed',
    downloadUrl: '/api/datasets/customer-support/download',
    preview: [
      { prompt: 'How can I reset my password?', response: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.' },
      { prompt: 'What is your return policy?', response: 'We offer a 30-day return policy for all unused items in their original packaging.' }
    ]
  },
  {
    id: 'medical-qa',
    name: 'Medical Q&A Dataset',
    description: 'Medical questions and answers for healthcare assistant training',
    size: '15.3K',
    format: 'JSONL',
    uploaded: '5 days ago',
    modified: '1 day ago',
    tags: ['medical', 'healthcare', 'qa'],
    status: 'processing',
    downloadUrl: null,
    preview: []
  },
  {
    id: 'code-review',
    name: 'Code Review Dataset',
    description: 'Code examples and review comments for improving code quality',
    size: '8.7K',
    format: 'JSONL',
    uploaded: '1 week ago',
    modified: '1 week ago',
    tags: ['code', 'review', 'programming'],
    status: 'processed',
    downloadUrl: '/api/datasets/code-review/download',
    preview: [
      { prompt: 'Review this Python function for potential issues', response: 'The function looks good overall, but I recommend adding input validation and error handling for edge cases.' }
    ]
  }
];

function DatasetCard({ dataset }: { dataset: typeof datasets[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed': return 'Processed';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed';
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-1">{dataset.name}</CardTitle>
              <CardDescription className="text-slate-400 text-sm line-clamp-2">
                {dataset.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status and Format */}
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(dataset.status)} text-white border-none`}>
              {getStatusText(dataset.status)}
            </Badge>
            <Badge variant="outline" className="text-slate-300">
              {dataset.format}
            </Badge>
            <Badge variant="outline" className="text-slate-300">
              {dataset.size} examples
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {dataset.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Preview */}
          {dataset.preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Preview:</p>
              <div className="bg-slate-900/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {dataset.preview.slice(0, 2).map((item, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <p className="text-xs text-slate-400 mb-1">Q: {item.prompt}</p>
                    <p className="text-xs text-slate-200">A: {item.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-700">
            <div>
              <span>Uploaded:</span>
              <span className="ml-1 text-slate-300">{dataset.uploaded}</span>
            </div>
            <div>
              <span>Modified:</span>
              <span className="ml-1 text-slate-300">{dataset.modified}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/datasets/${dataset.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            {dataset.downloadUrl && (
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

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || dataset.format === formatFilter;
    
    return matchesSearch && matchesStatus && matchesFormat;
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
                <Link href="/models" className="text-slate-300 hover:text-white transition-colors">Models</Link>
                <Link href="/datasets" className="text-white font-medium">Datasets</Link>
              </nav>
            </div>
            <Link href="/datasets/upload">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Dataset
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
            <h1 className="text-3xl font-bold text-white mb-2">Datasets</h1>
            <p className="text-slate-300">Manage and organize your training datasets</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search datasets..."
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
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
                <SelectItem value="JSONL">JSONL</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
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
                  <p className="text-sm text-slate-400 mb-1">Total Datasets</p>
                  <p className="text-2xl font-bold text-white">{datasets.length}</p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Examples</p>
                  <p className="text-2xl font-bold text-white">
                    {datasets.reduce((sum, d) => sum + parseFloat(d.size), 0).toFixed(1)}K
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Processed</p>
                  <p className="text-2xl font-bold text-white">
                    {datasets.filter(d => d.status === 'processed').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Processing</p>
                  <p className="text-2xl font-bold text-white">
                    {datasets.filter(d => d.status === 'processing').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Datasets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>

        {/* Empty State */}
        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No datasets found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' || formatFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by uploading your first dataset'
              }
            </p>
            <Link href="/datasets/upload">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Dataset
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}